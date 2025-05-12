import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/projects.model';
import { AdminProjectService } from '../../../services/admin-projects.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../services/modal.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private readonly imageAPIUrl = environment.apiUrl + 'projects/image/';
  currentLayout: 'grid' | 'list' = 'grid';
  projects: Project[] | undefined;
  filteredProjects: Project[] | undefined;
  isAdmin = false;
  
  // Search and filter properties
  searchTerm = '';
  sortOption: 'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc' = 'date-desc';
  selectedTags: string[] = [];
  availableTags: string[] = [];
  showTagsFilter = false;
  showSortsFilter = false;

  // Modal state
  modalVisible = false;
  modalMessage = '';
  projectToDelete: any = null;

  private modalSubscription: Subscription | undefined;

  constructor(
    private adminProjectService: AdminProjectService,
    private authService: AuthService,
    private router: Router,
    protected globalService: GlobalService,
    protected modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadProjects();

    const savedLayout = localStorage.getItem('projectLayout');
    if (savedLayout === 'grid' || savedLayout === 'list') {
      this.currentLayout = savedLayout;
    }

    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isAdmin = isAuthenticated;
    });

    // Subscribe to modal state changes
    this.modalSubscription = this.modalService.modalState$.subscribe(
      (state) => {
        this.modalVisible = state.isVisible;
        this.modalMessage = state.message;
      }
    );
  }

  loadProjects(): void {
    this.adminProjectService.getProjects().subscribe(
      (projects: Project[]) => {
        projects.forEach((project) => {
          project.imageUrl.grid = this.imageAPIUrl + project.imageUrl.grid;
          project.imageUrl.list = this.imageAPIUrl + project.imageUrl.list;
        });
        this.projects = projects;
        this.filteredProjects = [...projects];
        
        // Extract all unique tags for the filter
        this.extractAvailableTags();
        
        // Apply initial sorting
        this.applySorting();
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  extractAvailableTags(): void {
    if (!this.projects) return;
    
    // Create a Set to ensure unique tags
    const tagsSet = new Set<string>();
    this.projects.forEach(project => {
      project.tags.forEach(tag => {
        tagsSet.add(tag);
      });
    });
    
    this.availableTags = Array.from(tagsSet).sort();
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  setLayout(layout: 'grid' | 'list'): void {
    this.currentLayout = layout;
    localStorage.setItem('projectLayout', layout);
  }

  editProject(project: any): void {
    this.router.navigate([
      '/projects/admin/edit',
      project._id || project.title,
    ]);
  }

  deleteProject(project: any): void {
    this.modalService
      .open({
        message: 'Are you sure you want to delete this project?',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.adminProjectService.deleteProject(project._id).subscribe(
            () => {
              // Remove the deleted project from the projects array
              this.projects = this.projects?.filter(
                (p) => p._id !== project._id
              );
              // Also update filtered projects
              this.filteredProjects = this.filteredProjects?.filter(
                (p) => p._id !== project._id
              );
              
              // Update available tags
              this.extractAvailableTags();
            },
            (error) => {
              console.error('Error deleting project:', error);
            }
          );
        }
      });
  }

  searchProjects(): void {
    this.applyFilters();
  }

  toggleTagSelection(tag: string): void {
    if (this.selectedTags.includes(tag)) {
      // Remove tag if already selected
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      // Add tag to selection
      this.selectedTags.push(tag);
    }
    
    this.applyFilters();
  }

  toggleSortsFilter(): void {
    this.showSortsFilter = !this.showSortsFilter;
  }

  toggleTagsFilter(): void {
    this.showTagsFilter = !this.showTagsFilter;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedTags = [];
    this.applyFilters();
  }

  setSortOption(option: 'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc'): void {
    this.sortOption = option;
    this.applySorting();
  }

  private applyFilters(): void {
    if (!this.projects) return;
    
    // Start with all projects
    let filtered = [...this.projects];
    
    // Apply search term filter
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply tags filter
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(project => 
        this.selectedTags.some(tag => project.tags.includes(tag))
      );
    }
    
    this.filteredProjects = filtered;
    
    // Apply sorting after filtering
    this.applySorting();
  }

  private applySorting(): void {
    if (!this.filteredProjects) return;
    
    switch (this.sortOption) {
      case 'date-desc':
        this.filteredProjects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        this.filteredProjects.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'alpha-asc':
        this.filteredProjects.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'alpha-desc':
        this.filteredProjects.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
  }
}
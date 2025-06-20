import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/projects.model';
import { AdminProjectService } from '../../../services/admin-projects.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../services/modal.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule, 
    ConfirmationModalComponent, 
    FormsModule,
    LoaderComponent
  ],
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

  // Image loading state
  imagesLoading = true;
  totalImages = 0;
  loadedImages = 0;

  private modalSubscription: Subscription | undefined;
  private searchTerms = new Subject<string>();

  constructor(
    private adminProjectService: AdminProjectService,
    private authService: AuthService,
    private router: Router,
    protected globalService: GlobalService,
    protected modalService: ModalService,
    private elementRef: ElementRef
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

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.searchProjects();
    });

    this.checkOrientation();
    window.addEventListener('resize', () => this.checkOrientation());
  }

  loadProjects(): void {
    this.imagesLoading = true;
    this.loadedImages = 0;
    
    this.adminProjectService.getProjects().subscribe(
      (projects: Project[]) => {
        projects.forEach((project) => {
          project.imageUrl.grid = this.imageAPIUrl + project.imageUrl.grid;
          project.imageUrl.list = this.imageAPIUrl + project.imageUrl.list;
        });
        this.projects = projects;
        this.filteredProjects = [...projects];
        
        this.totalImages = projects.length * 2; // Grid and list image for each project
        
        // If there are no projects, stop showing loader
        if (this.totalImages === 0) {
          this.imagesLoading = false;
        }
        
        this.extractAvailableTags();
        
        this.applySorting();
      },
      (error) => {
        console.error('Error fetching projects:', error);
        this.imagesLoading = false; // Stop loading on error
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
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
    window.removeEventListener('resize', () => this.checkOrientation());
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

  updateSearch(term: string): void {
    this.searchTerm = term;
    this.searchTerms.next(term);
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

  toggleSortsFilter(event: MouseEvent): void {
    event.stopPropagation();
    this.showSortsFilter = !this.showSortsFilter;
    
    // Close the other dropdown if open
    if (this.showSortsFilter && this.showTagsFilter) {
      this.showTagsFilter = false;
    }
  }

  toggleTagsFilter(event: MouseEvent): void {
    event.stopPropagation();
    this.showTagsFilter = !this.showTagsFilter;
    
    // Close the other dropdown if open
    if (this.showTagsFilter && this.showSortsFilter) {
      this.showSortsFilter = false;
    }
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

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.showSortsFilter) {
      const sortElement = this.elementRef.nativeElement.querySelector('.sort-dropdown');
      if (sortElement && !sortElement.contains(event.target as Node)) {
        this.showSortsFilter = false;
      }
    }
    
    if (this.showTagsFilter) {
      const tagsElement = this.elementRef.nativeElement.querySelector('.tags-filter');
      if (tagsElement && !tagsElement.contains(event.target as Node)) {
        this.showTagsFilter = false;
      }
    }
  }

  handleOptionClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  downloadProjects(): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.projects));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'projects.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  checkOrientation(): void {
    // Force grid view on portrait mobile
    if (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) {
      this.currentLayout = 'grid';
    }
  }

  // Add a new method to handle image loads
  onImageLoad(): void {
    this.loadedImages++;
    if (this.loadedImages >= this.totalImages && this.totalImages > 0) {
      // Add a small delay to prevent flickering
      setTimeout(() => {
        this.imagesLoading = false;
      }, 300);
    }
  }
}
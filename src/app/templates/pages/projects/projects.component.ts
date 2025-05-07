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

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit, OnDestroy {
  imageAPIUrl = 'http://localhost:3000/api/projects/image/';
  currentLayout: 'grid' | 'list' = 'grid';
  projects: Project[] | undefined;
  isAdmin = false;
  
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
    this.adminProjectService.getProjects().subscribe(
      (projects: Project[]) => {
        projects.forEach((project) => {
          project.imageUrl.grid = this.imageAPIUrl + project.imageUrl.grid;
          project.imageUrl.list = this.imageAPIUrl + project.imageUrl.list;
        });
        this.projects = projects;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );

    const savedLayout = localStorage.getItem('projectLayout');
    if (savedLayout === 'grid' || savedLayout === 'list') {
      this.currentLayout = savedLayout;
    }

    this.authService.isAuthenticated().subscribe(
      isAuthenticated => {
        this.isAdmin = isAuthenticated;
      }
    );

    // Subscribe to modal state changes
    this.modalSubscription = this.modalService.modalState$.subscribe(state => {
      this.modalVisible = state.isVisible;
      this.modalMessage = state.message;
    });
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
    // Navigate to admin page with project title
    this.router.navigate(['/projects/admin/edit', project._id || project.title]);
  }
  
  deleteProject(project: any): void {
    this.modalService.open({
      message: 'Are you sure you want to delete this project?'
    }).then(confirmed => {
      if (confirmed) {
        this.adminProjectService.deleteProject(project._id).subscribe(
          () => {
            // Remove the deleted project from the projects array
            this.projects = this.projects?.filter(p => p._id !== project._id);
            alert('Project deleted successfully');
          },
          (error) => {
            console.error('Error deleting project:', error);
            alert('Error deleting project');
          }
        );
      }
    });
  }
}
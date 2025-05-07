import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/projects.model';
import { AdminProjectService } from '../../../services/admin-projects.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {
  imageAPIUrl = 'http://localhost:3000/api/projects/image/';
  currentLayout: 'grid' | 'list' = 'grid';
  projects: Project[] | undefined;
  isAdmin = false;

  constructor(
    private adminProjectService: AdminProjectService,
    private authService: AuthService,
    private router: Router,
    protected global: GlobalService
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
    return;
  }
}
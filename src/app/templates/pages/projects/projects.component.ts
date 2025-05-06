import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/projects.model';
import { AdminProjectService } from '../../../services/admin-projects.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {
  currentLayout: 'grid' | 'list' = 'grid';
  projects: Project[] | undefined;
  constructor(private adminProjectService: AdminProjectService) {}

  ngOnInit(): void {
    
    this.adminProjectService.getProjects().subscribe(
      (projects: Project[]) => {
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
  }

  setLayout(layout: 'grid' | 'list'): void {
    this.currentLayout = layout;
    localStorage.setItem('projectLayout', layout);
  }
}
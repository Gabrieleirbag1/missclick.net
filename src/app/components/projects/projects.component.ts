import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import projectsData from '../../../assets/data/projects.json';
import { Project } from '../../models/projects.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {
  projects: Project[] = projectsData;
  currentLayout: 'grid' | 'list' = 'grid';

  constructor() { }

  ngOnInit(): void {
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
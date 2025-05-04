import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import projectsData from '../../../assets/data/projects.json';

interface Project {
  title: string;
  description: string[];
  imageUrl: string;
  link: string;
  date: string;
  tags: string[];
  technologies: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = projectsData;
  currentLayout: 'grid' | 'list' = 'grid'; // Default to grid view

  constructor() { }

  ngOnInit(): void {
    // Check if user has a preferred layout saved in localStorage
    const savedLayout = localStorage.getItem('projectLayout');
    if (savedLayout === 'grid' || savedLayout === 'list') {
      this.currentLayout = savedLayout;
    }
  }

  setLayout(layout: 'grid' | 'list'): void {
    this.currentLayout = layout;
    // Save user preference
    localStorage.setItem('projectLayout', layout);
  }
}
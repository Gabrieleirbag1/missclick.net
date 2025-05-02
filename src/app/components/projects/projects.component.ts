import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Project {
  title: string;
  tags: Array<"Software" | "Website" | "Mobile" | "Game" | "DevOps" | "Other">;
  description: string[];
  technologies: string[];
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      title: 'Project 1',
      tags: ["Website", "Software"],
      description: [
        'Description of project 1.',
        'Another line of description for project 1.',
      ],
      technologies: ['HTML', 'CSS', 'JavaScript'],
      imageUrl: 'assets/images/hobbies/jeux-video.avif',
      link: 'google.com',
    },
    {
      title: 'Project 2',
      tags: ["Website", "Software"],
      description: [
        'Description of project 2.',
        'Another line of description for project 2.',
      ],
      technologies: ['React', 'Node.js'],
      imageUrl: 'assets/images/project2.jpg',
      link: 'google.com',
    },
  ];
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-projects-cta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-cta.component.html',
  styleUrls: ['./projects-cta.component.css']
})
export class ProjectsCtaComponent {
  
  constructor(
    private router: Router,
    private globalService: GlobalService
  ) {}
  
  navigateToProjects(): void {
    this.globalService.redirect('/projects');
  }
}

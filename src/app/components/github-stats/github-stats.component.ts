import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-github-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './github-stats.component.html',
  styleUrls: ['./github-stats.component.css']
})
export class GithubStatsComponent implements OnInit {
  username = 'Gabrieleirbag1';
  activeModal: string | null = null;
  currentTime = new Date();
  githubStats: any = {};
  
  constructor(
    private githubService: GithubService,
    private ngZone: NgZone
  ) {}
  
  ngOnInit(): void {
    // Update the time every minute
    this.githubStats.stars = 12;

    setInterval(() => {
      this.ngZone.run(() => {
        this.currentTime = new Date();
      });
    }, 60000);
  }
  
  openModal(modalType: string): void {
    this.activeModal = modalType;
  }
  
  closeModal(): void {
    this.activeModal = null;
  }
  
  getModalTitle(): string {
    switch(this.activeModal) {
      case 'languages':
        return 'Programming Languages';
      case 'profile':
        return 'GitHub Profile Stats';
      case 'contributions':
        return 'Contribution Streak';
      case 'stars':
        return 'Starred Repositories';
      default:
        return 'GitHub Statistics';
    }
  }
  
  getModalIcon(): string {
    switch(this.activeModal) {
      case 'languages':
        return 'assets/icons/chart-icon.png';
      case 'profile':
        return 'assets/icons/github-icon.png';
      case 'contributions':
        return 'assets/icons/calendar-icon.png';
      case 'stars':
        return 'assets/icons/star-icon.png';
      default:
        return 'assets/icons/github-icon.png';
    }
  }
}
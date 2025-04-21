import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';

interface ModalInfo {
  type: string;
  title: string;
  iconSrc: string;
}

@Component({
  selector: 'app-github-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './github-stats.component.html',
  styleUrls: ['./github-stats.component.css']
})
export class GithubStatsComponent implements OnInit {
  username = 'Gabrieleirbag1';
  activeModal: ModalInfo | null = null;
  currentTime = new Date();
  githubStats: any = {};
  
  // Define icons with their details
  desktopIcons = [
    {
      type: 'languages',
      title: 'Programming Languages',
      iconSrc: 'assets/icons/languages.png',
      label: 'Languages'
    },
    {
      type: 'profile',
      title: 'GitHub Profile Stats',
      iconSrc: 'assets/icons/stats.png',
      label: 'GitHub Stats'
    },
    {
      type: 'contributions',
      title: 'Contribution Streak',
      iconSrc: 'assets/icons/contributions.png',
      label: 'Contributions'
    },
    {
      type: 'stars',
      title: 'Total Stars earned',
      iconSrc: 'assets/icons/stars.webp',
      label: 'Stars'
    }
  ];
  
  constructor(
    private githubService: GithubService,
    private ngZone: NgZone
  ) {}
  
  ngOnInit(): void {
    // Update the time every minute
    this.githubStats.stars = 12; // temporary value

    setInterval(() => {
      this.ngZone.run(() => {
        this.currentTime = new Date();
      });
    }, 60000);
  }
  
  openModal(modalType: string): void {
    // Find the icon info from desktopIcons array
    const iconInfo = this.desktopIcons.find(icon => icon.type === modalType);
    if (iconInfo) {
      this.activeModal = iconInfo;
    }
  }
  
  closeModal(): void {
    this.activeModal = null;
  }
}
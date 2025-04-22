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
    },
    {
      type: 'commits',
      title: 'Total Commits',
      iconSrc: 'assets/icons/commits.png',
      label: 'Commits'
    },
    {
      type: 'followers',
      title: 'Followers',
      iconSrc: 'assets/icons/followers.png',
      label: 'Followers'
    },
    {
      type: 'pullRequests',
      title: 'Pull Requests',
      iconSrc: 'assets/icons/pull-requests.png',
      label: 'Pull Requests'
    },
    {
      type: 'issues',
      title: 'Issues',
      iconSrc: 'assets/icons/issues.png',
      label: 'Issues'
    }
  ];
  
  constructor(
    private githubService: GithubService,
    private ngZone: NgZone
  ) {}
  
  ngOnInit(): void {
    this.githubService.getAllStats().subscribe(stats => {
      console.log('All GitHub Stats:', stats);
      this.githubStats = {
        repos: stats.profile.public_repos + (stats.profile.total_private_repos || 0),
        stars: stats.stars,
        commits: stats.commits,
        followers: stats.followers,
        pullRequests: stats.pullRequests,
        issues: stats.issues
      };
    });

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
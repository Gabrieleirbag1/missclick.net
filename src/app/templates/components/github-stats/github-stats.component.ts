import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../../services/github.service';
import desktopIconsData from '../../../../assets/data/desktop-icons.json';
import { GlobalService, MusicPlayer } from '../../../services/global.service';

interface ModalInfo {
  type: string;
  title: string;
  iconSrc: string;
}

interface DesktopIcon extends ModalInfo {
  label: string;
}

@Component({
    selector: 'app-github-stats',
    imports: [CommonModule],
    templateUrl: './github-stats.component.html',
    styleUrls: ['./github-stats.component.css']
})
export class GithubStatsComponent implements OnInit {
  username = 'Gabrieleirbag1';
  activeModal: ModalInfo | null = null;
  currentTime: Date = new Date();
  githubStats: any = {};
  desktopIcons: DesktopIcon[] = desktopIconsData;
  musicPlayer: MusicPlayer = new MusicPlayer('assets/sounds/windows-xp-startup.mp3', 0.85);

  constructor(private githubService: GithubService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.githubService.getAllStats().subscribe((stats) => {
      this.githubStats = {
        repos:
          stats.profile.public_repos + (stats.profile.total_private_repos || 0),
        stars: stats.stars,
        commits: stats.commits,
        followers: stats.followers,
        pullRequests: stats.pullRequests,
        issues: stats.issues,
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
    const iconInfo = this.desktopIcons.find((icon) => icon.type === modalType);
    if (iconInfo) {
      this.activeModal = iconInfo;
    }
  }

  closeModal(): void {
    this.activeModal = null;
  }
}

import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-github-stats',
  templateUrl: './github-stats.component.html',
  styleUrls: ['./github-stats.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule],
})
export class GithubStatsComponent implements OnInit {
  githubData: any;
  repos: any[] = [];

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {
    this.githubService.getUserProfile().subscribe((data) => {
      this.githubData = data;
    });

    this.githubService.getRepos().subscribe((data) => {
      this.repos = data;
    });

  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, from, mergeMap} from 'rxjs';
import { SecretsService } from './secrets.service';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private githubUsername = 'Gabrieleirbag1';
  private token: string | undefined;

  constructor(
    private http: HttpClient,
    private secretsService: SecretsService
  ) {
    this.loadSecretToken();
  }

  private loadSecretToken(): void {
    this.secretsService.loadSecrets().subscribe(secrets => {
      if (secrets.githubToken) {
        this.token = secrets.githubToken;
      } else {
        this.token = '';
      }
    });
  }


  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `token ${this.token}`,
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`https://api.github.com/users/${this.githubUsername}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getRepos(): Observable<any> {
    return this.http.get(
      `https://api.github.com/users/${this.githubUsername}/repos?per_page=100`,
      { headers: this.getAuthHeaders() }
    );
  }

  getFollowers(): Observable<any> {
    return this.http.get(
      `https://api.github.com/users/${this.githubUsername}/followers?per_page=100`,
      { headers: this.getAuthHeaders() }
    );
  }

  getTotalStars(): Observable<number> {
    return this.getRepos().pipe(
      mergeMap((repos: any[]) => {
        const starCount = repos.reduce(
          (total, repo) => total + repo.stargazers_count,
          0
        );
        return from([starCount]);
      })
    );
  }

  getTotalCommits(): Observable<number> {
    return this.getRepos().pipe(
      mergeMap((repos: any[]) => {
        // Create an array of observables for fetching commits from each repo
        const commitRequests = repos.map((repo) =>
          this.http.get(
            `https://api.github.com/repos/${this.githubUsername}/${repo.name}/commits?per_page=1`,
            {
              headers: this.getAuthHeaders(),
              observe: 'response',
            }
          )
        );

        // Use forkJoin to execute all requests in parallel
        return forkJoin(commitRequests);
      }),
      mergeMap((responses: any[]) => {
        // Extract commit counts from Link header or assume 1 if no link header
        let totalCommits = 0;

        responses.forEach((response) => {
          const linkHeader = response.headers.get('Link');
          if (linkHeader && linkHeader.includes('rel="last"')) {
            // Extract page count from Link header
            const matches = linkHeader.match(/page=(\d+)>; rel="last"/);
            if (matches && matches[1]) {
              totalCommits += parseInt(matches[1], 10);
            }
          } else {
            // If no pagination, count the commits directly
            totalCommits += response.body.length || 0;
          }
        });

        return from([totalCommits]);
      })
    );
  }

  getTotalPullRequests(): Observable<number> {
    return this.http
      .get(
        `https://api.github.com/search/issues?q=author:${this.githubUsername}+type:pr`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(mergeMap((response: any) => from([response.total_count])));
  }

  getTotalIssues(): Observable<number> {
    return this.http
      .get(
        `https://api.github.com/search/issues?q=author:${this.githubUsername}+type:issue`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(mergeMap((response: any) => from([response.total_count])));
  }

  getAllStats(): Observable<any> {
    return forkJoin({
      profile: this.getUserProfile(),
      repos: this.getRepos(),
      stars: this.getTotalStars(),
      commits: this.getTotalCommits(),
      pullRequests: this.getTotalPullRequests(),
      issues: this.getTotalIssues(),
      followers: this.getFollowers().pipe(
        mergeMap((followers: any[]) => from([followers.length]))
      ),
    });
  }
}

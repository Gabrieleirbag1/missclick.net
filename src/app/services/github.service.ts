import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from, mergeMap, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private username = 'Gabrieleirbag1';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get(`https://api.github.com/users/${this.username}`);
  }

  getRepos(): Observable<any> {
    return this.http.get(`https://api.github.com/users/${this.username}/repos`);
  }

}

//https://github-readme-stats.vercel.app/api?username=Gabrieleirbag1&show_icons=true&theme=radical
//https://github-readme-streak-stats.terminalkuapp.com/?user=Gabrieleirbag1&theme=dark
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Secrets {
  githubToken?: string;
  username?: string;
  password?: string;
  [key: string]: string | undefined;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SecretsService {
  private readonly secretsUrl = `${environment.apiUrl}secrets`;
  private secretsSubject = new BehaviorSubject<Secrets>({});
  public secrets$ = this.secretsSubject.asObservable();

  private secretsLoaded = false;

  constructor(private http: HttpClient) {}

  /**
   * Check if secrets have been loaded
   */
  areSecretsLoaded(): boolean {
    return this.secretsLoaded;
  }

  loadGithubToken(): Observable<string | null> {
    return this.http
      .get<{ githubToken: string }>(`${this.secretsUrl}/githubToken`)
      .pipe(
        map((response) => response.githubToken),
        tap((token) => {
          const currentSecrets = this.secretsSubject.getValue();
          this.secretsSubject.next({ ...currentSecrets, githubToken: token });
          this.secretsLoaded = true;
        }),
        catchError((error) => {
          console.error('Error loading GitHub token:', error);
          return of(null);
        })
      );
  }

  /**
   * Validate login credentials through API
   */
  validateCredentials(username: string, password: string): Observable<boolean> {
    // Send credentials directly in the request body
    return this.http
      .post<LoginResponse>(`${this.secretsUrl}/login`, { username, password })
      .pipe(
        map((response) => response.success),
        catchError((error) => {
          console.error('Error validating credentials:', error);
          return of(false);
        })
      );
  }
}

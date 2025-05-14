import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Secrets {
  githubToken?: string;
  username?: string;
  password?: string;
  [key: string]: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class SecretsService {
  private readonly secretsUrl = `${environment.apiUrl}secrets`;
  private secretsSubject = new BehaviorSubject<Secrets>({});
  public secrets$ = this.secretsSubject.asObservable();
  
  // Track if secrets are loaded
  private secretsLoaded = false;

  constructor(private http: HttpClient) {}

  /**
   * Loads all available secrets from the API
   */
  loadSecrets(): Observable<Secrets> {
    if (this.secretsLoaded) {
      return of(this.secretsSubject.value);
    }
    
    return this.http.get<Secrets>(this.secretsUrl).pipe(
      tap(secrets => {
        this.secretsLoaded = true;
        this.secretsSubject.next(secrets);
      }),
      catchError(error => {
        console.error('Error loading secrets:', error);
        return of({} as Secrets);
      })
    );
  }

  /**
   * Get a specific secret by key
   */
  getSecret(key: string): string | undefined {
    return this.secretsSubject.value[key];
  }

  /**
   * Get GitHub token specifically
   */
  getGithubToken(): string | undefined {
    return this.getSecret('githubToken');
  }

  /**
   * Check if secrets have been loaded
   */
  areSecretsLoaded(): boolean {
    return this.secretsLoaded;
  }
}
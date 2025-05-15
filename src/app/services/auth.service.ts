import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SecretsService } from './secrets.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasStoredSession());
  
  constructor(private secretsService: SecretsService) {}
  
  login(username: string, password: string): Observable<boolean> {
    return this.secretsService.validateCredentials(username, password).pipe(
      tap(isValid => {
        if (isValid) {
          localStorage.setItem('isAuthenticated', 'true');
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticatedSubject.next(false);
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  
  hasStoredSession(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
}
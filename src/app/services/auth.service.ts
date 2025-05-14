import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SecretsService } from './secrets.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasStoredSession());
  private username: string | undefined;
  private  password: string | undefined;
  
  constructor(private secretsService: SecretsService) {
    this.secretsService.loadSecrets().subscribe(secrets => {
      this.username = secrets.username;
      this.password = secrets.password;
    });
  }
  
  login(username: string, password: string): boolean {
    if (this.username && this.password) {
      if (username === this.username && password === this.password) {
        localStorage.setItem('isAuthenticated', 'true');
        this.isAuthenticatedSubject.next(true);
        return true;
      }
    }
    return false;
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
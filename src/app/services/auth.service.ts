import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasStoredSession());
  
  constructor() {}
  
  login(username: string, password: string): boolean {
    // Hard-coded credentials from environment
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isAuthenticated', 'true');
      this.isAuthenticatedSubject.next(true);
      return true;
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
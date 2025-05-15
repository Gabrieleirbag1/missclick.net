import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) {
    // Redirect to admin if already logged in
    if (this.authService.hasStoredSession()) {
      this.router.navigate(['/projects']);
    }
  }
  
  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.username, this.password).subscribe({
      next: (isValid) => {
        this.isLoading = false;
        if (isValid) {
          this.router.navigate(['/projects']);
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}
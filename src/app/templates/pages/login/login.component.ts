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
  
  constructor(private authService: AuthService, private router: Router) {
    // Redirect to admin if already logged in
    if (this.authService.hasStoredSession()) {
      this.router.navigate(['/projects']);
    }
  }
  
  onSubmit(): void {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/projects']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
import { Routes } from '@angular/router';
import { HomeComponent } from './templates/pages/home/home.component';
import { ProjectsComponent } from './templates/pages/projects/projects.component';
import { AdminComponent } from './templates/pages/admin/admin.component';
import { LoginComponent } from './templates/pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Default route to home
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent},
  { path: 'login', component: LoginComponent },
  { path: 'projects/admin', component: AdminComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }  // Redirect any unknown routes to home
];
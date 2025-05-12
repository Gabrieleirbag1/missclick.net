import { Routes } from '@angular/router';
import { HomeComponent } from './templates/pages/home/home.component';
import { ProjectsComponent } from './templates/pages/projects/projects.component';
import { AdminComponent } from './templates/pages/admin/admin.component';
import { LoginComponent } from './templates/pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { LoadingGuard } from './guards/loading.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [LoadingGuard] },
  { path: 'home', component: HomeComponent, canActivate: [LoadingGuard]  },
  { path: 'projects', component: ProjectsComponent, canActivate: [LoadingGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoadingGuard] },
  { path: 'projects/admin', component: AdminComponent, canActivate: [authGuard, LoadingGuard] },
  { path: 'projects/admin/edit/:id', component: AdminComponent, canActivate: [authGuard, LoadingGuard] },
  { path: '**', redirectTo: '' }
];
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Default route to home
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent},
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }  // Redirect any unknown routes to home
];
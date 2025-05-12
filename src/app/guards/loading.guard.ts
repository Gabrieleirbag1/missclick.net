import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationEnd } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingGuard implements CanActivate {
  constructor(
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(() => {
        setTimeout(() => {
          this.loadingService.hideLoader();
        }, 500);
      })
    ).subscribe();
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.loadingService.showLoader();
    return true;
  }
}
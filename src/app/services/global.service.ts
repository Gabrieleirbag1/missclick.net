import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private router: Router) {}

  redirect(page: string): void {
    this.router.navigate([page]);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}

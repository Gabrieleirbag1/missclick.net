import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private router: Router) {}

  redirect(page: string): void {
    this.router.navigate([page]);
    this.scroll();
  }

  scroll(direction: number = 0, behavior: ScrollBehavior = 'smooth') : void {
    window.scrollTo({
      top: direction,
      behavior: behavior,
    });
  }
}

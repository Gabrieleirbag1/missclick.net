import { Directive, HostListener, Input } from '@angular/core';
import { HeaderComponent } from '../templates/layout/header/header.component';

@Directive({
  selector: '[appCloseSidebar]',
  standalone: true
})
export class CloseSidebarDirective {
  @Input() excludeToggle = false;

  constructor(private header: HeaderComponent) {}

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    // If this is a submenu toggle and we want to exclude it, do nothing
    if (this.excludeToggle && (event.target as HTMLElement).classList.contains('arrow')) {
      return;
    }
    
    this.header.closeSidebar();
  }
}
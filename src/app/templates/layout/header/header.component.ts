import {
  Component,
  AfterViewInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ContactModalComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit {
  isModalOpen = false;
  isSidebarOpen = false;
  isHomeSubmenuOpen = false;

  constructor(private elementRef: ElementRef, private router: Router) {}

  @HostListener('window:resize')
  onResize() {
    this.updateHeaderHeight();
  }

  toggleContactModal(event: Event): void {
    event.preventDefault();
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  toggleMenu(): void {
    this.isSidebarOpen = !this.isSidebarOpen;

    if (this.isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
    document.body.style.overflow = '';
  }

  toggleSubmenu(submenu: string, event: Event): void {
    event.stopPropagation();

    if (submenu === 'home') {
      this.isHomeSubmenuOpen = !this.isHomeSubmenuOpen;
    }
    // Add more submenus as needed
  }

  scrollToSection(sectionId: string): void {
    // First navigate to home page if not already there
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        // After navigation, wait for section to be in DOM
        setTimeout(() => {
          this.scrollToElement(sectionId);
          this.closeSidebar();
        }, 300);
      });
    } else {
      this.scrollToElement(sectionId);
      this.closeSidebar();
    }
  }

  private scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngAfterViewInit() {
    this.updateHeaderHeight();
  }

  private updateHeaderHeight() {
    const headerHeight = this.elementRef.nativeElement.offsetHeight;
    document.documentElement.style.setProperty(
      '--header-height',
      `${headerHeight}px`
    );
  }
}

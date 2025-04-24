import { Component, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ContactModalComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  
  isModalOpen = false;
  isSidebarOpen = false;

  constructor(private elementRef: ElementRef) {}

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
    
    // Prevent scrolling when sidebar is open
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

  ngAfterViewInit() {
    this.updateHeaderHeight();
  }

  private updateHeaderHeight() {
    const headerHeight = this.elementRef.nativeElement.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }
}
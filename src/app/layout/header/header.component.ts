import { Component, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ContactModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  
  isModalOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('window:resize')

  toggleContactModal(event: Event): void {
    event.preventDefault();
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onResize() {
    this.updateHeaderHeight();
  }

  ngAfterViewInit() {
    this.updateHeaderHeight();
  }

  private updateHeaderHeight() {
    const headerHeight = this.elementRef.nativeElement.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }
}
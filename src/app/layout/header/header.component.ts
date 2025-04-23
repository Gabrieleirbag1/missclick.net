import { Component, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  
  constructor(private elementRef: ElementRef) {}

  @HostListener('window:resize')
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
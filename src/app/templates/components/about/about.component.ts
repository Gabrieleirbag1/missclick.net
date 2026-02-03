import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import aboutImagesData from '../../../../assets/data/about-images.json';

@Component({
    selector: 'app-about',
    imports: [CommonModule],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  images: string[] = aboutImagesData;
  
  currentImageIndex: number = 0;
  private intervalId: any;
  
  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 250);
  }
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  get currentImage(): string {
    return `assets/images/about/${this.images[this.currentImageIndex]}`;
  }
}
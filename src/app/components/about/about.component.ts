import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit, OnDestroy {
  // List of images in alphabetical order
  images: string[] = [
    'fnatic.png',
    'france.png'
    // Add other image filenames here in alphabetical order
  ];
  
  currentImageIndex: number = 0;
  private intervalId: any;
  
  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 1000);
  }
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  
  get currentImage(): string {
    return `assets/about/${this.images[this.currentImageIndex]}`;
  }
}
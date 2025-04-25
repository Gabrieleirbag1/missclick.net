import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Hobby {
  title: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hobbies.component.html',
  styleUrl: './hobbies.component.css'
})
export class HobbiesComponent {
  hobbies: Hobby[] = [
    {
      title: 'The Piano',
      description: 'Here are some of my hobbies:',
      imageUrl: 'assets/hobbies/piano.png'
    },
    {
      title: 'E-Sport',
      description: 'Here are some of my hobbies:',
      imageUrl: 'assets/hobbies/piano.png'
    }
  ];

  currentIndex = 0;

  previousSlide(): void {
    this.currentIndex = this.currentIndex === 0 ? this.hobbies.length - 1 : this.currentIndex - 1;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.hobbies.length;
  }
}
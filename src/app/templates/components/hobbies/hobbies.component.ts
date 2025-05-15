import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import hobbiesData from '../../../../assets/data/hobbies.json';
import { GlobalService } from '../../../services/global.service';

interface Hobby {
  title: string;
  description: string[];
  imageUrl: string;
  replaceBackground: boolean;
}

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hobbies.component.html',
  styleUrl: './hobbies.component.css'
})
export class HobbiesComponent {

  constructor(protected globalService: GlobalService) {}

  hobbies: Hobby[] = hobbiesData;

  currentIndex = 0;

  previousSlide(): void {
    this.currentIndex = this.currentIndex === 0 ? this.hobbies.length - 1 : this.currentIndex - 1;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.hobbies.length;
  }

  playPiano(): void {
    console.log('Playing piano sound');
    this.globalService.playSound('assets/sounds/Essais_-_Miphas_Theme.mp3', 0.5);
  }
}
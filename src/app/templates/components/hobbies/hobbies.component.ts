import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import hobbiesData from '../../../../assets/data/hobbies.json';
import { MusicPlayer } from '../../../services/global.service';

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
export class HobbiesComponent implements OnInit, OnDestroy {

  constructor() {}

  hobbies: Hobby[] = hobbiesData;
  musicPlayer: MusicPlayer = new MusicPlayer('assets/sounds/Essais_-_Miphas_Theme.mp3', 0.5);

  currentIndex = 0;

  isPianoPlaying: boolean = false;

  ngOnInit(): void {
    const audioElement = this.musicPlayer['audio'] as HTMLAudioElement;
    audioElement.addEventListener('ended', this.onAudioEnded.bind(this));
  }

  ngOnDestroy(): void {
    const audioElement = this.musicPlayer['audio'] as HTMLAudioElement;
    audioElement.removeEventListener('ended', this.onAudioEnded.bind(this));
  }

  onAudioEnded(): void {
    this.isPianoPlaying = false;
  }

  previousSlide(): void {
    this.currentIndex = this.currentIndex === 0 ? this.hobbies.length - 1 : this.currentIndex - 1;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.hobbies.length;
  }

  playPiano(): void {
    if (this.isPianoPlaying) {
      this.musicPlayer.pause();
    }
    else {
      this.musicPlayer.play();
    }
    this.isPianoPlaying = !this.isPianoPlaying;
  }
}
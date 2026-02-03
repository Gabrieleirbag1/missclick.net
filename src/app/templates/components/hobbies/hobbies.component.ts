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

  isMobileView: boolean = false;

  ngOnInit(): void {
    const audioElement = this.musicPlayer['audio'] as HTMLAudioElement;
    audioElement.addEventListener('ended', this.onAudioEnded.bind(this));

    this.checkScreenSize();

    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  ngOnDestroy(): void {
    const audioElement = this.musicPlayer['audio'] as HTMLAudioElement;
    audioElement.removeEventListener('ended', this.onAudioEnded.bind(this));

    window.removeEventListener('resize', this.checkScreenSize.bind(this));
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

  checkScreenSize(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  getBackgroundStyle(hobby: Hobby): any {
    if (!hobby.replaceBackground) {
      return {};
    }

    if (this.isMobileView) {
      return {
        'background-image': `linear-gradient(to bottom, 
                             rgba(255, 255, 255, 0.9) 0%, 
                             rgba(140, 140, 140, 0.9) calc(100% - 200px), 
                             transparent 100%), 
                             url(${hobby.imageUrl})`
      };
    } else {
      return {
        'background-image': `-webkit-linear-gradient(-20deg, rgba(255, 255, 255, 0.9) 45%, transparent 0%), url(${hobby.imageUrl})`
      };
    }
  }
}
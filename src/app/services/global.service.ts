import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(private router: Router) {}

  redirect(page: string): void {
    this.router.navigate([page]);
    this.scroll();
  }

  scroll(direction: number = 0, behavior: ScrollBehavior = 'smooth') : void {
    window.scrollTo({
      top: direction,
      behavior: behavior,
    });
  }

}

export class MusicPlayer {
  private audio: HTMLAudioElement;

  constructor(src: string, volume: number) {
    this.audio = new Audio(src);
    this.audio.volume = volume;
    this.audio.loop = false;
  }

  play(): void {
    this.audio.play();
  }

  pause(): void {
    this.audio.pause();
  }

  setVolume(volume: number): void {
    this.audio.volume = volume;
  }
}

import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements AfterViewInit, OnDestroy {
  terminalInput = '';
  inputFocused = false;
  cursorInterval: any;
  
  @ViewChild('terminalInput') terminalInputEl: ElementRef | undefined;
  
  ngAfterViewInit(): void {
    // Automatically focus the input when the component loads
    setTimeout(() => {
      const inputElement = document.querySelector('.terminal-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 500);
    
    // Update cursor position based on input width
    this.updateCursorPosition();
  }
  
  ngOnDestroy(): void {
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
    }
  }
  
  updateCursorPosition(): void {
    this.cursorInterval = setInterval(() => {
      const inputElement = document.querySelector('.terminal-input') as HTMLInputElement;
      if (inputElement) {
        // Create a temporary span to measure text width
        const temp = document.createElement('span');
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.style.whiteSpace = 'pre';
        temp.style.font = window.getComputedStyle(inputElement).font;
        temp.textContent = inputElement.value || '';
        document.body.appendChild(temp);
        
        // Set the custom property
        document.documentElement.style.setProperty('--input-width', `${temp.offsetWidth}px`);
        
        // Clean up
        document.body.removeChild(temp);
      }
    }, 100);
  }
}

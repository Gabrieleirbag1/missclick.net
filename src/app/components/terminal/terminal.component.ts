import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.css'
})
export class TerminalComponent implements AfterViewInit, OnDestroy {
  terminalInput = '';
  inputFocused = false;
  cursorInterval: any;

  @ViewChild('terminalInput') terminalInputEl: ElementRef | undefined;

  ngAfterViewInit(): void {
    // Automatically focus the input when the component loads
    setTimeout(() => {
      const inputTerminalElement = document.querySelector(
        '.terminal-input'
      ) as HTMLInputElement;
      if (inputTerminalElement) {
        inputTerminalElement.focus();
      }
    }, 500);

    // Update cursor position based on input width
    this.updateCursorPosition();
    this.handleInputTerminalEvent();
  }

  ngOnDestroy(): void {
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
    }
  }

  updateCursorPosition(): void {
    this.cursorInterval = setInterval(() => {
      const inputTerminalElement = document.querySelector(
        '.terminal-input'
      ) as HTMLInputElement;
      if (inputTerminalElement) {
        // Create a temporary span to measure text width
        const temp = document.createElement('span');
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.style.whiteSpace = 'pre';
        temp.style.font = window.getComputedStyle(inputTerminalElement).font;
        temp.textContent = inputTerminalElement.value || '';
        document.body.appendChild(temp);

        // Set the custom property
        document.documentElement.style.setProperty(
          '--input-width',
          `${temp.offsetWidth}px`
        );

        // Clean up
        document.body.removeChild(temp);
      }
    }, 100);
  }

  handleInputTerminalEvent(): void {
    const inputTerminalElement = document.querySelector(
      '.terminal-input'
    ) as HTMLInputElement;

    function checkTerminalCommand(): void {
      const inputValue: string = getInputText();
      const commands: Array<string> = ['test', 'test2'];
      if (!commands.includes(inputValue)) {
        console.log('Unknown command !');
      }
      else {
        console.log('Success');
      }
    }

    function getInputText(): string {
      const inputValue: string = inputTerminalElement.value.trim();
      return inputValue;
    }

    inputTerminalElement.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        checkTerminalCommand();
        inputTerminalElement.value = '';
      }
    });
  }
}

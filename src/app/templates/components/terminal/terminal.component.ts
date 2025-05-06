import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import terminalCommandsData from '../../../../assets/data/terminal-commands.json';

interface TerminalCommand {
  command: string;
  alias: string[];
  description: string;
  method: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
})
export class TerminalComponent implements OnInit, AfterViewInit, OnDestroy {
  terminalInput = '';
  inputFocused = false;
  cursorInterval: any;

  terminalCommands: TerminalCommand[] = terminalCommandsData;

  @ViewChild('terminalInput') terminalInputEl: ElementRef | undefined;

  constructor() {}

  ngOnInit(): void {}

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

    this.updateCursorPosition();
    this.handleInputTerminalEvent();
    this.setupTerminalContainerClick();

    this.initGradient();
  }

  setupTerminalContainerClick(): void {
    const terminalContainer = document.querySelector(
      '.terminal-container'
    ) as HTMLElement;
    const terminalInput = document.querySelector(
      '.terminal-input'
    ) as HTMLInputElement;

    if (terminalContainer && terminalInput) {
      terminalContainer.addEventListener('click', (event) => {
        // Don't focus if clicking on the input itself (it will handle its own focus)
        if (
          !(event.target as HTMLElement).classList.contains('terminal-input')
        ) {
          terminalInput.focus();
        }
      });
    }
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
    const methodMap: { [key: string]: Function } = {
      redirectToSection: (section: string) => redirectToSection(section),
      redirectToPage: (page: string) => redirectToPage(page),
    };

    function checkTerminalCommand(): void {
      const inputValue: string = getInputText();
      const terminalCommand: TerminalCommand | undefined =
        terminalCommandsData.find(
          (cmd) => cmd.command === inputValue || cmd.alias.includes(inputValue)
        );
      if (terminalCommand) {
        executeCommand(terminalCommand);
      }
    }

    function getInputText(): string {
      const inputValue: string = inputTerminalElement.value.trim().toLowerCase();
      return inputValue;
    }

    function executeCommand(terminalCommand: TerminalCommand): void {
      const methodName: string = terminalCommand.method || '';

      if (methodMap[methodName]) {
        methodMap[methodName](terminalCommand.command);
      } else {
        console.log(`Method ${methodName} not found`);
      }
    }

    function redirectToSection(inputValue: string): void {
      const section: string = inputValue.toLowerCase();
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function redirectToPage(inputValue: string): void {
      const page = inputValue.toLowerCase();
      if (page) {
        window.open(page, '_blank');
      } else {
        console.log(`Page ${inputValue} not found`);
      }
    }

    inputTerminalElement.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        checkTerminalCommand();
        inputTerminalElement.value = '';
      }
    });
  }

  initGradient(): void {
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'assets/scripts/terminal-gradiant.js';
      document.body.appendChild(script);
    }, 100);
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ContactModalComponent {
  @Input() isOpen = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal(event: MouseEvent): void {
    // Close only if clicking on overlay or close button
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay') || target.classList.contains('close-button')) {
      this.closeModalEvent.emit();
      event.stopPropagation();
    }
  }
}
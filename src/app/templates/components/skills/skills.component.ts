import { Component } from '@angular/core';

@Component({
    selector: 'app-skills',
    imports: [],
    templateUrl: './skills.component.html',
    styleUrl: './skills.component.css'
})


export class SkillsComponent {

  expandCard(event: Event) {
    const clickedCard = (event.currentTarget as HTMLElement);
    const allCards = document.querySelectorAll('.skill-card');
    
    const isExpanded = clickedCard.classList.contains('expanded');
    
    allCards.forEach(card => {
      card.classList.remove('expanded');
      card.classList.remove('reduced');
    });
    
    if (!isExpanded) {
      clickedCard.classList.add('expanded');
      
      allCards.forEach(card => {
        if (card !== clickedCard) {
          card.classList.add('reduced');
        }
      });
    }
  }
}
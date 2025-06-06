import { Component } from '@angular/core';
import { GithubStatsComponent } from '../../components/github-stats/github-stats.component';
import { HobbiesComponent } from "../../components/hobbies/hobbies.component";
import { SkillsComponent } from "../../components/skills/skills.component";
import { AboutComponent } from '../../components/about/about.component';
import { TerminalComponent } from '../../components/terminal/terminal.component';
import { ProjectsCtaComponent } from '../../components/projects-cta/projects-cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GithubStatsComponent, 
    HobbiesComponent, 
    SkillsComponent, 
    AboutComponent,
    TerminalComponent,
    ProjectsCtaComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
}

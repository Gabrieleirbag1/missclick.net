import { Component } from '@angular/core';
import { GithubStatsComponent } from '../../components/github-stats/github-stats.component';
import { ProjectsComponent } from "../../components/projects/projects.component";
import { HobbiesComponent } from "../../components/hobbies/hobbies.component";
import { SkillsComponent } from "../../components/skills/skills.component";
import { AboutComponent } from '../../components/about/about.component';
import { TerminalComponent } from '../../components/terminal/terminal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GithubStatsComponent, 
    ProjectsComponent, 
    HobbiesComponent, 
    SkillsComponent, 
    AboutComponent,
    TerminalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
}

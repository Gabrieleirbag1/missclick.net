import { Component, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './templates/layout/header/header.component';
import { FooterComponent } from './templates/layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './templates/components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading$ = this.loadingService.isLoading$;

  constructor(private loadingService: LoadingService) {}

}
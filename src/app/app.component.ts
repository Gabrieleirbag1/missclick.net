import { Component, OnInit, AfterViewInit, ElementRef, NgZone } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './templates/layout/header/header.component';
import { FooterComponent } from './templates/layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './templates/components/loader/loader.component';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  loading$ = this.loadingService.isLoading$;
  contentLoaded = false;
  navigationLoaded = false;

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (document.readyState === 'complete') {
      this.contentLoaded = true;
      this.checkAllLoaded();
    } else {
      window.addEventListener('load', () => {
        this.ngZone.run(() => {
          this.contentLoaded = true;
          this.checkAllLoaded();
        });
      });
    }

    // Handle navigation events
    this.router.events.pipe(
      filter(event => 
        event instanceof NavigationStart ||
        event instanceof NavigationEnd || 
        event instanceof NavigationCancel || 
        event instanceof NavigationError
      )
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.showLoader();
        this.navigationLoaded = false;
      } else {
        // Small delay to allow view to render
        setTimeout(() => {
          this.navigationLoaded = true;
          this.checkAllLoaded();
        }, 200); // Short delay for DOM to render
      }
    });
  }

  ngAfterViewInit(): void {
    // Use requestAnimationFrame to detect when everything is rendered
    requestAnimationFrame(() => {
      this.ngZone.run(() => {
        setTimeout(() => {
          this.navigationLoaded = true;
          this.checkAllLoaded();
        }, 200); // Small delay to ensure everything is rendered
      });
    });
  }

  private checkAllLoaded(): void {
    if (this.contentLoaded && this.navigationLoaded) {
      this.loadingService.hideLoader();
    }
  }
}
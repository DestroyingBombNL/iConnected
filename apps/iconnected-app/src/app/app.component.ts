import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterOutlet } from '@angular/router';
import { FrontendFeaturesModule } from '@ihomer/frontend/features';
import { UiModule } from '@ihomer/frontend/ui';
import { frontendEnvironment } from '@ihomer/shared/util-env';

@Component({
  standalone: true,
  imports: [RouterModule, RouterOutlet, RouterLink, FrontendFeaturesModule, UiModule],
  selector: 'ihomer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'iconnected-app';
  imagePath?: string;
  constructor() {
    this.imagePath = 'assets/logoiHomer.png';
    console.log(frontendEnvironment)
  }
}

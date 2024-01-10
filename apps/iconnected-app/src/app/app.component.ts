import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FrontendFeaturesModule } from '@ihomer/frontend/features';
import { UiModule } from '@ihomer/frontend/ui';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, UiModule, FrontendFeaturesModule],
  selector: 'ihomer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'iConnected';

  constructor() {
  }
}

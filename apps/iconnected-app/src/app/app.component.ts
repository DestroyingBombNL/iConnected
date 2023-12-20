import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterOutlet } from '@angular/router';
import { FrontendFeaturesModule } from '@ihomer/frontend/features';
// import { UiModule } from '@ihomer/frontend/features';
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [RouterModule, FrontendFeaturesModule, RouterLink, RouterOutlet, HttpClientModule],
  selector: 'ihomer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'iconnected-app';
}

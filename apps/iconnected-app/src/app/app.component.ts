import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterOutlet } from '@angular/router';
import { UiModule } from '@ihomer/frontend/ui';

@Component({
  standalone: true,
  imports: [RouterModule, RouterOutlet, RouterLink, UiModule],
  selector: 'ihomer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'iConnected';

  constructor() {
  }
}

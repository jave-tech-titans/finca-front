import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomComponent } from "./pages/shared/bottom/bottom.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'finca_front';
}

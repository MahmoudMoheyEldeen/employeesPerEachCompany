import { Component } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-read-more-button',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './read-more-button.component.html',
  styleUrl: './read-more-button.component.scss',
})
export class ReadMoreButtonComponent {}

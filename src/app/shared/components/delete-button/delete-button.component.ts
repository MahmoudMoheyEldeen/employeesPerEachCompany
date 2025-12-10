import { Component, Output, EventEmitter } from '@angular/core';
import { Button } from 'primeng/button';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [Button, TranslocoModule],
  templateUrl: './delete-button.component.html',
  styleUrl: './delete-button.component.scss',
})
export class DeleteButtonComponent {
  @Output() onClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    this.onClick.emit(event);
  }
}

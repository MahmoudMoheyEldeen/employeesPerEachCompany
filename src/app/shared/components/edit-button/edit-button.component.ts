import { Component, Output, EventEmitter } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-edit-button',
  standalone: true,
  imports: [Button],
  templateUrl: './edit-button.component.html',
  styleUrl: './edit-button.component.scss',
})
export class EditButtonComponent {
  @Output() onClick = new EventEmitter<Event>();

  handleClick(event: Event): void {
    this.onClick.emit(event);
  }
}

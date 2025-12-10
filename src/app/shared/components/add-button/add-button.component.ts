import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [Button],
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.scss',
})
export class AddButtonComponent {
  @Input() labelValue: string = 'Add';
  @Output() onClick = new EventEmitter<void>();

  handleClick(): void {
    this.onClick.emit();
  }
}

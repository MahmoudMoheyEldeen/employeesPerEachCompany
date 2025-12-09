import { Component } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-delete-button',
  standalone: true,
  imports: [Button],
  templateUrl: './delete-button.component.html',
  styleUrl: './delete-button.component.scss',
})
export class DeleteButtonComponent {}

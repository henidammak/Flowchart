import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';

@Component({
  selector: 'app-start-modal',
  templateUrl: './start-modal.component.html',
  styleUrls: ['./start-modal.component.css'],
})
export class StartModalComponent {
  constructor(private dialogRef: MatDialogRef<StartModalComponent>,private selectionService: DiagramSelectionService) {}

  onCancel() {
    this.dialogRef.close();
  }



  startDiagram() {
    this.selectionService.triggerStart(); // Déclenche l'événement pour informer le composant GoJS
    this.dialogRef.close();
  }
}

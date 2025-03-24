import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';
import { NewDeviceModalComponent } from '../new-device-modal/new-device-modal.component';
import { DeviceListModalComponent } from '../device-list-modal/device-list-modal.component';
import { StartModalComponent } from '../start-modal/start-modal.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  fileOpen: boolean = false;
  shareOpen: boolean = false;

  togglefile() {
    this.fileOpen = !this.fileOpen;
  }
  toggleShare(){
    this.shareOpen = !this.shareOpen;
  }
  constructor(private dialog: MatDialog,private selectionService: DiagramSelectionService) {}

openTaskModal() {
  const dialogRef = this.dialog.open(TaskModalComponent, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log("Tâche ajoutée :", result);
      this.selectionService.setTask(result); // Envoie les données au service
    }
  });
}

/////


openNewDeviceModal() {
  const dialogRef = this.dialog.open(NewDeviceModalComponent, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // console.log("Tâche ajoutée :", result);
      // this.selectionService.setTask(result); // Envoie les données au service
    }
  });
}

openDeviceListModal() {
  const dialogRef = this.dialog.open(DeviceListModalComponent, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // console.log("Tâche ajoutée :", result);
      // this.selectionService.setTask(result); // Envoie les données au service
    }
  });
}
openStartModal() {
  const dialogRef = this.dialog.open(StartModalComponent, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // console.log("Tâche ajoutée :", result);
      // this.selectionService.setTask(result); // Envoie les données au service
    }
  });
}


}

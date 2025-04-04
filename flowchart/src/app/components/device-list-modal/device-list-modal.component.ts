import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';

@Component({
  selector: 'app-device-list-modal',
  templateUrl: './device-list-modal.component.html',
  styleUrls: ['./device-list-modal.component.css'],
})
export class DeviceListModalComponent {
  devices: { name: string; icon: string | null }[] = [];

  constructor(
    private dialogRef: MatDialogRef<DeviceListModalComponent>,private selectionService: DiagramSelectionService) {}

  ngOnInit() {
    this.devices = this.selectionService.getDevices();
  }

  removeDevice(index: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this device?");
    if (confirmDelete) {
      this.selectionService.removeDevice(index);
      this.devices = this.selectionService.getDevices(); // Rafraîchir la liste
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

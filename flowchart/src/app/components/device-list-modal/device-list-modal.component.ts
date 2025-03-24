import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-device-list-modal',
  templateUrl: './device-list-modal.component.html',
  styleUrls: ['./device-list-modal.component.css'],
})
export class DeviceListModalComponent {
  constructor(private dialogRef: MatDialogRef<DeviceListModalComponent>) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close({});
  }
}

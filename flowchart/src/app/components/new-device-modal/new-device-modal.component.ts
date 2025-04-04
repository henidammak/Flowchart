import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';

@Component({
  selector: 'app-new-device-modal',
  templateUrl: './new-device-modal.component.html',
  styleUrls: ['./new-device-modal.component.css'],
})
export class NewDeviceModalComponent {
  DeviceName: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  filePath: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<NewDeviceModalComponent>,private selectionService: DiagramSelectionService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.filePath = this.selectedFile ? this.selectedFile.name : '';
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.DeviceName) {
      this.selectionService.addDevice({
        name: this.DeviceName,
        icon: this.imagePreview as string,
      });
    }
    this.dialogRef.close();
  }
}

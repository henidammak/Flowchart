import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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

  constructor(private dialogRef: MatDialogRef<NewDeviceModalComponent>) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.filePath = this.selectedFile ? this.selectedFile.name : ''; // Stocke le nom du fichier
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close({
      icon: this.filePath,
    });
  }
}

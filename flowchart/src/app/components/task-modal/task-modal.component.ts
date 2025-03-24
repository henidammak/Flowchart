import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css']
})
export class TaskModalComponent {

  pipeline: any = null;
  taskTitle: string = '';
  description: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  filePath: string | null = null;
  // hasNestedCompositeTask: boolean = false; // Vérification de la tâche composite

  constructor(private dialogRef: MatDialogRef<TaskModalComponent>, private selectionService: DiagramSelectionService) {}

  ngOnInit() {
    const pipelineJson = this.selectionService.getPipeline();
    if (pipelineJson) {
      this.pipeline = JSON.parse(pipelineJson); 
      console.log("Pipeline JSON :", pipelineJson);

      // Vérifier s'il y a une tâche CompositeTask à l'intérieur
      // this.hasNestedCompositeTask = this.containsNestedCompositeTask(this.pipeline);
    }
  }

  containsNestedCompositeTask(pipeline: any): boolean {
    if (!pipeline || !pipeline.nodeDataArray) return false;
    
    return pipeline.nodeDataArray.some((task: any) => task.category === "CompositeTask");
  }

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
    // if (!this.hasNestedCompositeTask) {
      this.dialogRef.close({
        title: this.taskTitle,
        description: this.description,
        pipeline: JSON.stringify(this.pipeline),
        icon: this.filePath,
      });
    // }
  }
}

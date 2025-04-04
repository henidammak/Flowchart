import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';
import { NewDeviceModalComponent } from '../new-device-modal/new-device-modal.component';
import { DeviceListModalComponent } from '../device-list-modal/device-list-modal.component';
import { StartModalComponent } from '../start-modal/start-modal.component';
import { EditCompTaskModalComponent } from '../edit-comp-task-modal/edit-comp-task-modal.component';



@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  fileOpen: boolean = false;
  shareOpen: boolean = false;
  pipeline: any = null;
  pipeline1: any = null;
  @Input() isEditing: boolean = false;
  @Output() editModeChange = new EventEmitter<boolean>();

  togglefile() {
    this.fileOpen = !this.fileOpen;
  }
  
  toggleShare(){
    this.shareOpen = !this.shareOpen;
  }
  
  constructor(private dialog: MatDialog, private selectionService: DiagramSelectionService) {}

  openTaskModal() {
    this.selectionService.triggerSave();
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
    this.selectionService.triggerSave();
    const dialogRef = this.dialog.open(StartModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  openEditCompTaskModal() {
    this.selectionService.triggerSave();
    const dialogRef = this.dialog.open(EditCompTaskModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exitEditMode();
      }
    });
  }

  exitEditMode() {
    this.selectionService.triggerSave();
    const composite_task_json = this.selectionService.getPipelineEditCompositeTask();
    const pipeline_edited_Json = this.selectionService.getPipelineForStartAndAddTask();

    if (composite_task_json && pipeline_edited_Json) {
      try {
        let compositeTask: any = JSON.parse(composite_task_json);
        let editedPipeline: any = JSON.parse(pipeline_edited_Json);

        if (compositeTask.nodeDataArray && compositeTask.nodeDataArray.length > 0) {
          // Find the CompositeTask node
          let compositeNode = compositeTask.nodeDataArray.find((node: any) => node.category === "CompositeTask");

          if (compositeNode) {
            // Replace the pipeline attribute
            compositeNode.pipeline = editedPipeline;

            // Update localStorage
            const savedTasks = JSON.parse(
              localStorage.getItem('compositeTasks') || '[]'
            );

            // Find and update the task in localStorage
            const updatedTasks = savedTasks.map((task: any) => {
              if (task.text === compositeNode.text && 
                  task.description === compositeNode.description) {
                return compositeNode;
              }
              return task;
            });

            // Save the updated tasks back to localStorage
            localStorage.setItem('compositeTasks', JSON.stringify(updatedTasks));

            console.log("Updated tasks in localStorage:", updatedTasks);
          }
        }
        console.log("Main JSON:", composite_task_json);
        console.log("Edited Pipeline JSON:", pipeline_edited_Json);
        console.log("JSON after modification:", JSON.stringify(compositeTask, null, 2));
      } catch (error) {
        console.error("Error updating JSON:", error);
      }
    }

    this.isEditing = false;
    this.editModeChange.emit(false);
    this.selectionService.setEditMode(false);
    // Rafraîchir la page après avoir quitté le mode édition
    window.location.reload();
  }
}
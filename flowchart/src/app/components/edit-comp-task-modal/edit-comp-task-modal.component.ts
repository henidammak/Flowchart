// import { Component } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
// import { DiagramSelectionService } from 'src/Services/diagram-selection.service';

// @Component({
//   selector: 'app-edit-comp-task-modal',
//   templateUrl: './edit-comp-task-modal.component.html',
//   styleUrls: ['./edit-comp-task-modal.component.css']
// })
// export class EditCompTaskModalComponent {
//   pipeline: any = null;

//   constructor(private dialogRef: MatDialogRef<EditCompTaskModalComponent>, private selectionService: DiagramSelectionService) {}

//   ngOnInit() {
//     const pipelineJson = this.selectionService.getPipelineForStartAndAddTask();
//     if (pipelineJson) {
//       this.pipeline = JSON.parse(pipelineJson);
//       console.log('Pipeline JSON :', pipelineJson);
//     }
//   }

//   hasStartAndEndNode(): boolean {
//     if (!this.pipeline || !this.pipeline.nodeDataArray) return false;

//     const hasStart = this.pipeline.nodeDataArray.some((node: any) => node.category === 'Start');
//     const hasEnd = this.pipeline.nodeDataArray.some((node: any) => node.category === 'End');

//     return hasStart && hasEnd;
//   }

//   hasUnconnectedNodes(): boolean {
//     if (!this.pipeline || !this.pipeline.nodeDataArray || !this.pipeline.linkDataArray) return true;

//     const nodeConnections = new Map<number, number>();
//     this.pipeline.nodeDataArray.forEach((node: any) => {
//       nodeConnections.set(node.key, 0);
//     });

//     this.pipeline.linkDataArray.forEach((link: any) => {
//       if (nodeConnections.has(link.from)) {
//         nodeConnections.set(link.from, nodeConnections.get(link.from)! + 1);
//       }
//       if (nodeConnections.has(link.to)) {
//         nodeConnections.set(link.to, nodeConnections.get(link.to)! + 1);
//       }
//     });

//     return this.pipeline.nodeDataArray.some((node: any) => {
//       const connections = nodeConnections.get(node.key) || 0;
//       if (node.category === 'Start' || node.category === 'End') {
//         return connections < 1;
//       }
//       return connections < 2;
//     });
//   }

//   onCancel() {
//     this.dialogRef.close();
//   }

//   saveDiagram() {
//     this.selectionService.triggerSave();
//     this.dialogRef.close();
//   }
// }

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';

@Component({
  selector: 'app-edit-comp-task-modal',
  templateUrl: './edit-comp-task-modal.component.html',
  styleUrls: ['./edit-comp-task-modal.component.css'],
})
export class EditCompTaskModalComponent {
  pipeline: any = null;
  
  constructor(private dialogRef: MatDialogRef<EditCompTaskModalComponent>, private selectionService: DiagramSelectionService) {}

  ngOnInit() {
    const pipelineJson = this.selectionService.getPipelineForStartAndAddTask();
    if (pipelineJson) {
      this.pipeline = JSON.parse(pipelineJson);
      console.log('Pipeline JSON :', pipelineJson);
    }
  }

  ////////pour verifier si le pipeline contient une node start et end////////
  hasStartAndEndNode(): boolean {
    if (!this.pipeline || !this.pipeline.nodeDataArray) return false;

    const hasStart = this.pipeline.nodeDataArray.some(
      (node: any) => node.category === 'Start'
    );
    const hasEnd = this.pipeline.nodeDataArray.some(
      (node: any) => node.category === 'End'
    );

    return hasStart && hasEnd;
  }
  ///fin////
  
  ////////pour verifier si les node sont totalement reliée////////
  hasUnconnectedNodes(): boolean {
    if (
      !this.pipeline ||
      !this.pipeline.nodeDataArray ||
      !this.pipeline.linkDataArray
    )
      return true;

    const nodeConnections = new Map<number, number>();

    // Initialiser la map avec 0 connexions pour chaque nœud
    this.pipeline.nodeDataArray.forEach((node: any) => {
      nodeConnections.set(node.key, 0);
    });

    // Comptabiliser les connexions
    this.pipeline.linkDataArray.forEach((link: any) => {
      if (nodeConnections.has(link.from)) {
        nodeConnections.set(link.from, nodeConnections.get(link.from)! + 1);
      }
      if (nodeConnections.has(link.to)) {
        nodeConnections.set(link.to, nodeConnections.get(link.to)! + 1);
      }
    });

    // Vérifier les connexions des nœuds
    return this.pipeline.nodeDataArray.some((node: any) => {
      const connections = nodeConnections.get(node.key) || 0;

      // Start et End peuvent être connectés d'un seul côté
      if (node.category === 'Start' || node.category === 'End') {
        return connections < 1;
      }

      // Les autres nœuds doivent être connectés des deux côtés
      return connections < 2;
    });
  }
  ///fin////

  onCancel() {
    this.dialogRef.close(false);
  }

  saveChanges() {
    this.dialogRef.close(true);
  }
}
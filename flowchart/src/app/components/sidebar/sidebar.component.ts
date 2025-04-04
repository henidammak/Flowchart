import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() diagram!: go.Diagram;  // Récupère le diagramme depuis le parent
  @Input() selectedNode: any; 
  @Output() editMode = new EventEmitter<boolean>();


  // selectedNode: any = null;  
  //selectedNode est une propriété de la classe qui stockera les données du nœud sélectionné.
  //Son type est any, ce qui signifie qu'elle peut contenir tout type de données (objet, chaîne de caractères, etc.).
  //Elle est initialisée à null pour indiquer qu'aucun nœud n'est sélectionné au début.

constructor(private selectionService: DiagramSelectionService, private dialog: MatDialog) {}

ngOnInit() {
  this.selectionService.selectedNode$.subscribe((nodeData) => {

    //selectedNode$ est un BehaviorSubject dans DiagramSelectionService, qui stocke le nœud sélectionné.
    //.subscribe((nodeData) => { ... }) permet d'écouter les changements de selectedNode$.
    //À chaque mise à jour (lorsqu'un nœud est cliqué), la fonction dans subscribe est exécutée.
    this.selectedNode = nodeData;


  });
}
updateNodeProperty(property: string, value: any) {
  if (this.selectedNode && this.diagram) {
    this.diagram.model.startTransaction('update property');
    this.diagram.model.setDataProperty(this.selectedNode, property, value);
    this.diagram.model.commitTransaction('update property');
  }
}


saveChanges() {
  this.selectionService.triggerSave();
}

// editChanges() {
  
//   this.selectionService.triggerEdit();
//   this.editMode.emit(true);
// }
editChanges() {
  // Check if already in edit mode
  if (this.isAlreadyInEditMode()) {
    // Open modal with warning instead of editing the nested composite task
    this.openWarningModal();
  } else {
    // Normal flow - trigger edit
    this.selectionService.triggerEdit();
    this.editMode.emit(true);
  }
}

// Add this method to check if already in edit mode
isAlreadyInEditMode(): boolean {
  // You need to get this from somewhere, maybe from a service or parent component
  return this.selectionService.isInEditMode();
}

// Add this method to open the warning modal
openWarningModal() {
  const dialogRef = this.dialog.open(TaskModalComponent, {
    width: '400px',
    data: { warningOnly: true }
  });
}


deleteTask() {
  const confirmDelete = window.confirm("Are you sure you want to delete this composite task?");
  if (confirmDelete && this.selectedNode) {
    this.selectionService.sendTaskToDelete(this.selectedNode.text);
    this.editMode.emit(false);
    window.location.reload();
  }
}





}

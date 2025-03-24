import { Component, Input } from '@angular/core';
import { DiagramSelectionService } from 'src/Services/diagram-selection.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() diagram!: go.Diagram;  // Récupère le diagramme depuis le parent
  @Input() selectedNode: any; 

  // selectedNode: any = null;  
  //selectedNode est une propriété de la classe qui stockera les données du nœud sélectionné.
  //Son type est any, ce qui signifie qu'elle peut contenir tout type de données (objet, chaîne de caractères, etc.).
  //Elle est initialisée à null pour indiquer qu'aucun nœud n'est sélectionné au début.

constructor(private selectionService: DiagramSelectionService) {}

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

// saveChanges() {
//   console.log('Nouvelle valeur enregistrée :', this.selectedNode.Time_sleep);
//   console.log('Command:', this.selectedNode.cmd);
//   console.log('Run as root:', this.selectedNode.root);
// }
saveChanges() {
  this.selectionService.triggerSave();
}

deleteTask() {
  if (this.selectedNode) {
    this.selectionService.sendTaskToDelete(this.selectedNode.text);
  }
}




}

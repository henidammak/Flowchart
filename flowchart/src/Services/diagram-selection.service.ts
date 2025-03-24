import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ //Cela signifie qu’il n’est pas nécessaire de l’ajouter manuellement dans providers dans app.module.ts.
  providedIn: 'root',
})

export class DiagramSelectionService {
  ///**pour recuperer les config des composant lors du click dans le sidebar */
  private selectedNodeSource = new BehaviorSubject<any>(null); //rxjs : BehaviorSubject fait partie de RxJS (Reactive Extensions for JavaScript), utilisé pour gérer des flux de données et des événements asynchrones.
  selectedNode$ = this.selectedNodeSource.asObservable();
  setSelectedNode(nodeData: any) {
    this.selectedNodeSource.next(nodeData);
  }
  //**fin */



///**pour utiliser la methode save de gojs-diagram.ts dans d'autre composant (sidebar) */
  private saveAction = new Subject<void>();
  saveAction$ = this.saveAction.asObservable();

  triggerSave() {
    this.saveAction.next();
  }
//**fin */


///**pour utiliser la methode start de gojs-diagram.ts dans d'autre composant (toolbar) */
private startDiagramSubject = new Subject<void>();
startDiagram$ = this.startDiagramSubject.asObservable();

triggerStart() {
  this.startDiagramSubject.next();
}
//**fin */

///**pour utiliser la methode save de gojs-diagram.ts et passer le json vers taskmodal.ts lorsque je clique sur add  */
private pipeline: string = '';

setPipeline(jsonData: string) {
  this.pipeline = jsonData;
}

getPipeline(): string {
  return this.pipeline;
}

//**fin */

///**pour envoyer les attribut apres que j'ai remplis la modal  */
private taskData = new BehaviorSubject<any>(null);
currentTask = this.taskData.asObservable();

setTask(task: any) {
  this.taskData.next(task);
}

//**fin */

///**pour supprimer un composite task dés la palette  */
private deleteTaskSubject = new Subject<string>();
deleteTask$ = this.deleteTaskSubject.asObservable();

sendTaskToDelete(taskTitle: string) {
  this.deleteTaskSubject.next(taskTitle);
}

}

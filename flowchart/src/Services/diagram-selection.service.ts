import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  //Cela signifie qu’il n’est pas nécessaire de l’ajouter manuellement dans providers dans app.module.ts.
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
  ///**pour utiliser la methode edit de gojs-diagram.ts dans d'autre composant (sidebar) */
  private editAction = new Subject<void>();
  editAction$ = this.editAction.asObservable();

  // triggerEdit() {
  //   this.editAction.next();
  // }
  private editModeSubject = new BehaviorSubject<boolean>(false);
editMode$ = this.editModeSubject.asObservable();

isInEditMode(): boolean {
  return this.editModeSubject.getValue();
}

setEditMode(value: boolean) {
  this.editModeSubject.next(value);
}

triggerEdit() {
  this.editAction.next();
  this.setEditMode(true);
}
  //**fin */

  ///**pour utiliser la methode start de gojs-diagram.ts dans d'autre composant (toolbar) */
  private startDiagramSubject = new Subject<void>();
  startDiagram$ = this.startDiagramSubject.asObservable();

  triggerStart() {
    this.startDiagramSubject.next();
  }
  //**fin */

  ///**pour utiliser la methode save de gojs-diagram.ts et passer le json vers taskmodal.ts lorsque je clique sur task+ et vers startModal lorsque je clique sur start  */
  private pipeline_for_Add_task: string = '';

  setPipelineForStartAndAddTask(jsonData: string) {
    this.pipeline_for_Add_task = jsonData;
  }

  getPipelineForStartAndAddTask(): string {
    return this.pipeline_for_Add_task;
  }

  //**fin */
  ///**pour utiliser la methode edit de gojs-diagram.ts et passer le json vers toolbar lorsque je clique sur bouton tick  */
  private pipeline_for_edit: string = '';

  setPipelineForEditCompositeTask(jsonData: string) {
    this.pipeline_for_edit = jsonData;
  }

  getPipelineEditCompositeTask(): string {
    return this.pipeline_for_edit;
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
  //**fin */

  ///**gerer l'ajout et la suppressioon et l enregistrement dans localstorage des devices */
  constructor() {
    this.loadDevices(); // Charger les appareils au démarrage
  }
  private devices: { name: string; icon: string | null }[] = [];

  private saveDevices() {
    localStorage.setItem('devices', JSON.stringify(this.devices)); // Enregistrer dans localStorage
  }

  private loadDevices() {
    const storedDevices = localStorage.getItem('devices');
    if (storedDevices) {
      this.devices = JSON.parse(storedDevices);
    }
  }
  getDevices() {
    return this.devices;
  }

  addDevice(device: { name: string; icon: string | null }) {
    this.devices.push(device);
    this.saveDevices(); // Mettre à jour localStorage
  }

  removeDevice(index: number) {
    this.devices.splice(index, 1);
    this.saveDevices(); // Mettre à jour localStorage
  }
  //**fin */


}

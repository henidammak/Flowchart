import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isEditing: boolean = false;

setEditingMode(editing: boolean) {
  this.isEditing = editing;
}


}

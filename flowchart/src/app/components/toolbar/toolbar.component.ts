import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  fileOpen: boolean = false;
  shareOpen: boolean = false;

  togglefile() {
    this.fileOpen = !this.fileOpen;
  }
  toggleShare(){
    this.shareOpen = !this.shareOpen;
  }


}

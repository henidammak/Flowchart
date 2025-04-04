
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GojsDiagramComponent } from './components/gojs-diagram/gojs-diagram.component';
import { HeaderComponent } from './components/header/header.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DeviceListModalComponent } from './components/device-list-modal/device-list-modal.component';
import { NewDeviceModalComponent } from './components/new-device-modal/new-device-modal.component';
import { StartModalComponent } from './components/start-modal/start-modal.component';
import {  EditCompTaskModalComponent } from './components/edit-comp-task-modal/edit-comp-task-modal.component';




@NgModule({
  declarations: [
    AppComponent,
    GojsDiagramComponent,
    HeaderComponent,
    ToolbarComponent,
    SidebarComponent,
    TaskModalComponent,
    LoginComponent,
    HomeComponent,
    DeviceListModalComponent,
    NewDeviceModalComponent,
    StartModalComponent,
    EditCompTaskModalComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,   
    MatButtonModule  ,
    MatFormFieldModule,  
    MatInputModule  ,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

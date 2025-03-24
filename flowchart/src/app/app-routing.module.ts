
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GojsDiagramComponent } from './components/gojs-diagram/gojs-diagram.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  { path: '', component: LoginComponent }, // Afficher LoginComponent au démarrage
  { path: 'home', component: HomeComponent } // Afficher le dashboard après login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

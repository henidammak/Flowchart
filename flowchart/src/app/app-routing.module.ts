
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GojsDiagramComponent } from './components/gojs-diagram/gojs-diagram.component';

const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    component:GojsDiagramComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

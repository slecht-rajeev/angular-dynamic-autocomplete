import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IncidentComponent } from './incident/incident.component';

const routes: Routes = [
  // {
  //   path: "",
  //   component: AppComponent
  // },
  {
    path: "incident",
    loadChildren: () => import('./incident/incident.module').then(m => m.IncidentModule)
  },
  {
    path: "**",
    redirectTo: 'incident'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

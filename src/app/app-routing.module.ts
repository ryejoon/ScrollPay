import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExploreComponent} from './explore/explore.component';
import {ViewerComponent} from './viewer/viewer.component';
import {UploadComponent} from './upload/upload.component';


const routes: Routes = [
  {
    path: 'explore', component: ExploreComponent,
    children: [{
      path: ':txid',
      component: ViewerComponent
    }]
  },
  {
    path: 'upload', component: UploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

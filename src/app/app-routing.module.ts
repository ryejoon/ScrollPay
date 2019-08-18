import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExploreComponent} from './explore/explore.component';
import {ViewerComponent} from './viewer/viewer.component';
import {TextUploadComponent} from './upload/text-upload.component';
import {LoginComponent} from './login/login.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'explore', component: ExploreComponent,
    children: [{
      path: ':txid',
      component: ViewerComponent
    }]
  },
  {
    path: 'upload', component: TextUploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

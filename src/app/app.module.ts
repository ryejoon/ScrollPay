import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExploreComponent } from './explore/explore.component';
import { TextUploadComponent } from './upload/text-upload.component';
import { ViewerComponent } from './viewer/viewer.component';
import {
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatToolbarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { StickyMenuComponent } from './sticky-menu/sticky-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ExploreComponent,
    TextUploadComponent,
    ViewerComponent,
    LoginComponent,
    StickyMenuComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatInputModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

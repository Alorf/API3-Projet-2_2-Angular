import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { HomeComponent } from './components/home/home.component';
import { ClientsComponent } from './components/clients/clients.component';
import { LocationsComponent } from './components/locations/locations.component';
import { HttpClientModule } from '@angular/common/http';
import { NewclientComponent } from './components/newclient/newclient.component';
import { AlertComponent } from './components/tools/alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    HomeComponent,
    ClientsComponent,
    LocationsComponent,
    NewclientComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

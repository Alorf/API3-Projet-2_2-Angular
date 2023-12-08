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
import { EditclientComponent } from './components/editclient/editclient.component';
import { EditlocationComponent } from './components/editlocation/editlocation.component';
import { NewlocationComponent } from './components/newlocation/newlocation.component';
import { TaxisComponent } from './components/taxis/taxis.component';
import { NewtaxisComponent } from './components/newtaxis/newtaxis.component';
import { EdittaxisComponent } from './components/edittaxis/edittaxis.component';
import { AdressesComponent } from './components/adresses/adresses.component';
import { EditadressesComponent } from './components/editadresses/editadresses.component';
import { NewadressesComponent } from './components/newadresses/newadresses.component';
import { FacturesComponent } from './components/factures/factures.component';
import { EditfacturesComponent } from './components/editfactures/editfactures.component';
import { NewfacturesComponent } from './components/newfactures/newfactures.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    HomeComponent,
    ClientsComponent,
    LocationsComponent,
    NewclientComponent,
    AlertComponent,
    EditclientComponent,
    EditlocationComponent,
    NewlocationComponent,
    TaxisComponent,
    NewtaxisComponent,
    EdittaxisComponent,
    AdressesComponent,
    EditadressesComponent,
    NewadressesComponent,
    FacturesComponent,
    EditfacturesComponent,
    NewfacturesComponent
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

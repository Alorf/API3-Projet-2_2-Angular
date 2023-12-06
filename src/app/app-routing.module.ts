import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { LocationsComponent } from './components/locations/locations.component';
import { HomeComponent } from './components/home/home.component';
import { NewclientComponent } from './components/newclient/newclient.component';
import { EditclientComponent } from './components/editclient/editclient.component';
import { TaxisComponent } from './components/taxis/taxis.component';
import { AdressesComponent } from './components/adresses/adresses.component';
import { NewadressesComponent } from './components/newadresses/newadresses.component';
import { NewtaxisComponent } from './components/newtaxis/newtaxis.component';
import { EditadressesComponent } from './components/editadresses/editadresses.component';
import { EdittaxisComponent } from './components/edittaxis/edittaxis.component';

const routes: Routes = [
  { path: 'clients', component: ClientsComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'adresses', component: AdressesComponent },
  { path: 'taxis', component: TaxisComponent },
  { path: '', component: HomeComponent },
  { path: 'newClient', component: NewclientComponent },
  { path: 'newAdresse', component: NewadressesComponent },
  { path: 'newTaxi', component: NewtaxisComponent },
  { path: 'editAdresse/:idadresse', component: EditadressesComponent },
  { path: 'editTaxi/:idtaxi', component: EdittaxisComponent },
  { path: 'editClient/:idclient', component: EditclientComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

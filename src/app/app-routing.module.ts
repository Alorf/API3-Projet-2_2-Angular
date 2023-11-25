import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './components/clients/clients.component';
import { LocationsComponent } from './components/locations/locations.component';
import { HomeComponent } from './components/home/home.component';
import { NewclientComponent } from './components/newclient/newclient.component';
import { EditclientComponent } from './components/editclient/editclient.component';

const routes: Routes = [
  { path: 'clients', component: ClientsComponent },
  { path: 'locations', component: LocationsComponent },
  { path: '', component: HomeComponent },
  { path: 'newClient', component: NewclientComponent },
  { path: 'editClient/:idclient', component: EditclientComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

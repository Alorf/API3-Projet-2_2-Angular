import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { LocationsService } from '../../services/locations.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { formatDate } from '@angular/common';
import { Location } from '../../entities/location.entities';
import { Adresse } from '../../entities/adresse.entities';
import { Client } from '../../entities/clients.entities';
import { ClientsService } from '../../services/clients.service';
import { AdressesService } from '../../services/adresses.service';

@Component({
  selector: 'app-editlocation',
  templateUrl: './editlocation.component.html',
  styleUrl: './editlocation.component.css',
})
export class EditlocationComponent implements OnInit, OnChanges {
  @ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  @Input({ required: true }) location: Location | undefined;
  @Output() editLocation = new EventEmitter<Location>();

  locationFormGroup?: FormGroup;
  submitted = false;
  adresses: Adresse[] = [];
  clients: Client[] = [];
  idLocation: number;

  constructor(
    private locationService: LocationsService,
    private clientsService: ClientsService,
    private adressesService: AdressesService,
    private fb: FormBuilder,
    activatedRoute: ActivatedRoute,
  ) {
    this.idLocation = activatedRoute.snapshot.params.idlocation;
  }

  ngOnInit(): void {
    this.clientsService.getAllClients().subscribe((clients: Client[]) => {
      this.clients = clients;
    });

    this.adressesService.getAllAdresses().subscribe((adresses: Adresse[]) => {
      this.adresses = adresses;
    });

    if (this.location === undefined) {
      this.locationService.getLocation(this.idLocation).subscribe(location => {
        this.loadForm(location);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //Quand l'input change de valeur, on met a jour le formulaire. Cela ne détruit pas le composant, mais le met a jour.
    if (changes.location && changes.location.currentValue && this.location !== undefined) {
      this.location = changes.location.currentValue;
      this.loadForm(changes.location.currentValue);
    }
  }

  loadForm(location: Location) {
    this.locationFormGroup = this.fb.group({
      id: [location.id],
      idclient: [location.client.id, [Validators.required]],
      idadresse: [location.adrDepart.id, [Validators.required]],
      dateloc: [formatDate(location.dateloc, 'yyyy-MM-dd', 'en')],
      kmTotal: [location.kmTotal, [Validators.required, Validators.min(1)]],
    });
  }

  onUpdateLocation(): void {
    console.log('update location');

    this.submitted = true;
    if (this.locationFormGroup?.invalid) {
      return;
    }

    let body: any = {
      id: this.locationFormGroup?.value.id,
      dateloc: this.locationFormGroup?.value.dateloc,
      kmTotal: this.locationFormGroup?.value.kmTotal,
      client: {
        id: this.locationFormGroup?.value.idclient,
      },
      adrDepart: {
        id: this.locationFormGroup?.value.idadresse,
      },
    };

    this.locationService.updateLocation(body).subscribe(
      data => {
        this.alertComponent?.show(AlertType.ok, 'sauvegarde ok');
        this.editLocation.emit(data);
      },
      err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    );
  }
}

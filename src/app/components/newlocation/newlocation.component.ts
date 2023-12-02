import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocationsService } from '../../services/locations.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../tools/alert/alert.component';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { Client } from '../../entities/clients.entities';
import { Taxi } from '../../entities/taxi.entities';
import { ClientsService } from '../../services/clients.service';
import { TaxisService } from '../../services/taxis.service';
import { Adresse } from '../../entities/adresse.entities';
import { Location } from '../../entities/location.entities';
import { AdressesService } from '../../services/adresses.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-newlocation',
  templateUrl: './newlocation.component.html',
  styleUrl: './newlocation.component.css',
})
export class NewlocationComponent implements OnInit {
  locationFormGroup?: FormGroup;
  clients?: Client[];
  adresses?: Adresse[];
  taxis?: Taxi[];

  tempClient?: Client;
  @Input() client?: Client;
  @Output() newLocation = new EventEmitter<Location>();
  @ViewChild('alertComponent') alertComponent: AlertComponent | undefined;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationsService,
    private taxisService: TaxisService,
    private clientsService: ClientsService,
    private adressesService: AdressesService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    if (this.client === undefined) {
      this.clientsService.getAllClients().subscribe((clients: Client[]) => {
        this.clients = clients;
      });
    }

    this.taxisService.getAllTaxis().subscribe((taxis: Taxi[]) => {
      this.taxis = taxis;
    });

    this.adressesService.getAllAdresses().subscribe((adresses: Adresse[]) => {
      this.adresses = adresses;
    });

    this.locationFormGroup = this.fb.group({
      idclient: new FormControl(
        {
          value: this.client?.id === undefined ? '1' : this.client.id,
          disabled: this.client?.id != undefined, // Set disabled to true if needed
        },
        [Validators.required],
      ),
      idadresse: ['1', [Validators.required]],
      dateloc: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      kmTotal: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSaveLocation() {
    this.submitted = true;
    if (this.locationFormGroup?.invalid) {
      return;
    }

    var body: any = {
      dateloc: this.locationFormGroup?.value.dateloc,
      kmTotal: this.locationFormGroup?.value.kmTotal,
      client: {
        id: this.client === undefined ? this.locationFormGroup?.value.idclient : this.client.id,
      },
      adrDepart: {
        id: this.locationFormGroup?.value.idadresse,
      },
    };

    this.locationService.save(body).subscribe(
      data => {
        this.alertComponent?.show(AlertType.ok, 'sauvegarde ok');
        setTimeout(() => {
          this.alertComponent?.hide();
        }, 5000);
        this.newLocation.emit(data);
      },
      err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    );
  }
}

import { Component, ElementRef, Input, Output, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { DrawerMode } from '../tools/Enum/drawer-mode';
import { AlertComponent } from '../tools/alert/alert.component';
import { LocationsService } from '../../services/locations.service';
import { Router } from '@angular/router';
import { AlertType } from '../tools/alert/enums/alert-type.enum';
import { Client } from '../../entities/clients.entities';
import { Location } from '../../entities/location.entities';
import { CollapseMode } from '../tools/Enum/collapse-mode';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css',
})
export class LocationsComponent implements OnInit, OnChanges {
  DrawerMode = DrawerMode;
  CollapseMode = CollapseMode;

  @Input({ required: true }) client: Client | undefined;
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('addModal') addModal!: ElementRef;
  @ViewChild('collapseCheckbox') collapseCheckbox!: ElementRef;

  @ViewChild('alertComponent', { static: false }) alertComponent: AlertComponent | undefined;

  drawerMode: DrawerMode = DrawerMode.add;
  collapseMode: CollapseMode = CollapseMode.add;

  isAdding: boolean = false;

  locations?: Location[];
  locationSelected?: Location;

  constructor(private locationsService: LocationsService, private router: Router) {}

  page: number = 0;
  isButtonPreviousDisabled = false; // change this value to true to disable the button
  isButtonNextDisabled = false; // change this value to true to disable the button

  ngOnInit(): void {
    console.log('client = ', this.client);

    if (this.client === undefined) {
      this.locationsService.getPaginatorLocations(0, 5, 'id').subscribe((data: any) => {
        this.locations = data.content;
        this.page = data.number;

        if (data.last) this.isButtonNextDisabled = true;
        if (data.first) this.isButtonPreviousDisabled = true;
      });
    } else {
      console.log('clienttt = ', this.client);

      this.locationsService.searchLocations(this.client).subscribe((data: any) => {
        this.locations = data;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.client && changes.client.currentValue && this.client !== undefined) {
      this.locationsService.searchLocations(this.client).subscribe((data: any) => {
        this.locations = data;
      });

      if (this.collapseCheckbox){
        this.collapseCheckbox.nativeElement.checked = false;
        this.isAdding = false;
        this.collapseMode = CollapseMode.add;
      }
      
    }
  }

  pageNext() {
    this.locationsService.getPaginatorLocations(++this.page, 5, 'id').subscribe((data: any) => {
      this.locations = data.content;
      this.isButtonPreviousDisabled = false;

      if (data.last) {
        this.isButtonNextDisabled = true;
        this.isButtonPreviousDisabled = false;
      }
    });
  }

  reloadCurrentPage(page: number) {
    this.locationsService.getPaginatorLocations(page, 5, 'id').subscribe((data: any) => {
      this.locations = data.content;
      this.page = data.number;

      if (data.last) this.isButtonNextDisabled = true;
      if (data.first) this.isButtonPreviousDisabled = true;
    });
  }

  pagePrevious() {
    this.locationsService.getPaginatorLocations(--this.page, 5, 'id').subscribe((data: any) => {
      this.locations = data.content;
      this.isButtonNextDisabled = false;

      if (data.first) {
        this.isButtonNextDisabled = false;
        this.isButtonPreviousDisabled = true;
      }
    });
  }

  onNewLocation() {
    //this.router.navigateByUrl('/newClient');
    this.drawerMode = DrawerMode.add;
    // Open the drawer
    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  onNewLocationModal() {
    if (this.addModal) {
      this.addModal.nativeElement.showModal();
    }
  }

  showModal() {
    if (this.deleteModal) {
      this.deleteModal.nativeElement.showModal();
    }
  }

  hideTable() {
    if (this.collapseMode != CollapseMode.add && this.isAdding) {
      this.collapseMode = CollapseMode.add;
    }

    this.isAdding = !this.isAdding;
  }

  openDeleteModal(location: Location) {
    //let v = confirm('Etes vous sur de vouloir supprimer ce client ?');
    this.locationSelected = location;
    this.showModal();
  }

  onSearch() {}

  onDelete() {
    if (this.locationSelected === undefined) return;

    this.locationsService.deleteLocation(this.locationSelected).subscribe({
      next: data => {
        if (this.locationSelected === undefined) return;
        const index = this.locations?.indexOf(this.locationSelected, 0);

        //alert('index = ' + index);
        this.alertComponent?.show(AlertType.ok, 'Location ' + this.locationSelected.id + ' supprimée');
        if (!(index === undefined) && index > -1) {
          this.locations?.splice(index, 1);
        }
      },
      error: err => {
        this.alertComponent?.show(AlertType.error, err.headers.get('error'));
      },
    });
    setTimeout(() => {
      this.alertComponent?.hide();
    }, 5000);
  }

  editLocationCollapsed(location: Location) {
    this.collapseMode = CollapseMode.edit;
    this.locationSelected = location;
    this.collapseCheckbox.nativeElement.checked = true;
    this.hideTable();
  }

  editLocation(location: Location) {
    this.drawerMode = DrawerMode.edit;
    this.locationSelected = location;

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }

  onAddLocation(location: Location) {
    this.locations?.push(location);
  }

  onEditLocation(location: Location) {
    if (location.client.id != this.locationSelected?.client.id) {
      const index = this.locations?.indexOf(this.locationSelected!, 0);
      console.log('index = ', index);

      if (!(index === undefined) && index > -1) {
        this.locations?.splice(index, 1);
      }
    }
  }

  onEdit(location: Location) {
    //this.router.navigateByUrl('/editClient/' + location.id);
  }

  openFilterDrawer(location: Location) {
    this.drawerMode = DrawerMode.filter;
    this.locationSelected = location;

    const drawerElement = document.getElementById('my-drawer') as HTMLInputElement;
    if (drawerElement) {
      drawerElement.checked = true;
    }
  }
}

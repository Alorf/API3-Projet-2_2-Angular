import { Component, OnInit } from '@angular/core';
import { Client } from '../../entities/clients.entities';
import { ClientsService } from '../../services/clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  clients?: Client[];

  constructor(private clientsService: ClientsService, private router: Router) {}

  ngOnInit(): void {}

  onSearch(value: any) {
    this.clientsService.searchClients(value.nom).subscribe((data: any) => {
      this.clients = data;
    });
  }

  onNewClient() {
    this.router.navigateByUrl('/newClient');
  }

  onDelete(c: Client) {
    let v = confirm('Etes vous sur de vouloir supprimer ce client ?');
    if (v) {
      this.clientsService.deleteClient(c).subscribe({
        next: (data) => {
          this.onSearch(c);
          const index = this.clients?.indexOf(c, 0);

          alert('index = ' + index);
          if (!(index === undefined) && index > -1) {
            this.clients?.splice(index, 1);
          }
        },
        error: (err) => {
          alert(err.headers.get('error'));
        },
      });
    }
  }

  onEdit(c: Client) { }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Client } from '../entities/clients.entities';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private host = environment.host;

  constructor(private http: HttpClient) {}

  getClient(idclient: number): Observable<Client> {
    return this.http.get<Client>(this.host + '/clients/' + idclient);
  }

  searchClientUnique(
    nom: string,
    prenom: string,
    tel: string
  ): Observable<Client[]> {
    return this.http.get<Client[]>(
      this.host + '/clients/' + nom + '/' + prenom + '/' + tel
    );
  }

  searchClients(nom: string): Observable<Client[]> {
    return this.http.get<Client[]>(this.host + '/clients/nom=' + nom);
  }

  deleteClient(c: Client): Observable<void> {
    return this.http.delete<void>(this.host + '/clients/' + c.id);
  }
  save(c: Client): Observable<Client> {
    return this.http.post<Client>(this.host + '/clients/', c);
  }

  updateClient(c: Client): Observable<Client> {
    return this.http.put<Client>(this.host + '/clients/' + c.id, c);
  }
}

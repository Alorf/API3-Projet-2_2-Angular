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

  searchClientUnique(nom: string, prenom: string, tel: string): Observable<Client[]> {
    return this.http.get<Client[]>(this.host + '/clients/' + nom + '/' + prenom + '/' + tel);
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.host + '/clients/all');
  }

  /* Q1 EXAMEN */
  getKmTotalClient(id: number): Observable<number> {
    return this.http.get<number>(this.host + '/clients/kmtotal/' + id);
  }

  searchClients(nom: string): Observable<Client[]> {
    return this.http.get<Client[]>(this.host + '/clients/nom=' + nom);
  }

  getPaginatorClients(page: number, size: number, sort: string) {
    return this.http.get<Client[]>(this.host + '/clients/allp?page=' + page + '&size=' + size + '&sort=' + sort);
  }

  deleteClient(c: Client): Observable<void> {
    return this.http.delete<void>(this.host + '/clients/' + c.id);
  }
  save(c: Client): Observable<Client> {
    return this.http.post<Client>(this.host + '/clients', c, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  updateClient(c: Client): Observable<Client> {
    return this.http.put<Client>(this.host + '/clients/' + c.id, c);
  }

  getTaxisSansDoublon(c: Client): Observable<Client[]> {
    return this.http.get<Client[]>(this.host + '/clients/taxiSansDoublon/idclient=' + c.id);
  }

  getAdresseLocationSansDoublon(c: Client): Observable<Client[]> {
    return this.http.get<Client[]>(this.host + '/clients/adressesSansDoublon/idclient=' + c.id);
  }
}

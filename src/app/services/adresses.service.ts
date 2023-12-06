import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Adresse } from '../entities/adresse.entities';

@Injectable({ providedIn: 'root' })
export class AdressesService {
  private host = environment.host;

  constructor(private http: HttpClient) {}

  getAdresse(idadresse: number): Observable<Adresse> {
    return this.http.get<Adresse>(this.host + '/adresses/' + idadresse);
  }

  getAllAdresses(): Observable<Adresse[]> {
    return this.http.get<Adresse[]>(this.host + '/adresses/all');
  }

  searchAdresses(localite: string): Observable<Adresse[]> {
    return this.http.get<Adresse[]>(this.host + '/adresses/localite=' + localite);
  }

  getPaginatorAdresses(page: number, size: number, sort: string) {
    return this.http.get<Adresse[]>(this.host + '/adresses/allp?page=' + page + '&size=' + size + '&sort=' + sort);
  }

  deleteAdresse(c: Adresse): Observable<void> {
    return this.http.delete<void>(this.host + '/adresses/' + c.id);
  }
  save(c: Adresse): Observable<Adresse> {
    return this.http.post<Adresse>(this.host + '/adresses', c, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  updateAdresse(c: Adresse): Observable<Adresse> {
    return this.http.put<Adresse>(this.host + '/adresses/' + c.id, c);
  }
}

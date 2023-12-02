import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Location } from '../entities/location.entities';
import { Client } from '../entities/clients.entities';

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private host = environment.host;

  constructor(private http: HttpClient) {}

  getLocation(idlocation: number): Observable<Location> {
    return this.http.get<Location>(this.host + '/locations/' + idlocation);
  }

  searchLocations(client: Client): Observable<Location[]> {
    return this.http.get<Location[]>(this.host + '/locations/idclient=' + client.id);
  }

  getPaginatorLocations(page: number, size: number, sort: string) {
    return this.http.get<Location[]>(this.host + '/locations/allp?page=' + page + '&size=' + size + '&sort=' + sort);
  }

  deleteLocation(c: Location): Observable<void> {
    return this.http.delete<void>(this.host + '/locations/' + c.id);
  }

  save(c: Location): Observable<Location> {
    return this.http.post<Location>(this.host + '/locations', c, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  updateLocation(c: Location): Observable<Location> {
    return this.http.put<Location>(this.host + '/locations/' + c.id, c);
  }
}

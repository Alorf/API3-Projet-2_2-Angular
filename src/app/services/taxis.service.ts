import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Taxi } from '../entities/taxi.entities';
import { Location } from '../entities/location.entities';

@Injectable({ providedIn: 'root' })
export class TaxisService {
  private host = environment.host;

  constructor(private http: HttpClient) {}

  getTaxi(idtaxi: number): Observable<Taxi> {
    return this.http.get<Taxi>(this.host + '/taxis/' + idtaxi);
  }

  searchTaxis(immatriculation: string): Observable<Taxi> {
    return this.http.get<Taxi>(this.host + '/taxis/immatriculation=' + immatriculation);
  }

  getAllTaxis(): Observable<Taxi[]> {
    return this.http.get<Taxi[]>(this.host + '/taxis/all');
  }

  GetAllTaxiNotUsedInLocation(location: Location) {
    return this.http.get<Taxi[]>(this.host + '/taxis/all/location=' + location!.id);
  }

  getPaginatorTaxis(page: number, size: number, sort: string) {
    return this.http.get<Taxi[]>(this.host + '/taxis/allp?page=' + page + '&size=' + size + '&sort=' + sort);
  }

  deleteTaxi(c: Taxi): Observable<void> {
    return this.http.delete<void>(this.host + '/taxis/' + c.id);
  }
  save(c: Taxi): Observable<Taxi> {
    return this.http.post<Taxi>(this.host + '/taxis', c, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  updateTaxi(c: Taxi): Observable<Taxi> {
    return this.http.put<Taxi>(this.host + '/taxis/' + c.id, c);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Facture } from '../entities/facture.entities';
import { Location } from '../entities/location.entities';

@Injectable({ providedIn: 'root' })
export class FacturesService {
  private host = environment.host;

  constructor(private http: HttpClient) {}

  getFacture(facture: Facture): Observable<Facture> {
    return this.http.get<Facture>(this.host + '/factures/' + facture.location.id + '/' + facture.taxi.id);
  }

  searchFactures(location: Location): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.host + '/factures/idlocation=' + location.id);
  }

  getPaginatorFacturesByIdLocation(location: Location, page: number, size: number, sort: string) {
    return this.http.get<Facture[]>(
      this.host + '/factures/allp/' + location.id + '?page=' + page + '&size=' + size + '&sort=' + sort,
    );
  }

  deleteFacture(c: Facture): Observable<void> {
    return this.http.delete<void>(this.host + '/factures/' + c.location.id + '/' + c.taxi.id);
  }

  save(c: Facture): Observable<Facture> {
    return this.http.post<Facture>(this.host + '/factures', c, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  updateFacture(c: Facture): Observable<Facture> {
    return this.http.put<Facture>(this.host + '/factures/' + c.location.id + '/' + c.taxi.id, c);
  }
}

import { Adresse } from "./adresse.entities";
import { Client } from "./clients.entities";

export interface Location {
  id: number;
  dateloc: string;
  kmTotal: number;
  cp: number;
  client : Client;
  adrDepart: Adresse;
  num: string;
  tel: string;
}

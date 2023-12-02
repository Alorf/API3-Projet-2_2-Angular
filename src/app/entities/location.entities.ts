import { Adresse } from "./adresse.entities";
import { Client } from "./clients.entities";

export interface Location {
  id: number;
  dateloc: string;
  kmTotal: string;
  cp: number;
  client : Client;
  adrDepart: Adresse;
  num: string;
  tel: string;
}

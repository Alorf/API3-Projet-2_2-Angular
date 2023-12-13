import { Location } from "./location.entities";
import { Taxi } from "./taxi.entities";

export interface Facture {
  location: Location;
  taxi: Taxi;
  cout: number;
}

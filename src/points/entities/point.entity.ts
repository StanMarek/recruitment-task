import { Marker } from 'src/types';

export class Point implements Marker {
  id: number;
  lat: number;
  lng: number;
}

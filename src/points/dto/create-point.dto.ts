import { IsNumber } from 'class-validator';

export class CreatePointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

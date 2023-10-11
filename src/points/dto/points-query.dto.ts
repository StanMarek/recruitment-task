import { IsNumber, IsOptional } from 'class-validator';

export class PointsQuery {
  @IsOptional()
  @IsNumber()
  scale?: number;
}

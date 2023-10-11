import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as geolib from 'geolib';
import { ClustersService } from 'src/clusters/clusters.service';
import { CreatePointDto } from './dto/create-point.dto';
import { PointsQuery } from './dto/points-query.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointsService } from './points.service';

@Controller('points')
@ApiTags('points')
export class PointsController {
  constructor(
    private readonly pointsService: PointsService,
    private readonly clustersService: ClustersService,
  ) {}

  @Post()
  async create(@Body() createPointDto: CreatePointDto) {
    if (
      !geolib.isValidCoordinate({
        latitude: createPointDto.lat,
        longitude: createPointDto.lng,
      })
    ) {
      throw new BadRequestException('Invalid coordinates');
    }

    const point = await this.pointsService.create(createPointDto);
    return point;
  }

  @Get()
  async findAll(@Query() query: PointsQuery) {
    const points = await this.pointsService.findAll();
    const scale = query.scale < 0 ? 0 : query.scale;

    const clusteredPoints = this.clustersService.clusterPoints(points, scale);

    return clusteredPoints;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto) {
    return this.pointsService.update(+id, updatePointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointsService.remove(+id);
  }
}

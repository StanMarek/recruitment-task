import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Point } from './entities/point.entity';

@Injectable()
export class PointsService {
  db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config('points-db', true, true, '/'));
  }

  async findAll() {
    if (!(await this.db.exists('/points'))) {
      return [];
    }

    return this.db.getData('/points') as Promise<Point[]>;
  }

  async findOne(id: number) {
    if (!(await this.db.exists('/points'))) {
      return null;
    }
    const index = await this.db.getIndex('/points', id, 'id');
    if (index < 0) {
      return null;
    }

    return this.db.getObject(`/points[${index}]`) as Promise<Point>;
  }

  private async getLastIndex() {
    try {
      const point = (await this.db.getData('/points[-1]')) as Point;
      return point.id;
    } catch (e) {
      return 0;
    }
  }

  async create(point: CreatePointDto) {
    const lastPoint = await this.getLastIndex();
    const id = lastPoint ? lastPoint + 1 : 1;
    const newPoint: Point = { ...point, id };
    await this.db.push('/points[]', newPoint);
    const created = (await this.findOne(id)) as Point;

    return created;
  }

  async update(id: number, point: UpdatePointDto) {
    const index = await this.db.getIndex('/points', id, 'id');
    const pointToUpdate = (await this.db.getObject(
      `/points[${index}]`,
    )) as Point;
    if (index < 0) {
      return false;
    }
    const newPoint = { ...pointToUpdate, ...point, id };

    await this.db.push(`/points[${index}]`, newPoint);

    return true;
  }

  async remove(id: number) {
    const index = await this.db.getIndex('/points', id, 'id');
    if (index < 0) {
      return false;
    }
    await this.db.delete(`/points[${index}]`);

    return true;
  }
}

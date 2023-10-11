import { Module } from '@nestjs/common';
import { ClustersModule } from 'src/clusters/clusters.module';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

@Module({
  controllers: [PointsController],
  providers: [PointsService],
  imports: [ClustersModule],
})
export class PointsModule {}

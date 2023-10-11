import { Module } from '@nestjs/common';
import { PointsModule } from './points/points.module';
import { ClustersModule } from './clusters/clusters.module';

@Module({
  imports: [PointsModule, ClustersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

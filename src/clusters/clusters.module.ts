import { Module } from '@nestjs/common';
import { ClustersService } from './clusters.service';

@Module({
  providers: [ClustersService],
  exports: [ClustersService],
})
export class ClustersModule {}

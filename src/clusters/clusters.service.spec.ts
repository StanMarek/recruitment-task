import { Test, TestingModule } from '@nestjs/testing';
import { ClustersService } from './clusters.service';

describe('ClustersService', () => {
  let service: ClustersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClustersService],
    }).compile();

    service = module.get<ClustersService>(ClustersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('clusterPoints', () => {
    it('should cluster points correctly', () => {
      const points = [
        { lat: 37.7749, lng: -122.4194, id: 1 },
        { lat: 37.7755, lng: -122.4182, id: 2 },
      ];

      const zoom = 1;

      const clusters = service.clusterPoints(points, zoom);

      expect(clusters).toHaveLength(1);
    });
  });
});

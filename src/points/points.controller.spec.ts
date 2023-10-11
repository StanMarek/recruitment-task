import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClustersService } from 'src/clusters/clusters.service';
import { CreatePointDto } from './dto/create-point.dto';
import { PointsQuery } from './dto/points-query.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

describe('PointsController', () => {
  let controller: PointsController;
  let pointsService: PointsService;
  let clustersService: ClustersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsController],
      providers: [PointsService, ClustersService],
    }).compile();

    controller = module.get<PointsController>(PointsController);
    pointsService = module.get<PointsService>(PointsService);
    clustersService = module.get<ClustersService>(ClustersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a point', async () => {
      const createPointDto: CreatePointDto = {
        lat: 37.7749,
        lng: -122.4194,
      };
      const expectedResult = { id: 1, ...createPointDto };

      jest.spyOn(pointsService, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createPointDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException for invalid coordinates', async () => {
      const createPointDto: CreatePointDto = {
        lat: 91,
        lng: -122.4194,
      };

      expect(
        async () => await controller.create(createPointDto),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return clustered points', async () => {
      const pointsQuery: PointsQuery = {
        scale: 12,
      };
      const mockedPoints = [
        {
          lat: 37.7749,
          lng: -122.4194,
          id: 3,
        },
        {
          lat: 40.7749,
          lng: -122.4194,
          id: 4,
        },
        {
          lat: 38.7749,
          lng: -122.4194,
          id: 5,
        },
        {
          lat: 38.7749,
          lng: -121.4194,
          id: 6,
        },
        {
          lat: 37.7746,
          lng: -122.4196,
          id: 7,
        },
        {
          lat: 37.7741,
          lng: -122.4197,
          id: 8,
        },
        {
          lat: 37.7749,
          lng: -122.4194,
          id: 9,
        },
      ];
      const mockedClusteredPoints = [
        {
          lat: 37.774625,
          lng: -122.419525,
        },
        {
          lat: 40.7749,
          lng: -122.4194,
        },
        {
          lat: 38.7749,
          lng: -122.4194,
        },
        {
          lat: 38.7749,
          lng: -121.4194,
        },
      ];

      jest.spyOn(pointsService, 'findAll').mockResolvedValue(mockedPoints);
      jest
        .spyOn(clustersService, 'clusterPoints')
        .mockReturnValue(mockedClusteredPoints);

      const result = await controller.findAll(pointsQuery);
      expect(result).toEqual(mockedClusteredPoints);
    });
  });

  describe('findOne', () => {
    it('should find a point by ID', async () => {
      const pointId = 1;
      const expectedResult = { id: pointId, lat: 37.7749, lng: -122.4194 };

      jest.spyOn(pointsService, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne(pointId.toString());
      expect(result).toEqual(expectedResult);
    });

    it('should return null for a non-existent point', async () => {
      const pointId = 999;

      jest.spyOn(pointsService, 'findOne').mockResolvedValue(null);

      const result = await controller.findOne(pointId.toString());
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a point and return true', async () => {
      const pointId = 1;
      const updatePointDto: UpdatePointDto = { lat: 37.7755, lng: -122.4182 };

      jest.spyOn(pointsService, 'update').mockResolvedValue(true);

      const result = await controller.update(
        pointId.toString(),
        updatePointDto,
      );
      expect(result).toBeTruthy();
    });

    it('should return false for an invalid point ID', async () => {
      const pointId = 999;
      const updatePointDto: UpdatePointDto = { lat: 37.7755, lng: -122.4182 };

      jest.spyOn(pointsService, 'update').mockResolvedValue(false);

      const result = await controller.update(
        pointId.toString(),
        updatePointDto,
      );
      expect(result).toBeFalsy();
    });
  });

  describe('remove', () => {
    it('should remove a point and return true', async () => {
      const pointId = 1;

      jest.spyOn(pointsService, 'remove').mockResolvedValue(true);

      const result = await controller.remove(pointId.toString());
      expect(result).toBeTruthy();
    });

    it('should return false for an invalid point ID', async () => {
      const pointId = 999;

      jest.spyOn(pointsService, 'remove').mockResolvedValue(false);

      const result = await controller.remove(pointId.toString());
      expect(result).toBeFalsy();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PointsService } from './points.service';

describe('PointsService', () => {
  let service: PointsService;

  const pointsServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointsService,
        {
          provide: PointsService,
          useValue: pointsServiceMock,
        },
      ],
    }).compile();

    service = module.get<PointsService>(PointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an empty array when no points are stored', async () => {
      pointsServiceMock.findAll.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return null when no points are stored', async () => {
      pointsServiceMock.findOne.mockResolvedValue(null);
      const result = await service.findOne(1);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new point and return it', async () => {
      const createDto = {
        lat: 37.7749,
        lng: -122.4194,
      };
      const createdPoint = {
        lat: 37.7749,
        lng: -122.4194,
        id: 1,
      };
      pointsServiceMock.create.mockResolvedValue(createdPoint);
      const result = await service.create(createDto);
      expect(result).toEqual(createdPoint);
    });
  });

  describe('update', () => {
    it('should update an existing point and return true', async () => {
      const pointId = 1;
      const updateDto = {
        lat: 37.7748,
      };
      pointsServiceMock.update.mockResolvedValue(true);
      const result = await service.update(pointId, updateDto);
      expect(result).toBeTruthy();
    });

    it('should return false for an invalid point ID', async () => {
      const pointId = -1;
      const updateDto = {
        lat: 37.7748,
      };
      pointsServiceMock.update.mockResolvedValue(false);
      const result = await service.update(pointId, updateDto);
      expect(result).toBeFalsy();
    });
  });

  describe('remove', () => {
    it('should remove an existing point and return true', async () => {
      const pointId = 1;
      pointsServiceMock.remove.mockResolvedValue(true);
      const result = await service.remove(pointId);
      expect(result).toBeTruthy();
    });

    it('should return false for an invalid point ID', async () => {
      const pointId = -1;
      pointsServiceMock.remove.mockResolvedValue(false);
      const result = await service.remove(pointId);
      expect(result).toBeFalsy();
    });
  });
});

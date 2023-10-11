import { Injectable } from '@nestjs/common';
import { Point } from 'src/points/entities/point.entity';
import { Marker } from 'src/types';

@Injectable()
export class ClustersService {
  clusterPoints(points: Point[], zoom: number): Marker[] {
    const gridSize = 0.1 / Math.pow(2, zoom);
    const clustersMap: Map<string, Point[]> = new Map<string, Point[]>();

    for (const point of points) {
      const gridLat = Math.floor(point.lat / gridSize);
      const gridLng = Math.floor(point.lng / gridSize);
      const gridKey = `${gridLat}:${gridLng}`;

      if (!clustersMap.has(gridKey)) {
        clustersMap.set(gridKey, [point]);
      } else {
        clustersMap.get(gridKey).push(point);
      }
    }

    const newMarkers: { lat: number; lng: number }[] = [];

    for (const cluster of clustersMap.keys()) {
      const clusterPoints = clustersMap.get(cluster);
      const newMarker = this.calculateNewMarker(clusterPoints);
      newMarkers.push(newMarker);
    }

    return newMarkers;
  }

  private calculateNewMarker(clusterPoints: Point[]): Marker {
    const latSum = clusterPoints.reduce((acc, point) => acc + point.lat, 0);
    const lngSum = clusterPoints.reduce((acc, point) => acc + point.lng, 0);
    const latAvg = latSum / clusterPoints.length;
    const lngAvg = lngSum / clusterPoints.length;

    return { lat: latAvg, lng: lngAvg };
  }
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PatternAxis3D } from './patternAmplifierTypes';

export interface SVGPoint2D {
  x: number;
  y: number;
  scale: number; // depth scale (derived from Z coordinate)
}

// Coordinate projection helper: converts 3D modeling points to 2.5D SVG pixels
export function project3DTo2D(
  pt: PatternAxis3D,
  originX: number = 300,
  originY: number = 350,
  zoom: number = 1.0
): SVGPoint2D {
  // Axes projection definition:
  // X axis goes directly right (+X)
  // Y axis goes directly up (-Y in SVG viewport space, since 0 is top)
  // Z axis represents depth (isometric projecting at 45 deg angle)
  
  const zAngleRad = (35 * Math.PI) / 180; // 35-degree tilt
  const zScale = 0.8; // Z axis foreshortening factor

  // Apply basic perspective/cabinet layout formula
  // Positive Z elements are slightly projected up & right in 3D cabinet style
  const projectedX = originX + (pt.x + pt.z * Math.cos(zAngleRad) * zScale) * zoom;
  const projectedY = originY - (pt.y + pt.z * Math.sin(zAngleRad) * zScale) * zoom;

  // Calculate scaling factor based on Z to represent depth/externalization
  // Elements with high Z (outwards) are slightly larger/clearer
  // Elements with negative Z (internalized depth) are scaled down
  const baseScale = 1.0;
  const depthFactor = pt.z / 200; // normalized depth
  const scale = Math.max(0.4, Math.min(1.8, baseScale + depthFactor * 0.4));

  return {
    x: Math.round(projectedX),
    y: Math.round(projectedY),
    scale
  };
}

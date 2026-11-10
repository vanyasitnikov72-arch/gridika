export type TargetShapeType = 'city' | 'crystal' | 'pyramid' | 'heart' | 'sphere';

export interface VoxelTarget {
  x: number;
  y: number;
  z: number;
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
}

/**
 * Computes 3D target coordinates for N voxels based on the chosen shape.
 */
export function generateTargetShapePositions(
  shape: TargetShapeType,
  count: number,
  qrSize: number
): VoxelTarget[] {
  const targets: VoxelTarget[] = [];
  const radius = qrSize * 0.45;

  switch (shape) {
    case 'city': {
      // Skyscraper metropolis: distributed across a grid with varying skyscraper heights
      const gridSize = Math.ceil(Math.sqrt(count));
      const step = (qrSize * 0.8) / gridSize;
      const offset = (gridSize * step) / 2;

      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        // Pseudo-random height based on coordinates for deterministic city skyline
        const seed = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
        const norm = seed - Math.floor(seed);
        
        // Downtown center is taller
        const distFromCenter = Math.hypot(col - gridSize / 2, row - gridSize / 2) / (gridSize / 2);
        const centerBoost = Math.max(0, 1 - distFromCenter);
        const heightMultiplier = (0.2 + norm * 0.8) * (1 + centerBoost * 2.5);

        const x = col * step - offset;
        const z = row * step - offset;
        const h = Math.max(1, heightMultiplier * (qrSize * 0.35));
        const y = h / 2; // Sit on ground plane

        targets.push({
          x,
          y,
          z,
          scaleX: 0.9,
          scaleY: h,
          scaleZ: 0.9,
        });
      }
      break;
    }

    case 'crystal': {
      // 3D Diamond / Octahedron with core and outer facets
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;

        // Octahedral distortion
        const r = radius * (0.8 + 0.3 * Math.cos(theta * 4));
        const x = r * Math.sin(phi) * Math.cos(theta);
        const z = r * Math.sin(phi) * Math.sin(theta);
        // Pointy top and bottom
        const y = r * 1.3 * Math.cos(phi);

        targets.push({
          x,
          y,
          z,
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        });
      }
      break;
    }

    case 'pyramid': {
      // Stepped pyramid
      const levels = 8;
      const stepHeight = (qrSize * 0.4) / levels;
      let placed = 0;

      for (let lvl = 0; lvl < levels && placed < count; lvl++) {
        const width = levels - lvl;
        const y = (lvl + 0.5) * stepHeight;

        for (let r = -width; r <= width && placed < count; r++) {
          for (let c = -width; c <= width && placed < count; c++) {
            // Only place on border or solid fill
            if (Math.abs(r) === width || Math.abs(c) === width || lvl === 0) {
              const x = c * (qrSize * 0.05);
              const z = r * (qrSize * 0.05);
              targets.push({
                x,
                y,
                z,
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1,
              });
              placed++;
            }
          }
        }
      }

      // Fill remaining if any
      while (targets.length < count) {
        targets.push({
          x: (Math.random() - 0.5) * qrSize * 0.6,
          y: Math.random() * qrSize * 0.3,
          z: (Math.random() - 0.5) * qrSize * 0.6,
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        });
      }
      break;
    }

    case 'heart': {
      // 3D Voxel Heart (parametric heart curve)
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const u = ((i * 7) % count) / count; // depth spread
        const zDepth = (u - 0.5) * (qrSize * 0.25);

        // Standard 2D heart formula
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        const scale = (qrSize * 0.025) * (1 - Math.abs(u - 0.5) * 0.8);
        const x = hx * scale;
        const y = hy * scale + qrSize * 0.1;
        const z = zDepth;

        targets.push({
          x,
          y,
          z,
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        });
      }
      break;
    }

    case 'sphere':
    default: {
      // Fibonacci sphere
      const phi = Math.PI * (Math.sqrt(5) - 1); // Golden angle
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
        const radAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radAtY * radius;
        const z = Math.sin(theta) * radAtY * radius;

        targets.push({
          x,
          y: y * radius + radius * 0.3,
          z,
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        });
      }
      break;
    }
  }

  return targets;
}

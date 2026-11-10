export type TargetShapeType = 'phone' | 'city' | 'crystal' | 'pyramid' | 'heart' | 'sphere';

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
 * All shapes are positioned so they never penetrate or pass through the ground podium (y >= 0).
 */
export function generateTargetShapePositions(
  shape: TargetShapeType,
  count: number,
  qrSize: number
): VoxelTarget[] {
  const targets: VoxelTarget[] = [];
  const hoverGap = 1.0; // Air cushion gap above the ceramic podium

  switch (shape) {
    case 'phone': {
      // 3D Smartphone monolith: stands proudly upright above the podium
      const phoneH = qrSize * 0.72;
      const phoneW = phoneH * 0.52;
      const halfW = phoneW / 2;
      const halfH = phoneH / 2;
      const yCenter = hoverGap + halfH;

      const cols = Math.floor(phoneW / 0.88);
      const rows = Math.floor(phoneH / 0.88);

      let placed = 0;

      // Distribute voxels in rounded squircle phone body
      for (let r = 0; r < rows && placed < count; r++) {
        for (let c = 0; c < cols && placed < count; c++) {
          const nx = (c / (cols - 1 || 1) - 0.5) * 2; // -1 to 1
          const ny = (r / (rows - 1 || 1) - 0.5) * 2; // -1 to 1

          // Squircle rounded corners formula
          const squircle = Math.pow(nx, 4) + Math.pow(ny, 4);
          if (squircle <= 1.0) {
            const x = nx * halfW;
            const y = yCenter - ny * halfH;

            // Dynamic Island bump
            const isDynamicIsland = Math.abs(nx) < 0.28 && Math.abs(ny - (-0.72)) < 0.08;
            const z = isDynamicIsland ? 0.8 : 0;

            targets.push({
              x,
              y,
              z,
              scaleX: isDynamicIsland ? 1.05 : 0.92,
              scaleY: isDynamicIsland ? 1.05 : 0.92,
              scaleZ: isDynamicIsland ? 1.2 : 0.85,
            });
            placed++;
          }
        }
      }

      // Fill remaining voxels along chassis perimeter for 3D body thickness
      while (targets.length < count) {
        const t = (targets.length / count) * Math.PI * 2;
        targets.push({
          x: Math.cos(t) * halfW * 0.92,
          y: yCenter + Math.sin(t) * halfH * 0.92,
          z: -0.6,
          scaleX: 0.88,
          scaleY: 0.88,
          scaleZ: 1.1,
        });
      }
      break;
    }

    case 'city': {
      // Skyscraper metropolis: buildings rest securely on top of the podium disk
      const gridSize = Math.ceil(Math.sqrt(count));
      const step = (qrSize * 0.8) / gridSize;
      const offset = (gridSize * step) / 2;
      const maxH = qrSize * 0.55;

      for (let i = 0; i < count; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        // Deterministic pseudo-random height based on coordinates
        const seed = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
        const norm = seed - Math.floor(seed);

        // Downtown center is taller
        const distFromCenter = Math.hypot(col - gridSize / 2, row - gridSize / 2) / (gridSize / 2);
        const centerBoost = Math.max(0, 1 - distFromCenter);
        const heightMultiplier = (0.2 + norm * 0.8) * (1 + centerBoost * 2.0);

        const x = col * step - offset;
        const z = row * step - offset;
        const h = Math.max(1.2, heightMultiplier * maxH);
        // Box geometry has height 0.88 * h. Position y at half-height so bottom face rests at y = 0.05
        const y = (0.88 * h) / 2 + 0.05;

        targets.push({
          x,
          y,
          z,
          scaleX: 0.88,
          scaleY: h,
          scaleZ: 0.88,
        });
      }
      break;
    }

    case 'crystal': {
      // 3D Diamond / Octahedron: levitates gracefully above the ceramic pedestal
      const crystalH = qrSize * 0.65;
      const halfH = crystalH / 2;
      const crystalRadius = qrSize * 0.35;
      const yCenter = hoverGap + halfH;

      for (let i = 0; i < count; i++) {
        // phi ranges from 0 (top apex) to PI (bottom apex)
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;

        // Octahedral 4-facet distortion with tapering at both poles
        const facetMod = 0.84 + 0.22 * Math.cos(theta * 4);
        const r = crystalRadius * Math.sin(phi) * facetMod;

        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        // y ranges from yCenter - halfH (bottom tip) to yCenter + halfH (top tip)
        const y = yCenter + Math.cos(phi) * halfH;

        targets.push({
          x,
          y,
          z,
          scaleX: 0.95,
          scaleY: 0.95,
          scaleZ: 0.95,
        });
      }
      break;
    }

    case 'pyramid': {
      // Stepped pyramid: tiers sit firmly on top of the podium surface
      const levels = 8;
      const stepHeight = (qrSize * 0.42) / levels;
      let placed = 0;

      for (let lvl = 0; lvl < levels && placed < count; lvl++) {
        const width = levels - lvl;
        const y = (lvl + 0.5) * stepHeight + 0.05;

        for (let r = -width; r <= width && placed < count; r++) {
          for (let c = -width; c <= width && placed < count; c++) {
            if (Math.abs(r) === width || Math.abs(c) === width || lvl === 0) {
              const x = c * (qrSize * 0.048);
              const z = r * (qrSize * 0.048);
              targets.push({
                x,
                y,
                z,
                scaleX: 0.95,
                scaleY: 0.95,
                scaleZ: 0.95,
              });
              placed++;
            }
          }
        }
      }

      // Fill remaining voxels across pyramid steps (always above podium)
      while (targets.length < count) {
        const lvl = Math.floor(Math.random() * levels);
        const width = Math.max(1, levels - lvl);
        const r = (Math.random() * 2 - 1) * width;
        const c = (Math.random() * 2 - 1) * width;
        targets.push({
          x: c * (qrSize * 0.048),
          y: (lvl + 0.5) * stepHeight + 0.05,
          z: r * (qrSize * 0.048),
          scaleX: 0.95,
          scaleY: 0.95,
          scaleZ: 0.95,
        });
      }
      break;
    }

    case 'heart': {
      // 3D Voxel Heart: floats above the podium with its pointed bottom tip hovering cleanly
      const heartH = qrSize * 0.62;
      const heartW = heartH * 0.96;
      const yMin = hoverGap;

      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const u = ((i * 7) % count) / count; // depth spread
        const zDepth = (u - 0.5) * (qrSize * 0.22);

        // Standard parametric heart curve:
        // hy ranges from -17 (sharp bottom tip at t = PI) to +17 (top lobes)
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

        // Normalize vertical coordinate to [0, 1]
        const normY = (hy + 17) / 34;
        const y = yMin + normY * heartH;
        const x = (hx / 16) * (heartW / 2) * (1 - Math.abs(u - 0.5) * 0.4);
        const z = zDepth;

        targets.push({
          x,
          y,
          z,
          scaleX: 0.95,
          scaleY: 0.95,
          scaleZ: 0.95,
        });
      }
      break;
    }

    case 'sphere':
    default: {
      // Fibonacci sphere: floats as a spherical orb directly above the pedestal
      const sphereRadius = qrSize * 0.35;
      const yCenter = hoverGap + sphereRadius;
      const phi = Math.PI * (Math.sqrt(5) - 1); // Golden angle

      for (let i = 0; i < count; i++) {
        const normY = 1 - (i / (count - 1 || 1)) * 2; // 1 at north pole, -1 at south pole
        const radAtY = Math.sqrt(Math.max(0, 1 - normY * normY));
        const theta = phi * i;

        const x = Math.cos(theta) * radAtY * sphereRadius;
        const y = yCenter + normY * sphereRadius;
        const z = Math.sin(theta) * radAtY * sphereRadius;

        targets.push({
          x,
          y,
          z,
          scaleX: 0.95,
          scaleY: 0.95,
          scaleZ: 0.95,
        });
      }
      break;
    }
  }

  // Universal safety floor check:
  // Guarantees that every single voxel strictly clears the podium surface (y >= 0.05)
  let minBottom = Infinity;
  for (const t of targets) {
    const halfH = (0.88 * (t.scaleY ?? 1)) / 2;
    const bottom = t.y - halfH;
    if (bottom < minBottom) {
      minBottom = bottom;
    }
  }

  const clearanceThreshold = 0.25;
  if (minBottom < clearanceThreshold) {
    const lift = clearanceThreshold - minBottom;
    for (const t of targets) {
      t.y += lift;
    }
  }

  return targets;
}

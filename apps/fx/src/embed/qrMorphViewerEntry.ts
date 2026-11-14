import * as THREE from 'three';
import { QrMorphViewer, THEMES } from '../engine/QrMorphViewer';
import type { TargetShapeType } from '../engine/shapes';
import type { TreeSeason } from '../engine/treeScene';
import type { TimeOfDay } from '../engine/cityScene';
import type { IslandMode } from '../engine/islandScene';
import type { GardenMode } from '../engine/mazeScene';
import type { EqMode } from '../engine/equalizerScene';
import type { CakeFlavor } from '../engine/cakeScene';
import type { CastleMode } from '../engine/castleScene';

export interface QrMorphWidgetOptions {
  url?: string;
  shape?: TargetShapeType;
  themeId?: string;
  season?: TreeSeason;
  timeOfDay?: TimeOfDay;
  islandMode?: IslandMode;
  gardenMode?: GardenMode;
  eqMode?: EqMode;
  cakeFlavor?: CakeFlavor;
  castleMode?: CastleMode;
  initialState?: 'qr' | 'morphed';
}

export function initQrMorphWidget(containerId: string, options: QrMorphWidgetOptions = {}) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  return new QrMorphViewer({
    container,
    text: options.url || 'https://gridika.ru',
    shape: options.shape || 'tree',
    themeId: options.themeId || 'velvet-emerald',
    season: options.season,
    timeOfDay: options.timeOfDay,
    islandMode: options.islandMode,
    gardenMode: options.gardenMode,
    eqMode: options.eqMode,
    cakeFlavor: options.cakeFlavor,
    castleMode: options.castleMode,
    initialState: options.initialState ?? 'morphed',
    standalone: true,
  });
}

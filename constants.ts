import { ActorType, Actor, FileSystemItem } from './types';

export const INITIAL_ACTORS: Actor[] = [
  {
    id: '1',
    name: 'Floor_Mesh',
    type: ActorType.STATIC_MESH,
    transform: { x: 400, y: 300, z: 0, rotation: 0, scale: 20 },
    color: '#2a2a2a',
    selected: false,
  },
  {
    id: '2',
    name: 'PlayerStart',
    type: ActorType.PLAYER_START,
    transform: { x: 150, y: 150, z: 10, rotation: 45, scale: 1 },
    color: '#3b82f6', // blue-500
    selected: false,
  },
  {
    id: '3',
    name: 'Sun_Light',
    type: ActorType.LIGHT,
    transform: { x: 600, y: 100, z: 50, rotation: 0, scale: 1 },
    color: '#eab308', // yellow-500
    selected: false,
  },
  {
    id: 'bp_char',
    name: 'BP_ThirdPersonCharacter',
    type: ActorType.CHARACTER,
    transform: { x: 400, y: 400, z: 0, rotation: 0, scale: 1 },
    color: '#60a5fa',
    selected: true,
  },
  {
    id: 'bp_door',
    name: 'BP_InteractiveDoor',
    type: ActorType.DOOR,
    transform: { x: 500, y: 300, z: 0, rotation: 0, scale: 1 },
    color: '#854d0e',
    selected: false,
  }
];

export const MOCK_ASSETS = [
  { name: 'M_BasicWall', type: 'Material' },
  { name: 'SM_Cube', type: 'StaticMesh' },
  { name: 'SM_Sphere', type: 'StaticMesh' },
  { name: 'BP_Character', type: 'Blueprint' },
  { name: 'T_Wood_D', type: 'Texture' },
  { name: 'T_Wood_N', type: 'Texture' },
];

export const INITIAL_FILE_SYSTEM: FileSystemItem[] = [
  { id: 'root', parentId: null, name: 'Content', type: 'folder' },
  { id: 'starter', parentId: 'root', name: 'StarterContent', type: 'folder' },
  { id: 'blueprints', parentId: 'root', name: 'Blueprints', type: 'folder' },
  { id: 'maps', parentId: 'root', name: 'Maps', type: 'folder' },
  { id: 'bp_char', parentId: 'blueprints', name: 'ThirdPersonCharacter', type: 'blueprint' },
  { id: 'map_main', parentId: 'maps', name: 'MainMap', type: 'text', content: 'Map Data...' },
];
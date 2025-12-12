export enum ActorType {
  STATIC_MESH = 'StaticMesh',
  LIGHT = 'PointLight',
  CAMERA = 'Camera',
  PLAYER_START = 'PlayerStart',
  BLUEPRINT = 'Blueprint',
  CHARACTER = 'Character',
  DOOR = 'Door',
}

export interface Transform {
  x: number;
  y: number;
  z: number; // Simulated Z via scale/shadow
  rotation: number;
  scale: number;
}

export interface Actor {
  id: string;
  name: string;
  type: ActorType;
  transform: Transform;
  color: string;
  selected: boolean;
  script?: string; // Generated script content
}

export interface LevelState {
  name: string;
  actors: Actor[];
  selectedActorIds: string[];
}

export interface LogMessage {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'warning' | 'error' | 'success';
}
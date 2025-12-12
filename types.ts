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
  scriptLanguage?: string; // e.g., 'cpp', 'js', 'python'
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

export enum ProjectTemplate {
  GAME = 'Game',
  ANIMATION = 'Animation',
  VIDEO = 'Video',
  PROGRAM = 'Program',
  BLANK = 'Blank',
}

// --- New File System Types ---

export type FileType = 'folder' | 'blueprint' | 'cpp' | 'python' | 'material' | 'texture' | 'text' | 'javascript';

export interface FileSystemItem {
  id: string;
  parentId: string | null;
  name: string;
  type: FileType;
  content?: string; // For text/code files
  isLocked?: boolean; // Requires a pack
}

export interface ClipboardItem {
  action: 'copy' | 'cut';
  item: FileSystemItem;
}

export interface ExtensionPack {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: string; // "Free" or amount
  features: string[];
  installed: boolean;
}

import React, { useState, useEffect, useRef } from 'react';
import { TopToolbar } from './components/TopToolbar';
import { Viewport } from './components/Viewport';
import { Outliner } from './components/Outliner';
import { DetailsPanel } from './components/DetailsPanel';
import { ContentBrowser } from './components/ContentBrowser';
import { Console } from './components/Console';
import { ProjectHub } from './components/ProjectHub';
import { Marketplace } from './components/Marketplace';
import { CodeEditor } from './components/CodeEditor';
import { ExportWizard, ExportSettings } from './components/ExportWizard';
import { Actor, LogMessage, ActorType, ProjectTemplate, ExtensionPack, FileSystemItem } from './types';
import { INITIAL_ACTORS, INITIAL_FILE_SYSTEM } from './constants';
import { generateLevelFromPrompt } from './services/geminiService';
import JSZip from 'jszip';

const AVAILABLE_PACKS: ExtensionPack[] = [
    {
        id: 'cpp',
        name: 'C++ Pro Integration',
        description: 'Enables creation and compilation of C++ classes. Includes IntelliSense and Hot Reload.',
        icon: <span className="font-mono font-bold">C++</span>,
        price: 'Free',
        features: ['C++ Class Wizard', 'Compiler Access', 'Performance Profiler'],
        installed: false
    },
    {
        id: 'python',
        name: 'Python Scripting',
        description: 'Automate editor tasks and build pipelines using Python.',
        icon: <span className="font-mono font-bold text-yellow-500">PY</span>,
        price: '$49.99',
        features: ['Python Console', 'Editor Scripting API', 'Automated Testing'],
        installed: false
    },
    {
        id: 'materials',
        name: 'Material Lab',
        description: 'Advanced material creation suite with node-based editing.',
        icon: <span className="font-bold text-green-500">MAT</span>,
        price: 'Free',
        features: ['Material Instance Editor', 'Texture Streaming', 'Shader Profiler'],
        installed: false
    },
    {
        id: 'editor',
        name: 'Advanced Code Editor',
        description: 'A fully featured code editor within the engine. Syntax highlighting and formatting.',
        icon: <span className="font-bold text-blue-400">IDE</span>,
        price: '$19.99',
        features: ['Monaco Integration', 'Theme Support', 'Minimap'],
        installed: false
    }
];

const App: React.FC = () => {
  const [projectLoaded, setProjectLoaded] = useState(false);
  const [actors, setActors] = useState<Actor[]>(INITIAL_ACTORS);
  const [fileSystemItems, setFileSystemItems] = useState<FileSystemItem[]>(INITIAL_FILE_SYSTEM);
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // New State for Extensions and Modals
  const [packs, setPacks] = useState<ExtensionPack[]>(AVAILABLE_PACKS);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showExportWizard, setShowExportWizard] = useState(false);
  const [openFile, setOpenFile] = useState<FileSystemItem | null>(null);

  // Game State
  const [isPlaying, setIsPlaying] = useState(false);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs for Game Loop
  const actorsRef = useRef(actors);
  const isPlayingRef = useRef(isPlaying);
  const keysRef = useRef<Set<string>>(new Set());
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const playerVelocityZRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);

  // Sync refs
  useEffect(() => { actorsRef.current = actors; }, [actors]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  useEffect(() => {
    addLog('WebUnreal 5 Engine initialized.', 'info');

    const handleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleTemplateSelect = (template: ProjectTemplate) => {
      // Seed initial actors based on template
      let seedActors: Actor[] = [];
      const createId = () => Math.random().toString(36).substr(2, 9);
      
      if (template === ProjectTemplate.BLANK) {
          seedActors = [
            { id: createId(), name: 'Floor', type: ActorType.STATIC_MESH, transform: { x: 400, y: 300, z: 0, rotation: 0, scale: 20 }, color: '#222', selected: false },
            { id: createId(), name: 'Sun', type: ActorType.LIGHT, transform: { x: 600, y: 100, z: 50, rotation: 0, scale: 1 }, color: '#eab308', selected: false },
          ];
      } else if (template === ProjectTemplate.ANIMATION) {
          seedActors = [
              ...INITIAL_ACTORS,
              { id: createId(), name: 'CinematicCamera', type: ActorType.CAMERA, transform: { x: 200, y: 200, z: 10, rotation: -45, scale: 1.5 }, color: '#000', selected: false }
          ];
      } else {
          // Default GAME or PROGRAM setup
          seedActors = [...INITIAL_ACTORS];
      }

      setActors(seedActors);
      setProjectLoaded(true);
      addLog(`Project created using ${template} template.`, 'success');
  };

  const gameLoop = (time: number) => {
    if (previousTimeRef.current !== undefined) {
        const delta = (time - previousTimeRef.current) / 1000;
        updatePhysics(delta);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const updatePhysics = (delta: number) => {
      if (!isPlayingRef.current) return; // Only simulate physics in Play Mode

      const dt = Math.min(delta, 0.1);
      const currentActors = actorsRef.current;
      let hasChanges = false;
      const keys = keysRef.current;

      const newActors = currentActors.map(actor => {
          // --- Character Controller Logic ---
          if (actor.type === ActorType.CHARACTER) {
              let { x, y, z, rotation } = actor.transform;
              const speed = 250 * dt;
              let isMoving = false;

              // Movement
              if (keys.has('KeyW')) { y -= speed; rotation = 270; isMoving = true; }
              if (keys.has('KeyS')) { y += speed; rotation = 90; isMoving = true; }
              if (keys.has('KeyA')) { x -= speed; rotation = 180; isMoving = true; }
              if (keys.has('KeyD')) { x += speed; rotation = 0; isMoving = true; }

              // Jump
              if (keys.has('Space') && !isJumpingRef.current) {
                  playerVelocityZRef.current = 600;
                  isJumpingRef.current = true;
                  isMoving = true;
              }

              // Gravity & Z-Update
              if (isJumpingRef.current || z > 0) {
                  z += playerVelocityZRef.current * dt;
                  playerVelocityZRef.current -= 1500 * dt; // Gravity
                  if (z <= 0) {
                      z = 0;
                      isJumpingRef.current = false;
                      playerVelocityZRef.current = 0;
                  }
                  isMoving = true;
              }

              if (isMoving) {
                  hasChanges = true;
                  return { ...actor, transform: { ...actor.transform, x, y, z, rotation } };
              }
          }
          return actor;
      });

      if (hasChanges) {
          setActors(newActors);
      }
  };

  const addLog = (text: string, type: LogMessage['type'] = 'info') => {
    const newLog: LogMessage = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      text,
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleSelectActor = (id: string | null) => {
    setSelectedActorId(id);
    setActors(prev => prev.map(a => ({ ...a, selected: a.id === id })));
  };

  const handleUpdateActor = (updatedActor: Actor) => {
    setActors(prev => prev.map(a => a.id === updatedActor.id ? updatedActor : a));
  };

  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setActors(prev => prev.map(a => a.id === id ? { ...a, transform: { ...a.transform, x, y } } : a));
  };

  const handleGenerateLevel = async () => {
    if (!prompt.trim()) return;
    
    setIsAiLoading(true);
    addLog(`Generating level from: "${prompt}"...`, 'info');
    
    try {
      const newActors = await generateLevelFromPrompt(prompt);
      if (newActors.length > 0) {
        setActors(newActors);
        addLog(`Successfully generated ${newActors.length} actors.`, 'success');
      } else {
        addLog('No actors generated.', 'warning');
      }
    } catch (e: any) {
      addLog(`Generation Failed: ${e.message}`, 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDownloadProject = () => {
      // Trigger the Export Wizard Flow
      setShowExportWizard(true);
  };

  const handleFinalizeExport = async (settings: ExportSettings) => {
      addLog('Packaging project... please wait.', 'info');
      
      const zip = new JSZip();

      // 1. Create Project JSON
      const projectData = {
          version: '5.0.0',
          metadata: settings,
          actors: actors,
          timestamp: new Date().toISOString()
      };
      zip.file(`${settings.projectName}.uproject`, JSON.stringify(projectData, null, 2));

      // 2. Add File System Content
      // Recursive function to add items to zip folders
      const addToZip = (parentId: string | null, currentZipFolder: any) => {
          const children = fileSystemItems.filter(i => i.parentId === parentId);
          children.forEach(child => {
             if (child.type === 'folder') {
                 const newFolder = currentZipFolder.folder(child.name);
                 addToZip(child.id, newFolder);
             } else {
                 let ext = 'txt';
                 if (child.type === 'cpp') ext = 'cpp';
                 if (child.type === 'python') ext = 'py';
                 if (child.type === 'blueprint') ext = 'uasset';
                 currentZipFolder.file(`${child.name}.${ext}`, child.content || '');
             }
          });
      };
      
      const contentFolder = zip.folder('Content');
      addToZip('root', contentFolder);

      // 3. Add Simulated Build Artifact based on type
      const buildFolder = zip.folder('Build');
      if (settings.type === 'Game') {
          buildFolder?.file(`${settings.projectName}.exe`, 'BINARY_GAME_DATA_MOCK');
          buildFolder?.file(`${settings.projectName}_Data.pak`, 'ASSET_DATA_MOCK');
      } else if (settings.type === 'Video') {
          buildFolder?.file(`${settings.projectName}_Sequence.mp4`, 'VIDEO_DATA_MOCK');
      } else if (settings.type === 'HTML5') {
          buildFolder?.file('index.html', '<html><body>Game Loaded</body></html>');
      }

      // 4. Generate and Download
      try {
          const blob = await zip.generateAsync({type: "blob"});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${settings.projectName}_Package.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          addLog('Packaging complete. Download started.', 'success');
          setShowExportWizard(false);
      } catch (e) {
          addLog('Failed to generate zip package.', 'error');
      }
  };

  const triggerFileUpload = () => {
      if (fileInputRef.current) {
          fileInputRef.current.click();
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      
      if (file.name.endsWith('.json') || file.name.endsWith('.uproject')) {
          reader.onload = (event) => {
              try {
                  const content = event.target?.result as string;
                  const data = JSON.parse(content);
                  
                  if (data.actors && Array.isArray(data.actors)) {
                      setActors(data.actors);
                      setProjectLoaded(true);
                      addLog(`Project "${file.name}" loaded successfully.`, 'success');
                  } else {
                      addLog('Invalid project file format: missing actors array.', 'error');
                  }
              } catch (err) {
                  addLog('Failed to parse project file.', 'error');
              }
          };
          reader.readAsText(file);
      } else {
           // Handle "other files" - mocked for now
           reader.onload = () => {
               addLog(`File "${file.name}" imported. (Asset import simulation)`, 'info');
           };
           reader.readAsDataURL(file); // Just read it to simulate activity
      }
      
      e.target.value = '';
  };

  const handleInstallPack = (packId: string) => {
      setPacks(packs.map(p => p.id === packId ? { ...p, installed: true } : p));
      addLog(`Pack Installed: ${packs.find(p => p.id === packId)?.name}`, 'success');
  };

  const selectedActor = actors.find(a => a.id === selectedActorId) || null;
  const installedPackIds = packs.filter(p => p.installed).map(p => p.id);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#121212] overflow-hidden font-sans relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".json, .png, .jpg, .txt, .js, .cpp, .uproject"
      />

      {/* Modals */}
      {showMarketplace && (
          <Marketplace 
            packs={packs} 
            onInstall={handleInstallPack} 
            onClose={() => setShowMarketplace(false)} 
          />
      )}
      
      {showExportWizard && (
          <ExportWizard 
             onClose={() => setShowExportWizard(false)}
             onFinalize={handleFinalizeExport}
          />
      )}

      {openFile && (
          <CodeEditor 
            file={openFile}
            onSave={(id, content) => {
                // Update file content in FileSystem state
                setFileSystemItems(prev => prev.map(f => f.id === id ? { ...f, content } : f));
                addLog(`File ${openFile.name} saved and compiled.`, 'success');
                setOpenFile(null);
            }}
            onClose={() => setOpenFile(null)}
          />
      )}

      {projectLoaded ? (
         <>
          <TopToolbar 
              isPlaying={isPlaying} 
              onTogglePlay={() => {
                  if (isPlaying) addLog('Simulation Stopped.', 'warning');
                  else addLog('Simulation Started. Controls active.', 'success');
                  setIsPlaying(!isPlaying);
              }}
              onDownload={handleDownloadProject}
              onOpen={triggerFileUpload}
          />

          {/* Main Workspace Grid */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Toolbar / Modes (Simplified vertical strip) */}
            <div className="w-12 bg-[#1e1e1e] border-r border-black flex flex-col items-center py-2 space-y-2 text-neutral-400 z-10">
               <div className="p-2 rounded bg-neutral-800 text-orange-500 cursor-pointer border-l-2 border-orange-500" title="Select Mode">
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7 2L20 13H13V22L7 2Z"/></svg>
               </div>
               <div className="p-2 rounded hover:bg-[#333] cursor-pointer hover:text-neutral-200 transition-colors" title="Landscape Mode">
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/></svg>
               </div>
               <div className="p-2 rounded hover:bg-[#333] cursor-pointer hover:text-neutral-200 transition-colors" title="Foliage Mode">
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C7 2 3 7 3 12c0 5 7 10 7 10s4-6 4-10c0-2-2-4-2-4s2 1 2 4c0 1-1 2-2 3 0-5 2-7 5-7 2 0 3 2 3 5 0 2-2 5-2 5s5-3 5-7c0-4-6-9-11-9z"/></svg>
               </div>
            </div>

            {/* Center Viewport */}
            <div className="flex-1 flex flex-col relative">
               {/* AI Prompt Overlay */}
               {!isPlaying && (
                   <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20 w-[32rem] max-w-full">
                      <div className="bg-[#111]/90 backdrop-blur-md border border-neutral-600 rounded-lg p-1.5 flex shadow-2xl items-center">
                         <div className="text-orange-500 px-2">
                             <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                         </div>
                         <input 
                           type="text" 
                           value={prompt}
                           onChange={(e) => setPrompt(e.target.value)}
                           placeholder="Describe a level... (e.g. 'Cyberpunk street with neon lights')"
                           className="bg-transparent text-sm text-white p-2 flex-1 focus:outline-none placeholder-neutral-500 font-light"
                           onKeyDown={(e) => e.key === 'Enter' && handleGenerateLevel()}
                         />
                         <button 
                           onClick={handleGenerateLevel}
                           disabled={isAiLoading}
                           className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-xs px-4 py-1.5 rounded font-bold transition-all disabled:opacity-50 uppercase tracking-wider"
                         >
                           {isAiLoading ? 'Busy...' : 'Generate'}
                         </button>
                      </div>
                   </div>
               )}

               <Viewport 
                 actors={actors} 
                 onSelect={handleSelectActor} 
                 onUpdatePosition={handleUpdatePosition} 
                 isPlaying={isPlaying}
               />
               
               {/* Bottom Content Browser / Console Split */}
               <div className="h-72 border-t border-black flex">
                  <div className="flex-1 border-r border-black">
                      <ContentBrowser 
                        installedPacks={installedPackIds}
                        onOpenMarketplace={() => setShowMarketplace(true)}
                        onOpenFile={setOpenFile}
                        items={fileSystemItems}
                        setItems={setFileSystemItems}
                      />
                  </div>
                  <div className="w-1/3 min-w-[300px]">
                      <Console logs={logs} />
                  </div>
               </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l border-black flex flex-col bg-[#1a1a1a]">
               <div className="h-1/2 border-b border-black">
                  <Outliner actors={actors} onSelect={handleSelectActor} />
               </div>
               <div className="h-1/2">
                  <DetailsPanel actor={selectedActor} onUpdate={handleUpdateActor} />
               </div>
            </div>

          </div>

          {/* Footer Status Bar */}
          <div className="h-6 bg-[#262626] text-[10px] text-neutral-400 flex items-center px-2 space-x-4 border-t border-black font-medium">
             <span className="text-green-500">{isPlaying ? '● PLAYING IN EDITOR' : '○ Ready'}</span>
             <span className="flex-1"></span>
             <span>Source Control: <span className="text-neutral-500">Off</span></span>
             <span>Compiling Shaders: <span className="text-neutral-500">Finished</span></span>
          </div>
         </>
      ) : (
          <ProjectHub onSelectTemplate={handleTemplateSelect} onOpenProject={triggerFileUpload} />
      )}
    </div>
  );
};

export default App;
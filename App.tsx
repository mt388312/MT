import React, { useState, useEffect, useRef } from 'react';
import { TopToolbar } from './components/TopToolbar';
import { Viewport } from './components/Viewport';
import { Outliner } from './components/Outliner';
import { DetailsPanel } from './components/DetailsPanel';
import { ContentBrowser } from './components/ContentBrowser';
import { Console } from './components/Console';
import { Actor, LogMessage, ActorType } from './types';
import { INITIAL_ACTORS } from './constants';
import { generateLevelFromPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>(INITIAL_ACTORS);
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Refs for Game Loop
  const actorsRef = useRef(actors);
  const keysRef = useRef<Set<string>>(new Set());
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const playerVelocityZRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);

  useEffect(() => {
    actorsRef.current = actors;
  }, [actors]);

  useEffect(() => {
    addLog('WebUnreal 5 Engine initialized.', 'info');
    addLog('Controls: WASD to Move, Space to Jump.', 'success');

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

  const gameLoop = (time: number) => {
    if (previousTimeRef.current !== undefined) {
        const delta = (time - previousTimeRef.current) / 1000;
        updatePhysics(delta);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const updatePhysics = (delta: number) => {
      // Limit delta to prevent huge jumps if tab is inactive
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

          // --- Door Logic ---
          if (actor.type === ActorType.DOOR) {
              const player = currentActors.find(a => a.type === ActorType.CHARACTER);
              if (player) {
                  const dx = player.transform.x - actor.transform.x;
                  const dy = player.transform.y - actor.transform.y;
                  const dist = Math.sqrt(dx*dx + dy*dy);

                  // Open if player is close (within 120 units)
                  const targetRot = dist < 120 ? 90 : 0;
                  const currentRot = actor.transform.rotation;

                  // Simple Lerp for smooth opening/closing
                  if (Math.abs(targetRot - currentRot) > 0.5) {
                      const newRot = currentRot + (targetRot - currentRot) * 5 * dt;
                      hasChanges = true;
                      return { ...actor, transform: { ...actor.transform, rotation: newRot } };
                  }
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

  const selectedActor = actors.find(a => a.id === selectedActorId) || null;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#121212] overflow-hidden font-sans">
      <TopToolbar />

      {/* Main Workspace Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Toolbar / Modes (Simplified vertical strip) */}
        <div className="w-10 bg-[#1e1e1e] border-r border-neutral-700 flex flex-col items-center py-2 space-y-4 text-neutral-400">
           <div className="p-2 rounded bg-orange-500/20 text-orange-500 cursor-pointer"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg></div>
           <div className="p-2 rounded hover:bg-[#333] cursor-pointer"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/></svg></div>
           <div className="p-2 rounded hover:bg-[#333] cursor-pointer"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z"/></svg></div>
        </div>

        {/* Center Viewport */}
        <div className="flex-1 flex flex-col relative">
           {/* AI Prompt Overlay */}
           <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20 w-96 max-w-full">
              <div className="bg-[#111]/90 backdrop-blur border border-neutral-600 rounded-lg p-1 flex shadow-2xl">
                 <input 
                   type="text" 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="Describe a level to generate... (e.g. 'A stone circle with 5 candles')"
                   className="bg-transparent text-xs text-white p-2 flex-1 focus:outline-none placeholder-neutral-500"
                   onKeyDown={(e) => e.key === 'Enter' && handleGenerateLevel()}
                 />
                 <button 
                   onClick={handleGenerateLevel}
                   disabled={isAiLoading}
                   className="bg-orange-600 hover:bg-orange-500 text-white text-xs px-3 py-1 rounded font-bold transition-colors disabled:opacity-50"
                 >
                   {isAiLoading ? 'Busy...' : 'Generate'}
                 </button>
              </div>
           </div>

           <Viewport 
             actors={actors} 
             onSelect={handleSelectActor} 
             onUpdatePosition={handleUpdatePosition} 
           />
           
           {/* Bottom Content Browser / Console Split */}
           <div className="h-64 border-t border-neutral-700 flex">
              <div className="flex-1 border-r border-neutral-700">
                  <ContentBrowser />
              </div>
              <div className="w-1/3">
                  <Console logs={logs} />
              </div>
           </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-neutral-700 flex flex-col bg-[#1a1a1a]">
           <div className="h-1/2 border-b border-neutral-700">
               <Outliner actors={actors} onSelect={handleSelectActor} />
           </div>
           <div className="h-1/2">
               <DetailsPanel actor={selectedActor} onUpdate={handleUpdateActor} />
           </div>
        </div>

      </div>

      {/* Footer Status Bar */}
      <div className="h-6 bg-[#2e2e2e] text-[10px] text-neutral-400 flex items-center px-2 space-x-4 border-t border-neutral-600">
         <span>Ready</span>
         <span className="flex-1"></span>
         <span>Source Control: Off</span>
         <span>Compiling Shaders (2,403 left)...</span>
      </div>
    </div>
  );
};

export default App;
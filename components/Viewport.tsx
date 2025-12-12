import React, { useRef, useState, useEffect } from 'react';
import { Actor, ActorType } from '../types';

interface ViewportProps {
  actors: Actor[];
  onSelect: (id: string | null) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  isPlaying: boolean;
}

export const Viewport: React.FC<ViewportProps> = ({ actors, onSelect, onUpdatePosition, isPlaying }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggedActor, setDraggedActor] = useState<{ id: string, offsetX: number, offsetY: number } | null>(null);
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
  const [animTime, setAnimTime] = useState(0);

  // Animation loop for visual effects
  useEffect(() => {
    let animFrame: number;
    const animate = () => {
        setAnimTime(Date.now());
        animFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Camera follow logic
  useEffect(() => {
    if (isPlaying) {
        const player = actors.find(a => a.type === ActorType.CHARACTER);
        if (player) {
            // Smoothly interpolate camera or just lock it
            // For simplicitly, direct lock but centered
            setCameraPos({ x: player.transform.x, y: player.transform.y });
        }
    } else {
        // Reset or maintain editor camera (simplification: reset to center of map or just 0,0)
        // In a real editor, this would be a separate state. We'll keep it static for edit mode in this demo,
        // or effectively centered on the 'world' center (400,300) to match initial edit view.
        setCameraPos({ x: 400, y: 300 }); 
    }
  }, [actors, isPlaying]);

  const handleMouseDown = (e: React.MouseEvent, actor: Actor) => {
    if (isPlaying) return; // Disable drag in play mode
    e.stopPropagation();
    onSelect(actor.id);
    setDraggedActor({
      id: actor.id,
      offsetX: e.clientX - actor.transform.x,
      offsetY: e.clientY - actor.transform.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPlaying) return;
    if (draggedActor) {
      const newX = e.clientX - draggedActor.offsetX;
      const newY = e.clientY - draggedActor.offsetY;
      onUpdatePosition(draggedActor.id, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setDraggedActor(null);
  };

  const handleBgClick = () => {
    if (!isPlaying) onSelect(null);
  };

  // ViewBox Calculation
  // We want (cameraPos.x, cameraPos.y) to be in the center of the viewport
  // Viewport size is roughly window size, but SVG viewBox can be arbitrary. 
  // Let's assume a view area of 800x600 units.
  const viewWidth = 800;
  const viewHeight = 600;
  
  // If isPlaying, camera follows player. If not, it's fixed at 400,300 (center of default room)
  const vbX = cameraPos.x - viewWidth / 2;
  const vbY = cameraPos.y - viewHeight / 2;

  return (
    <div 
      className="flex-1 bg-[#0f0f0f] relative overflow-hidden select-none cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
        {/* Top Viewport Toolbar - Hide in Play Mode */}
        {!isPlaying && (
            <div className="absolute top-2 left-2 z-10 flex space-x-2">
                <div className="bg-[#1a1a1a]/80 backdrop-blur text-neutral-300 text-xs px-2 py-1 rounded flex items-center space-x-2 border border-neutral-700">
                    <span className="text-orange-500 font-bold">Perspective</span>
                    <span className="text-neutral-600">|</span>
                    <span>Lit</span>
                    <span className="text-neutral-600">|</span>
                    <span>Show</span>
                </div>
                <div className="bg-[#1a1a1a]/80 backdrop-blur text-neutral-300 text-xs px-2 py-1 rounded flex items-center space-x-2 border border-neutral-700">
                    <span>0.25</span>
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
                    <span className="w-[1px] h-3 bg-neutral-600"></span>
                    <span>4</span>
                </div>
            </div>
        )}

        {/* Play Mode Overlay Text */}
        {isPlaying && (
             <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
                 <span className="bg-black/50 text-white px-3 py-1 rounded text-xs backdrop-blur">PLAYING</span>
             </div>
        )}

      <svg 
        ref={svgRef}
        className="w-full h-full"
        viewBox={`${vbX} ${vbY} ${viewWidth} ${viewHeight}`}
        preserveAspectRatio="xMidYMid slice"
        onMouseDown={handleBgClick}
      >
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#222" strokeWidth="1"/>
          </pattern>
          <pattern id="wood" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0 0h10v10h-10z" fill="#854d0e"/>
              <path d="M0 2h10M0 5h10M0 8h10" stroke="#713f12" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
        </defs>

        <rect x={vbX} y={vbY} width={viewWidth} height={viewHeight} fill="url(#grid)" />

        {/* Ground Plane Mock */}
        <path d="M0 400 L800 400 L1200 600 L-400 600 Z" fill="#151515" opacity="0.5" />

        {actors.map(actor => {
          // Z-axis simulation
          const zScale = 1 + (actor.transform.z / 500);
          const zShadowScale = 1 - (actor.transform.z / 1000);
          const zOffset = -actor.transform.z; 

          // Animation simulation: Bobbing if character moves
          let animY = 0;
          if (actor.type === ActorType.CHARACTER && isPlaying && actor.transform.z <= 0) {
             // Check if "moving" roughly (we don't pass velocity here, so just use a constant breathing idle)
             animY = Math.sin(animTime / 200) * 2; 
          }

          return (
            <g 
              key={actor.id}
              transform={`translate(${actor.transform.x}, ${actor.transform.y}) rotate(${actor.transform.rotation}) scale(${actor.transform.scale})`}
              onMouseDown={(e) => handleMouseDown(e, actor)}
              className={!isPlaying ? "cursor-pointer hover:opacity-90" : ""}
              style={{ transition: isPlaying ? 'none' : 'transform 0.1s linear' }} 
            >
              {/* Drop Shadow */}
              {actor.transform.z > 0 && (
                  <ellipse cx="0" cy="0" rx={20 * zShadowScale} ry={10 * zShadowScale} fill="black" opacity="0.3" filter="blur(4px)" />
              )}

              {/* Object Group */}
              <g transform={`translate(0, ${zOffset + animY}) scale(${zScale})`}>

                {/* Selection Outline - Only in edit mode */}
                {actor.selected && !isPlaying && (
                   <rect 
                     x="-25" y="-25" width="50" height="50" 
                     fill="none" 
                     stroke="#f97316" 
                     strokeWidth="2"
                     strokeDasharray="4"
                     className="animate-pulse"
                   />
                )}

                {/* --- RENDER LOGIC --- */}

                {actor.type === ActorType.CHARACTER && (
                  <g>
                      <circle cx="0" cy="0" r="18" fill={actor.color} stroke="#fff" strokeWidth="2" />
                      <path d="M0 -15 L5 -5 L-5 -5 Z" fill="#fff" transform="rotate(90)" /> 
                  </g>
                )}

                {actor.type === ActorType.DOOR && (
                  <g>
                     <circle cx="0" cy="0" r="3" fill="#444" />
                     <rect x="0" y="-5" width="60" height="10" fill="url(#wood)" stroke="#5c360b" strokeWidth="1" />
                     <circle cx="50" cy="0" r="2" fill="gold" />
                  </g>
                )}

                {actor.type === ActorType.STATIC_MESH && (
                   <rect x="-20" y="-20" width="40" height="40" fill={actor.color} stroke="#000" strokeWidth="1" />
                )}
                {actor.type === ActorType.PLAYER_START && (
                   <g opacity={isPlaying ? 0 : 1}>
                      <circle cx="0" cy="0" r="15" fill="none" stroke={actor.color} strokeWidth="2" />
                      <path d="M-5 -8 L10 0 L-5 8 Z" fill={actor.color} />
                   </g>
                )}
                {actor.type === ActorType.LIGHT && (
                   <g opacity={isPlaying ? 0.5 : 1}>
                      <circle cx="0" cy="0" r="10" fill={actor.color} filter="blur(2px)" />
                      <circle cx="0" cy="0" r="4" fill="#fff" />
                   </g>
                )}
                 {actor.type === ActorType.CAMERA && (
                   <path d="M-15 -10 L5 -10 L15 -15 L15 15 L5 10 L-15 10 Z" fill="#333" stroke={actor.color} strokeWidth="2" opacity={isPlaying ? 0 : 1} />
                )}
                {actor.type === ActorType.BLUEPRINT && (
                    <rect x="-15" y="-15" width="30" height="30" rx="5" fill="#2563eb" stroke="#fff" strokeWidth="1" />
                )}
                
                {/* Label if selected */}
                {actor.selected && !isPlaying && (
                   <text x="0" y="-40" textAnchor="middle" fill="#fff" fontSize="10" className="bg-black px-1" style={{textShadow: '0 1px 2px black'}}>{actor.name}</text>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
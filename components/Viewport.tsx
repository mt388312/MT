import React, { useRef, useState, useEffect } from 'react';
import { Actor, ActorType } from '../types';

interface ViewportProps {
  actors: Actor[];
  onSelect: (id: string | null) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
}

export const Viewport: React.FC<ViewportProps> = ({ actors, onSelect, onUpdatePosition }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggedActor, setDraggedActor] = useState<{ id: string, offsetX: number, offsetY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, actor: Actor) => {
    e.stopPropagation();
    onSelect(actor.id);
    setDraggedActor({
      id: actor.id,
      offsetX: e.clientX - actor.transform.x,
      offsetY: e.clientY - actor.transform.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedActor) {
      // Calculate new position relative to the initial offset
      const newX = e.clientX - draggedActor.offsetX;
      const newY = e.clientY - draggedActor.offsetY;
      onUpdatePosition(draggedActor.id, newX, newY);
    }
  };

  const handleMouseUp = () => {
    setDraggedActor(null);
  };

  // Click on background deselects
  const handleBgClick = () => {
    onSelect(null);
  };

  return (
    <div 
      className="flex-1 bg-[#0f0f0f] relative overflow-hidden select-none cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
        {/* Top Viewport Toolbar */}
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

        {/* Compass / Orientation Gizmo Mock */}
        <div className="absolute bottom-4 left-4 z-10 opacity-70 pointer-events-none">
             <div className="relative w-12 h-12">
                 <div className="absolute bottom-0 left-0 w-[1px] h-10 bg-blue-500 origin-bottom"></div>
                 <div className="absolute bottom-0 left-0 w-10 h-[1px] bg-red-500 origin-left"></div>
                 <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-green-500 origin-left rotate-[-45deg]"></div>
                 <span className="absolute -top-1 left-1 text-[8px] text-blue-500">Z</span>
                 <span className="absolute bottom-1 -right-1 text-[8px] text-red-500">X</span>
                 <span className="absolute bottom-4 left-4 text-[8px] text-green-500">Y</span>
             </div>
        </div>

      <svg 
        ref={svgRef}
        className="w-full h-full"
        onMouseDown={handleBgClick}
      >
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#222" strokeWidth="1"/>
          </pattern>
          {/* Wood Texture Mock */}
          <pattern id="wood" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M0 0h10v10h-10z" fill="#854d0e"/>
              <path d="M0 2h10M0 5h10M0 8h10" stroke="#713f12" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Ground Plane Mock */}
        <path d="M0 400 L800 400 L1200 600 L-400 600 Z" fill="#151515" opacity="0.5" />

        {actors.map(actor => {
          // Z-axis simulation via scaling up and shifting Y slightly or applying a transform
          // For a top-down/iso hybrid feel, we'll just scale slightly based on Z
          const zScale = 1 + (actor.transform.z / 500);
          const zShadowScale = 1 - (actor.transform.z / 1000);
          const zOffset = -actor.transform.z; 

          return (
            <g 
              key={actor.id}
              transform={`translate(${actor.transform.x}, ${actor.transform.y}) rotate(${actor.transform.rotation}) scale(${actor.transform.scale})`}
              onMouseDown={(e) => handleMouseDown(e, actor)}
              className="cursor-pointer hover:opacity-90"
              style={{ transition: 'transform 0.1s linear' }} // Smooth update for game loop
            >
              {/* Drop Shadow (scales down as object goes up) */}
              {actor.transform.z > 0 && (
                  <ellipse cx="0" cy="0" rx={20 * zShadowScale} ry={10 * zShadowScale} fill="black" opacity="0.3" filter="blur(4px)" />
              )}

              {/* Object Group - Shifted by Z */}
              <g transform={`translate(0, ${zOffset}) scale(${zScale})`}>

                {/* Selection Outline */}
                {actor.selected && (
                   <rect 
                     x="-25" y="-25" width="50" height="50" 
                     fill="none" 
                     stroke="#f97316" 
                     strokeWidth="2"
                     strokeDasharray="4"
                     className="animate-pulse"
                   />
                )}

                {/* --- RENDER LOGIC BASED ON TYPE --- */}

                {actor.type === ActorType.CHARACTER && (
                  <g>
                      {/* Collision Capsule */}
                      <circle cx="0" cy="0" r="18" fill={actor.color} stroke="#fff" strokeWidth="2" />
                      {/* Facing Arrow */}
                      <path d="M0 -15 L5 -5 L-5 -5 Z" fill="#fff" transform="rotate(90)" /> 
                  </g>
                )}

                {actor.type === ActorType.DOOR && (
                  // Hinge is at (0,0) conceptually for rotation logic, but usually doors pivot at corner.
                  // The game logic rotates the whole actor. 
                  // If we want the door to swing from a jamb, we draw the rect offset from the center.
                  // Let's assume actor x,y is the hinge point.
                  <g>
                     {/* Door Frame/Jamb */}
                     <circle cx="0" cy="0" r="3" fill="#444" />
                     {/* Door Leaf - 60 units wide */}
                     <rect x="0" y="-5" width="60" height="10" fill="url(#wood)" stroke="#5c360b" strokeWidth="1" />
                     {/* Handle */}
                     <circle cx="50" cy="0" r="2" fill="gold" />
                  </g>
                )}

                {actor.type === ActorType.STATIC_MESH && (
                   <rect x="-20" y="-20" width="40" height="40" fill={actor.color} stroke="#000" strokeWidth="1" />
                )}
                {actor.type === ActorType.PLAYER_START && (
                   <g>
                      <circle cx="0" cy="0" r="15" fill="none" stroke={actor.color} strokeWidth="2" />
                      <path d="M-5 -8 L10 0 L-5 8 Z" fill={actor.color} />
                   </g>
                )}
                {actor.type === ActorType.LIGHT && (
                   <g>
                      <circle cx="0" cy="0" r="10" fill={actor.color} filter="blur(2px)" />
                      <circle cx="0" cy="0" r="4" fill="#fff" />
                      <line x1="0" y1="-15" x2="0" y2="15" stroke={actor.color} strokeWidth="1" />
                      <line x1="-15" y1="0" x2="15" y2="0" stroke={actor.color} strokeWidth="1" />
                   </g>
                )}
                 {actor.type === ActorType.CAMERA && (
                   <path d="M-15 -10 L5 -10 L15 -15 L15 15 L5 10 L-15 10 Z" fill="#333" stroke={actor.color} strokeWidth="2" />
                )}
                {actor.type === ActorType.BLUEPRINT && (
                    <rect x="-15" y="-15" width="30" height="30" rx="5" fill="#2563eb" stroke="#fff" strokeWidth="1" />
                )}
                
                {/* Label if selected */}
                {actor.selected && (
                   <text x="0" y="-40" textAnchor="middle" fill="#fff" fontSize="10" className="bg-black px-1" style={{textShadow: '0 1px 2px black'}}>{actor.name}</text>
                )}
              </g>
            </g>
          );
        })}
      </svg>

      {/* Stats Overlay */}
      <div className="absolute top-2 right-2 text-[10px] text-green-500 font-mono text-right pointer-events-none">
        <div>FPS: 60.0</div>
        <div>MS: 16.6 ms</div>
        <div>Objs: {actors.length}</div>
        <div>VRAM: 4096 MB</div>
      </div>
    </div>
  );
};
import React from 'react';
import { ProjectTemplate } from '../types';

interface ProjectHubProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  onOpenProject: () => void;
}

const TEMPLATES = [
  {
    id: ProjectTemplate.GAME,
    name: 'Third Person Game',
    description: 'A standard game setup with a character controller and interactive elements.',
    icon: '🎮',
    color: 'bg-blue-600'
  },
  {
    id: ProjectTemplate.ANIMATION,
    name: 'Cinematic Animation',
    description: 'Setup for linear storytelling and sequence rendering.',
    icon: '🎬',
    color: 'bg-purple-600'
  },
  {
    id: ProjectTemplate.VIDEO,
    name: 'Video Production',
    description: 'Virtual production tools and camera rigs.',
    icon: '🎥',
    color: 'bg-red-600'
  },
  {
    id: ProjectTemplate.PROGRAM,
    name: 'Code Project',
    description: 'Empty scene optimized for scripting and logic development.',
    icon: '💻',
    color: 'bg-green-600'
  },
  {
    id: ProjectTemplate.BLANK,
    name: 'Blank',
    description: 'Start from scratch.',
    icon: '📄',
    color: 'bg-neutral-600'
  }
];

export const ProjectHub: React.FC<ProjectHubProps> = ({ onSelectTemplate, onOpenProject }) => {
  return (
    <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col text-neutral-200 font-sans">
      <div className="p-8 border-b border-neutral-800 flex items-center space-x-4">
         <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-600 font-bold text-orange-500 text-xl">
            U
         </div>
         <h1 className="text-2xl font-light tracking-wide">WebUnreal <span className="font-bold">Project Browser</span></h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#1a1a1a] border-r border-neutral-800 p-4 space-y-2">
            <button 
                onClick={onOpenProject}
                className="w-full bg-[#333] hover:bg-[#444] text-white p-3 rounded mb-6 flex items-center justify-center font-bold border border-neutral-600 transition-colors"
            >
                <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                Open Project...
            </button>

            <div className="font-bold text-neutral-500 uppercase text-xs mb-4">Recent Projects</div>
            <div className="p-2 bg-[#262626] rounded text-sm text-white cursor-pointer">MyProject_01</div>
            <div className="p-2 hover:bg-[#262626] rounded text-sm text-neutral-400 cursor-pointer">Alien_World_Test</div>
            <div className="p-2 hover:bg-[#262626] rounded text-sm text-neutral-400 cursor-pointer">Door_Logic_V2</div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-[#151515]">
             <h2 className="text-xl mb-6">Select a Template</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {TEMPLATES.map(t => (
                     <div 
                        key={t.id} 
                        onClick={() => onSelectTemplate(t.id)}
                        className="bg-[#262626] border border-neutral-700 hover:border-orange-500 rounded-lg overflow-hidden cursor-pointer group transition-all hover:scale-[1.02]"
                     >
                         <div className={`h-32 ${t.color} flex items-center justify-center text-6xl group-hover:brightness-110 transition-all`}>
                            {t.icon}
                         </div>
                         <div className="p-4">
                             <div className="font-bold text-white mb-1 group-hover:text-orange-500">{t.name}</div>
                             <div className="text-xs text-neutral-400 h-10">{t.description}</div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
      </div>
    </div>
  );
};
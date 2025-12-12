import React from 'react';
import { ProjectTemplate } from '../types';

interface ProjectHubProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  onOpenProject: () => void;
}

const Icons = {
  Game: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <path d="M6 11H10M8 9V13" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 12C15.5523 12 16 11.5523 16 11C16 10.4477 15.5523 10 15 10C14.4477 10 14 10.4477 14 11C14 11.5523 14.4477 12 15 12Z" fill="currentColor"/>
      <path d="M17 14C17.5523 14 18 13.5523 18 13C18 12.4477 17.5523 12 17 12C16.4477 12 16 12.4477 16 13C16 13.5523 16.4477 14 17 14Z" fill="currentColor"/>
      <rect x="2" y="6" width="20" height="12" rx="4" stroke="currentColor"/>
    </svg>
  ),
  Animation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <path d="M2 10L22 10" stroke="currentColor"/>
      <path d="M2 14L22 14" stroke="currentColor"/>
      <path d="M2 6L22 6" stroke="currentColor"/>
      <path d="M2 18L22 18" stroke="currentColor"/>
      <path d="M6 2V22" stroke="currentColor"/>
      <path d="M18 2V22" stroke="currentColor"/>
    </svg>
  ),
  Video: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <path d="M15 10L20 6V18L15 14V10Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="2" y="6" width="13" height="12" rx="2" stroke="currentColor"/>
    </svg>
  ),
  Program: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <path d="M16 18L22 12L16 6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6L2 12L8 18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Blank: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeLinejoin="round"/>
      <path d="M13 2V9H20" stroke="currentColor" strokeLinejoin="round"/>
    </svg>
  ),
};

const TEMPLATES = [
  {
    id: ProjectTemplate.GAME,
    name: 'Third Person Game',
    description: 'A standard game setup with a character controller and interactive elements.',
    icon: Icons.Game,
    color: 'bg-blue-600'
  },
  {
    id: ProjectTemplate.ANIMATION,
    name: 'Cinematic Animation',
    description: 'Setup for linear storytelling and sequence rendering.',
    icon: Icons.Animation,
    color: 'bg-purple-600'
  },
  {
    id: ProjectTemplate.VIDEO,
    name: 'Video Production',
    description: 'Virtual production tools and camera rigs.',
    icon: Icons.Video,
    color: 'bg-red-600'
  },
  {
    id: ProjectTemplate.PROGRAM,
    name: 'Code Project',
    description: 'Empty scene optimized for scripting and logic development.',
    icon: Icons.Program,
    color: 'bg-green-600'
  },
  {
    id: ProjectTemplate.BLANK,
    name: 'Blank',
    description: 'Start from scratch.',
    icon: Icons.Blank,
    color: 'bg-neutral-600'
  }
];

export const ProjectHub: React.FC<ProjectHubProps> = ({ onSelectTemplate, onOpenProject }) => {
  return (
    <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col text-neutral-200 font-sans">
      <div className="p-8 border-b border-neutral-800 flex items-center space-x-4">
         <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-600 font-bold text-orange-500 text-xl overflow-hidden">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 2L2 22H22L12 2Z" />
            </svg>
         </div>
         <h1 className="text-2xl font-light tracking-wide">WebUnreal <span className="font-bold">Project Browser</span></h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#1a1a1a] border-r border-neutral-800 p-4 space-y-2">
            <button 
                onClick={onOpenProject}
                className="w-full bg-[#333] hover:bg-[#444] text-white p-3 rounded mb-6 flex items-center justify-center font-bold border border-neutral-600 transition-colors group"
            >
                <svg className="w-5 h-5 mr-2 fill-neutral-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
                Open Project...
            </button>

            <div className="font-bold text-neutral-500 uppercase text-xs mb-4">Recent Projects</div>
            <div className="p-2 bg-[#262626] rounded text-sm text-white cursor-pointer border-l-2 border-orange-500 pl-3">MyProject_01</div>
            <div className="p-2 hover:bg-[#262626] rounded text-sm text-neutral-400 cursor-pointer pl-3">Alien_World_Test</div>
            <div className="p-2 hover:bg-[#262626] rounded text-sm text-neutral-400 cursor-pointer pl-3">Door_Logic_V2</div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-[#151515]">
             <h2 className="text-xl mb-6 font-light">Select a Template</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {TEMPLATES.map(t => (
                     <div 
                        key={t.id} 
                        onClick={() => onSelectTemplate(t.id)}
                        className="bg-[#1e1e1e] border border-neutral-800 hover:border-orange-500 rounded-lg overflow-hidden cursor-pointer group transition-all hover:scale-[1.02] shadow-lg hover:shadow-orange-900/20"
                     >
                         <div className={`h-32 ${t.color} flex items-center justify-center text-white/90 group-hover:text-white transition-all relative overflow-hidden`}>
                            {/* Stylized background pattern */}
                            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                            {t.icon}
                         </div>
                         <div className="p-4 bg-[#262626]">
                             <div className="font-bold text-white mb-2 group-hover:text-orange-500 text-lg">{t.name}</div>
                             <div className="text-xs text-neutral-400 h-8 leading-relaxed">{t.description}</div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { MOCK_ASSETS } from '../constants';

export const ContentBrowser: React.FC = () => {
  return (
    <div className="h-full bg-[#1a1a1a] text-neutral-300 text-xs flex flex-col">
       <div className="p-1.5 bg-[#262626] font-bold border-b border-black flex justify-between items-center">
        <div className="flex space-x-1">
            <button className="bg-[#449f44] text-white px-3 py-1 rounded shadow-sm hover:bg-[#5bb85b] font-medium border border-green-800 text-[11px] flex items-center">
                <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add
            </button>
            <button className="bg-[#2a2a2a] px-3 py-1 rounded border border-neutral-600 hover:border-neutral-500 text-[11px] hover:bg-[#333]">Import</button>
            <button className="bg-[#2a2a2a] px-3 py-1 rounded border border-neutral-600 hover:border-neutral-500 text-[11px] hover:bg-[#333]">Save All</button>
        </div>
        <div className="flex space-x-2 text-neutral-500 pr-2">
             <svg className="w-4 h-4 cursor-pointer hover:text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
         {/* Folder Tree */}
         <div className="w-56 bg-[#161616] border-r border-black p-2 overflow-y-auto">
            <div className="text-[10px] font-bold text-neutral-500 mb-2 uppercase tracking-wide pl-2">Path</div>
            <FolderItem name="Content" isOpen={true} color="text-neutral-300">
                <FolderItem name="StarterContent" isOpen={false} color="text-yellow-600" />
                <FolderItem name="FirstPersonBP" isOpen={true} color="text-blue-500">
                     <FolderItem name="Blueprints" color="text-blue-400" />
                     <FolderItem name="Maps" selected color="text-orange-500" />
                </FolderItem>
                <FolderItem name="Geometry" color="text-green-500" />
                <FolderItem name="Mannequin" color="text-purple-500" />
            </FolderItem>
         </div>

         {/* Asset Grid */}
         <div className="flex-1 p-3 bg-[#1e1e1e] overflow-y-auto shadow-inner">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-4">
                {MOCK_ASSETS.map((asset, i) => (
                    <div key={i} className="group flex flex-col items-center cursor-pointer hover:bg-[#333] p-2 rounded transition-colors border border-transparent hover:border-neutral-600">
                        <div className={`w-16 h-16 mb-2 rounded shadow-lg flex items-center justify-center text-[10px] font-bold border-b-4 relative overflow-hidden
                           ${asset.type === 'Blueprint' ? 'bg-[#1a2e4d] border-blue-500 text-blue-200' : 
                             asset.type === 'Material' ? 'bg-[#1a3d2e] border-green-500 text-green-200' :
                             asset.type === 'Texture' ? 'bg-[#3d1a1a] border-red-500 text-red-200' :
                             'bg-neutral-700 border-neutral-400 text-neutral-300'}
                        `}>
                             {/* Gloss effect */}
                             <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
                             {asset.type === 'Blueprint' ? 'BP' : asset.type === 'Material' ? 'MT' : 'SM'}
                        </div>
                        <span className="text-[10px] text-neutral-400 group-hover:text-white truncate w-full text-center px-1 font-medium">{asset.name}</span>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const FolderItem = ({ name, isOpen, children, selected, color }: { name: string, isOpen?: boolean, children?: React.ReactNode, selected?: boolean, color?: string }) => (
    <div className="ml-3 select-none">
        <div className={`flex items-center space-x-1 cursor-pointer py-1 px-1.5 rounded-sm hover:bg-[#333] transition-colors ${selected ? 'bg-[#333] text-white' : 'text-neutral-400'}`}>
            <svg className={`w-3 h-3 fill-current transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${!children ? 'invisible' : ''}`} viewBox="0 0 24 24"><path d="M10 17l5-5-5-5v10z"/></svg>
            <svg className={`w-4 h-4 fill-current ${color || 'text-yellow-600'}`} viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
            <span className={`text-[11px] ${selected ? 'font-bold' : ''}`}>{name}</span>
        </div>
        {isOpen && children && (
            <div className="border-l border-neutral-700 ml-2 pl-0.5">
                {children}
            </div>
        )}
    </div>
);
import React from 'react';
import { MOCK_ASSETS } from '../constants';

export const ContentBrowser: React.FC = () => {
  return (
    <div className="h-full bg-[#1a1a1a] text-neutral-300 text-xs flex flex-col">
       <div className="p-2 bg-[#262626] font-bold border-b border-neutral-700 flex justify-between items-center">
        <div className="flex space-x-2">
            <button className="bg-[#151515] px-2 py-0.5 rounded border border-neutral-600 hover:border-neutral-400">Add</button>
            <button className="bg-[#151515] px-2 py-0.5 rounded border border-neutral-600 hover:border-neutral-400">Import</button>
            <button className="bg-[#151515] px-2 py-0.5 rounded border border-neutral-600 hover:border-neutral-400">Save All</button>
        </div>
        <div className="flex space-x-2 text-neutral-500">
             <span>Settings</span>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
         {/* Folder Tree */}
         <div className="w-48 bg-[#111] border-r border-neutral-800 p-2 overflow-y-auto">
            <FolderItem name="Content" isOpen={true}>
                <FolderItem name="StarterContent" isOpen={false} />
                <FolderItem name="FirstPersonBP" isOpen={true}>
                     <FolderItem name="Blueprints" />
                     <FolderItem name="Maps" selected />
                </FolderItem>
                <FolderItem name="Geometry" />
                <FolderItem name="Mannequin" />
            </FolderItem>
         </div>

         {/* Asset Grid */}
         <div className="flex-1 p-2 bg-[#151515] overflow-y-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
                {MOCK_ASSETS.map((asset, i) => (
                    <div key={i} className="group flex flex-col items-center cursor-pointer hover:bg-[#262626] p-2 rounded">
                        <div className={`w-14 h-14 mb-1 rounded flex items-center justify-center text-[10px] font-bold border-b-2
                           ${asset.type === 'Blueprint' ? 'bg-blue-900/50 border-blue-500 text-blue-200' : 
                             asset.type === 'Material' ? 'bg-green-900/50 border-green-500 text-green-200' :
                             asset.type === 'Texture' ? 'bg-red-900/50 border-red-500 text-red-200' :
                             'bg-neutral-700 border-neutral-400 text-neutral-300'}
                        `}>
                             {asset.type === 'Blueprint' ? 'BP' : asset.type === 'Material' ? 'MT' : 'SM'}
                        </div>
                        <span className="text-[10px] text-neutral-400 group-hover:text-white truncate w-full text-center bg-black/20 rounded px-1">{asset.name}</span>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const FolderItem = ({ name, isOpen, children, selected }: { name: string, isOpen?: boolean, children?: React.ReactNode, selected?: boolean }) => (
    <div className="ml-2">
        <div className={`flex items-center space-x-1 cursor-pointer py-0.5 px-1 rounded hover:bg-[#262626] ${selected ? 'bg-[#333] text-orange-500 font-bold' : 'text-neutral-400'}`}>
            <svg className={`w-3 h-3 fill-current transition-transform ${isOpen ? 'rotate-90' : ''} ${!children ? 'invisible' : ''}`} viewBox="0 0 24 24"><path d="M10 17l5-5-5-5v10z"/></svg>
            <svg className="w-3 h-3 fill-current text-yellow-600" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
            <span>{name}</span>
        </div>
        {isOpen && children && (
            <div className="border-l border-neutral-800 ml-1.5">
                {children}
            </div>
        )}
    </div>
);
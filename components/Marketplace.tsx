import React from 'react';
import { ExtensionPack } from '../types';

interface MarketplaceProps {
  packs: ExtensionPack[];
  onInstall: (packId: string) => void;
  onClose: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ packs, onInstall, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#121212] z-[100] flex flex-col font-sans">
      <div className="bg-[#1a1a1a] p-6 border-b border-black flex justify-between items-center shadow-lg">
         <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-purple-600 flex items-center justify-center font-bold text-white text-xl">M</div>
            <h1 className="text-2xl text-white font-light">Unreal <span className="font-bold">Marketplace</span></h1>
         </div>
         <button onClick={onClose} className="text-neutral-400 hover:text-white text-3xl">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-[#151515]">
          <h2 className="text-xl text-white mb-6">Featured Extension Packs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {packs.map(pack => (
                  <div key={pack.id} className="bg-[#1e1e1e] border border-neutral-800 rounded-lg overflow-hidden group hover:border-orange-500 transition-all flex flex-col h-full shadow-lg">
                      <div className="h-40 bg-[#262626] flex items-center justify-center text-neutral-500 group-hover:text-white transition-colors text-6xl relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          {pack.icon}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                             <h3 className="text-lg font-bold text-white leading-tight">{pack.name}</h3>
                             <span className="text-xs font-bold bg-neutral-700 text-white px-2 py-1 rounded">{pack.price}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mb-4 flex-1">{pack.description}</p>
                          <div className="space-y-1 mb-4">
                              {pack.features.map((feat, i) => (
                                  <div key={i} className="flex items-center text-[10px] text-neutral-300">
                                      <svg className="w-3 h-3 text-green-500 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                      {feat}
                                  </div>
                              ))}
                          </div>
                          <button 
                             onClick={() => !pack.installed && onInstall(pack.id)}
                             disabled={pack.installed}
                             className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wide transition-all ${
                                 pack.installed 
                                 ? 'bg-neutral-700 text-neutral-400 cursor-default' 
                                 : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg shadow-blue-900/20'
                             }`}
                          >
                             {pack.installed ? 'Installed' : 'Download & Install'}
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
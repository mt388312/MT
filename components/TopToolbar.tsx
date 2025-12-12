import React from 'react';

interface TopToolbarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onDownload: () => void;
  onOpen: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ isPlaying, onTogglePlay, onDownload, onOpen }) => {
  return (
    <div className="h-10 bg-[#151515] border-b border-neutral-700 flex items-center px-4 justify-between select-none">
      <div className="flex items-center space-x-6 text-xs font-medium text-neutral-400">
        <div className="flex items-center space-x-2 text-white">
          <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-600 font-bold text-orange-500">
            U
          </div>
          <span className="font-bold text-neutral-200">WebUnreal 5</span>
        </div>
        
        <div className="flex space-x-4">
          <button className="hover:text-white transition-colors" onClick={onOpen}>File</button>
          <button className="hover:text-white transition-colors">Edit</button>
          <button className="hover:text-white transition-colors">Window</button>
          <button className="hover:text-white transition-colors">Tools</button>
          <button className="hover:text-white transition-colors">Build</button>
          <button className="hover:text-white transition-colors">Select</button>
          <button className="hover:text-white transition-colors">Actor</button>
          <button className="hover:text-white transition-colors">Help</button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
         <span className="text-[10px] text-neutral-500 uppercase tracking-widest hidden md:block">Level: Main_Map</span>
         <div className="h-6 w-[1px] bg-neutral-700 mx-2 hidden md:block"></div>
         
         <button 
           onClick={onOpen}
           className="bg-[#262626] hover:bg-[#333] text-neutral-300 p-1 px-3 rounded text-xs flex items-center border border-neutral-700 mr-2"
           title="Open Project"
         >
            <svg className="w-3 h-3 mr-2 fill-current" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
            Open
         </button>

         <button 
           onClick={onDownload}
           className="bg-[#262626] hover:bg-[#333] text-blue-400 p-1 px-3 rounded text-xs flex items-center border border-neutral-700 mr-2"
           title="Download Project"
         >
            <svg className="w-3 h-3 mr-2 fill-current" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Save
         </button>

         <button 
           onClick={onTogglePlay}
           className={`${isPlaying ? 'bg-red-900/50 text-red-400 border-red-800' : 'bg-[#262626] text-green-500 border-neutral-700'} hover:brightness-110 p-1 px-3 rounded text-xs flex items-center border transition-all`}
         >
            {isPlaying ? (
                <>
                  <svg className="w-3 h-3 mr-2 fill-current" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                  Stop
                </>
            ) : (
                <>
                  <svg className="w-3 h-3 mr-2 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Play
                </>
            )}
         </button>
      </div>
    </div>
  );
};
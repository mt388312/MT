import React from 'react';

export const TopToolbar: React.FC = () => {
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
          <button className="hover:text-white transition-colors">File</button>
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
         <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Level: Main_Map</span>
         <div className="h-6 w-[1px] bg-neutral-700 mx-2"></div>
         <button className="bg-[#262626] hover:bg-[#333] text-green-500 p-1 px-3 rounded text-xs flex items-center border border-neutral-700">
            <svg className="w-3 h-3 mr-2 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Play
         </button>
      </div>
    </div>
  );
};
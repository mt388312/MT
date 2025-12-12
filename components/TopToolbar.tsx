import React from 'react';

interface TopToolbarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onDownload: () => void;
  onOpen: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ isPlaying, onTogglePlay, onDownload, onOpen }) => {
  return (
    <div className="h-12 bg-[#1a1a1a] border-b border-black flex items-center px-4 justify-between select-none shadow-md relative z-50">
      <div className="flex items-center space-x-6 text-xs font-medium text-neutral-400">
        <div className="flex items-center space-x-3 text-white">
          <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center border border-neutral-700 shadow-inner group">
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-200 group-hover:text-orange-500 transition-colors">
                <path d="M12 2L2 22H22L12 2Z" />
             </svg>
          </div>
          <span className="font-bold text-neutral-200 tracking-wide text-sm">WebUnreal 5</span>
        </div>
        
        <div className="flex space-x-1">
          {['File', 'Edit', 'Window', 'Tools', 'Build', 'Select', 'Actor', 'Help'].map(menu => (
              <button key={menu} className="hover:bg-[#333] hover:text-white px-3 py-1.5 rounded transition-colors">{menu}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
         <span className="text-[10px] text-neutral-500 uppercase tracking-widest hidden md:block bg-[#111] px-2 py-1 rounded border border-neutral-800">Map: Main_Level</span>
         <div className="h-6 w-[1px] bg-neutral-700 mx-2 hidden md:block"></div>
         
         {/* Toolbar Icons Group */}
         <div className="flex space-x-1 bg-[#111] p-1 rounded border border-neutral-800">
             <button 
               onClick={onDownload}
               className="p-1.5 rounded hover:bg-[#333] text-neutral-400 hover:text-white transition-colors tooltip-btn"
               title="Save Current Level"
             >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z"/>
                </svg>
             </button>
             <button 
               onClick={onOpen}
               className="p-1.5 rounded hover:bg-[#333] text-neutral-400 hover:text-white transition-colors"
               title="Open Project"
             >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V8H20V18Z"/>
                </svg>
             </button>
         </div>

         <div className="h-6 w-[1px] bg-neutral-700 mx-2 hidden md:block"></div>

         <button 
           onClick={onTogglePlay}
           className={`${isPlaying ? 'bg-[#3d1212] text-red-500 border-red-900 hover:bg-[#521616]' : 'bg-[#153e15] text-green-400 border-green-900 hover:bg-[#1b4d1b]'} px-4 py-1.5 rounded flex items-center border transition-all shadow-sm`}
         >
            {isPlaying ? (
                <>
                  <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
                  <span className="font-bold text-xs uppercase tracking-wider">Stop</span>
                </>
            ) : (
                <>
                  <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24"><path d="M8 5V19L19 12L8 5Z"/></svg>
                  <span className="font-bold text-xs uppercase tracking-wider">Play</span>
                </>
            )}
         </button>
      </div>
    </div>
  );
};
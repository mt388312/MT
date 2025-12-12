import React, { useState, useEffect } from 'react';
import { FileSystemItem, FileType, ClipboardItem } from '../types';

interface ContentBrowserProps {
  installedPacks: string[];
  onOpenMarketplace: () => void;
  onOpenFile: (file: FileSystemItem) => void;
  items: FileSystemItem[];
  setItems: React.Dispatch<React.SetStateAction<FileSystemItem[]>>;
}

export const ContentBrowser: React.FC<ContentBrowserProps> = ({ installedPacks, onOpenMarketplace, onOpenFile, items, setItems }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, targetId: string | null} | null>(null);

  // Helper to get children
  const getChildren = (parentId: string) => items.filter(i => i.parentId === parentId);

  // Breadcrumbs
  const getBreadcrumbs = () => {
      const path = [];
      let current = items.find(i => i.id === currentFolderId);
      while (current) {
          path.unshift(current);
          current = items.find(i => i.id === current?.parentId);
      }
      return path;
  };

  const handleCreate = (type: FileType) => {
    // Check Permissions
    if (type === 'cpp' && !installedPacks.includes('cpp')) return alert("Requires C++ Expansion Pack");
    if (type === 'python' && !installedPacks.includes('python')) return alert("Requires Python Scripting Pack");
    if (type === 'material' && !installedPacks.includes('materials')) return alert("Requires Material Lab Pack");

    const newId = Math.random().toString(36).substr(2, 9);
    const newItem: FileSystemItem = {
        id: newId,
        parentId: currentFolderId,
        name: `New${type === 'folder' ? 'Folder' : type.charAt(0).toUpperCase() + type.slice(1)}`,
        type: type,
        content: type === 'text' || type === 'cpp' || type === 'python' ? '// New File' : undefined
    };
    setItems([...items, newItem]);
    setRenamingId(newId);
    setRenameValue(newItem.name);
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    
    // Recursive delete function
    const getDescendants = (ids: string[]): string[] => {
        const children = items.filter(i => i.parentId && ids.includes(i.parentId)).map(i => i.id);
        if (children.length === 0) return ids;
        return [...ids, ...getDescendants(children)];
    };

    const idsToDelete = getDescendants(Array.from(selectedIds));
    setItems(items.filter(i => !idsToDelete.includes(i.id)));
    setSelectedIds(new Set());
    setContextMenu(null);
  };

  const handleCopy = (cut: boolean = false) => {
    if (selectedIds.size !== 1) return; // Simple copy for single item for now
    const id = Array.from(selectedIds)[0];
    const item = items.find(i => i.id === id);
    if (item) {
        setClipboard({ action: cut ? 'cut' : 'copy', item });
    }
    setContextMenu(null);
  };

  const handlePaste = () => {
      if (!clipboard) return;
      
      if (clipboard.action === 'cut') {
          // Move
          setItems(items.map(i => i.id === clipboard.item.id ? { ...i, parentId: currentFolderId } : i));
          setClipboard(null);
      } else {
          // Copy (Clone)
          const newId = Math.random().toString(36).substr(2, 9);
          const newItem = { ...clipboard.item, id: newId, parentId: currentFolderId, name: `${clipboard.item.name}_Copy` };
          setItems([...items, newItem]);
      }
      setContextMenu(null);
  };

  const handleRename = () => {
     if (renamingId && renameValue.trim()) {
         setItems(items.map(i => i.id === renamingId ? { ...i, name: renameValue } : i));
         setRenamingId(null);
     }
  };

  const onDoubleClick = (item: FileSystemItem) => {
      if (item.type === 'folder') {
          setCurrentFolderId(item.id);
          setSelectedIds(new Set());
      } else {
          // Attempt to open file
          if ((item.type === 'cpp' || item.type === 'python' || item.type === 'javascript') && !installedPacks.includes('editor')) {
             alert("Requires Advanced Code Editor Pack to edit source files.");
             return;
          }
          onOpenFile(item);
      }
  };

  return (
    <div className="h-full bg-[#1a1a1a] text-neutral-300 text-xs flex flex-col relative"
         onClick={() => { setContextMenu(null); if(renamingId) handleRename(); }}>
       
       {/* Toolbar */}
       <div className="p-1.5 bg-[#262626] font-bold border-b border-black flex justify-between items-center">
        <div className="flex space-x-1">
            <button onClick={() => handleCreate('folder')} className="bg-[#449f44] text-white px-3 py-1 rounded shadow-sm hover:bg-[#5bb85b] font-medium border border-green-800 text-[11px] flex items-center">
                <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add
            </button>
            <button onClick={onOpenMarketplace} className="bg-gradient-to-r from-purple-700 to-blue-600 text-white px-3 py-1 rounded border border-purple-500 hover:brightness-110 text-[11px] flex items-center shadow-lg">
                <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h-2v-2h2v2zm2.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H9c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                Marketplace
            </button>
        </div>
        
        {/* Breadcrumbs */}
        <div className="flex space-x-1 text-neutral-500 px-4">
             <span onClick={() => setCurrentFolderId('root')} className="cursor-pointer hover:text-white">All</span>
             {getBreadcrumbs().map(b => (
                 <React.Fragment key={b.id}>
                    <span>/</span>
                    <span onClick={() => setCurrentFolderId(b.id)} className="cursor-pointer hover:text-white">{b.name}</span>
                 </React.Fragment>
             ))}
        </div>
      </div>
      
      {/* Grid Area */}
      <div className="flex-1 p-3 bg-[#1e1e1e] overflow-y-auto shadow-inner relative"
           onContextMenu={(e) => {
               e.preventDefault();
               setContextMenu({ x: e.clientX, y: e.clientY, targetId: null }); // Background click
           }}>
         
         {getChildren(currentFolderId).length === 0 && (
             <div className="w-full h-full flex items-center justify-center text-neutral-600 italic">
                 Empty Folder. Right-click to create content.
             </div>
         )}

         <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-4">
            {getChildren(currentFolderId).map(item => (
                <div key={item.id} 
                     className={`group flex flex-col items-center cursor-pointer p-2 rounded transition-colors border ${selectedIds.has(item.id) ? 'bg-[#333] border-orange-500' : 'border-transparent hover:bg-[#2a2a2a]'}`}
                     onClick={(e) => { e.stopPropagation(); setSelectedIds(new Set([item.id])); }}
                     onDoubleClick={() => onDoubleClick(item)}
                     onContextMenu={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         setSelectedIds(new Set([item.id]));
                         setContextMenu({ x: e.clientX, y: e.clientY, targetId: item.id });
                     }}
                >
                    <div className={`w-16 h-16 mb-2 rounded shadow-lg flex items-center justify-center text-[10px] font-bold border-b-4 relative overflow-hidden
                       ${item.type === 'folder' ? 'bg-[#1a1a1a] border-neutral-600 text-neutral-400' : 
                         item.type === 'blueprint' ? 'bg-[#1a2e4d] border-blue-500 text-blue-200' : 
                         item.type === 'material' ? 'bg-[#1a3d2e] border-green-500 text-green-200' :
                         item.type === 'cpp' ? 'bg-[#201a4d] border-blue-700 text-blue-100' :
                         item.type === 'python' ? 'bg-[#4d3d1a] border-yellow-600 text-yellow-100' :
                         'bg-neutral-700 border-neutral-400 text-neutral-300'}
                    `}>
                         <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
                         {item.type === 'folder' ? (
                             <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                         ) : item.type.toUpperCase().substring(0, 2)}
                    </div>
                    {renamingId === item.id ? (
                        <input 
                            autoFocus 
                            className="bg-black text-white text-[10px] w-full text-center px-1"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                            onClick={(e) => e.stopPropagation()}
                            onBlur={handleRename}
                        />
                    ) : (
                        <span className="text-[10px] text-neutral-400 group-hover:text-white truncate w-full text-center px-1 font-medium select-none">{item.name}</span>
                    )}
                </div>
            ))}
         </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
          <div className="fixed bg-[#2a2a2a] border border-neutral-900 shadow-2xl rounded py-1 z-50 min-w-[150px]" style={{ left: contextMenu.x, top: contextMenu.y }}>
              {contextMenu.targetId ? (
                  <>
                    <ContextMenuItem label="Open" onClick={() => onDoubleClick(items.find(i => i.id === contextMenu.targetId)!)} />
                    <ContextMenuItem label="Edit Code" onClick={() => {}} disabled={!['cpp','python','javascript'].includes(items.find(i => i.id === contextMenu.targetId)?.type || '')} />
                    <div className="h-[1px] bg-neutral-700 my-1" />
                    <ContextMenuItem label="Rename" onClick={() => {
                        const item = items.find(i => i.id === contextMenu.targetId);
                        if(item) { setRenamingId(item.id); setRenameValue(item.name); setContextMenu(null); }
                    }} />
                    <ContextMenuItem label="Copy" onClick={() => handleCopy()} />
                    <ContextMenuItem label="Cut" onClick={() => handleCopy(true)} />
                    <ContextMenuItem label="Delete" onClick={handleDelete} isDestructive />
                  </>
              ) : (
                  <>
                    <ContextMenuItem label="New Folder" onClick={() => handleCreate('folder')} />
                    <div className="h-[1px] bg-neutral-700 my-1" />
                    <ContextMenuItem label="New Blueprint" onClick={() => handleCreate('blueprint')} />
                    <ContextMenuItem label="New C++ Class" onClick={() => handleCreate('cpp')} />
                    <ContextMenuItem label="New Python Script" onClick={() => handleCreate('python')} />
                    <ContextMenuItem label="New Material" onClick={() => handleCreate('material')} />
                    <div className="h-[1px] bg-neutral-700 my-1" />
                    <ContextMenuItem label="Paste" onClick={handlePaste} disabled={!clipboard} />
                  </>
              )}
          </div>
      )}
    </div>
  );
};

const ContextMenuItem = ({ label, onClick, disabled, isDestructive }: { label: string, onClick: () => void, disabled?: boolean, isDestructive?: boolean }) => (
    <div 
        onClick={(e) => { e.stopPropagation(); !disabled && onClick(); }}
        className={`px-4 py-1.5 text-xs flex justify-between cursor-pointer ${disabled ? 'text-neutral-600 cursor-default' : isDestructive ? 'text-red-400 hover:bg-[#3d1212]' : 'text-neutral-300 hover:bg-blue-600 hover:text-white'}`}
    >
        {label}
    </div>
);
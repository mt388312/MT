import React, { useState, useEffect } from 'react';
import { FileSystemItem } from '../types';

interface CodeEditorProps {
  file: FileSystemItem;
  onSave: (id: string, content: string) => void;
  onClose: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, onSave, onClose }) => {
  const [content, setContent] = useState(file.content || '');

  useEffect(() => {
    setContent(file.content || '');
  }, [file]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
      <div className="bg-[#1e1e1e] w-full max-w-5xl h-[80vh] border border-neutral-700 shadow-2xl flex flex-col rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#262626] p-3 border-b border-black flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center text-blue-200 font-bold text-xs">
                    {file.type === 'cpp' ? 'C++' : file.type === 'python' ? 'PY' : 'JS'}
                </div>
                <div>
                    <div className="text-sm font-bold text-white">{file.name}</div>
                    <div className="text-[10px] text-neutral-400">Source Editor</div>
                </div>
            </div>
            <div className="flex space-x-2">
                <button onClick={() => onSave(file.id, content)} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-bold transition-colors">
                    Save & Compile
                </button>
                <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-1.5 rounded text-xs font-bold transition-colors">
                    Close
                </button>
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex relative">
            {/* Line Numbers */}
            <div className="w-10 bg-[#1a1a1a] border-r border-neutral-800 text-neutral-600 font-mono text-xs pt-4 text-right pr-2 select-none">
                {Array.from({length: 20}).map((_, i) => <div key={i}>{i+1}</div>)}
            </div>
            
            {/* TextArea */}
            <textarea 
                className="flex-1 bg-[#121212] text-neutral-300 font-mono text-sm p-4 focus:outline-none resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck={false}
            />
        </div>

        {/* Footer */}
        <div className="h-6 bg-[#007acc] text-white text-[10px] flex items-center px-4 justify-between">
            <span>Ready</span>
            <span>Ln {content.split('\n').length}, Col 1</span>
        </div>
      </div>
    </div>
  );
};
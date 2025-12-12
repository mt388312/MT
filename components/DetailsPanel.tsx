import React, { useState } from 'react';
import { Actor } from '../types';
import { generateActorScript } from '../services/geminiService';

interface DetailsPanelProps {
  actor: Actor | null;
  onUpdate: (actor: Actor) => void;
}

const LANGUAGES = [
    'C++', 'Blueprint', 'JavaScript', 'Python', 'C#', 'Lua', 'GLSL', 'HLSL', 'Swift', 'Go', 'Rust', 'Ruby', 'Java', 'PHP', 'TypeScript'
];

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ actor, onUpdate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!actor) {
    return (
      <div className="h-full bg-[#1a1a1a] text-neutral-500 text-xs flex items-center justify-center p-4 text-center">
        Select an object to view details
      </div>
    );
  }

  const handleChange = (field: string, value: any, nested?: string) => {
    if (nested) {
      onUpdate({
        ...actor,
        [field]: {
          ...(actor as any)[field],
          [nested]: value
        }
      });
    } else {
      onUpdate({ ...actor, [field]: value });
    }
  };

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    const lang = actor.scriptLanguage || 'C++';
    const script = await generateActorScript(actor.name, `Standard behavior for a ${actor.type} in a game.`, lang);
    onUpdate({ ...actor, script });
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-neutral-300 text-xs border-l border-neutral-800">
      <div className="p-2 bg-[#262626] font-bold border-b border-neutral-700">
        Details
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        
        {/* Header Name */}
        <div className="flex items-center space-x-2 pb-2 border-b border-neutral-800">
           <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center border border-neutral-700">
             <span className="text-orange-500 font-bold text-lg">{actor.name[0]}</span>
           </div>
           <input 
             className="bg-transparent text-sm font-bold focus:outline-none focus:bg-[#262626] p-1 rounded w-full"
             value={actor.name}
             onChange={(e) => handleChange('name', e.target.value)}
           />
        </div>

        {/* Transform Group */}
        <div className="space-y-2">
            <div className="bg-[#262626] p-1 px-2 font-bold text-[10px] text-neutral-400 uppercase tracking-wider rounded-sm">Transform</div>
            
            <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                <span className="text-neutral-500">Location</span>
                <div className="grid grid-cols-3 gap-1">
                   <NumberInput label="X" value={actor.transform.x} onChange={(v) => handleChange('transform', v, 'x')} color="text-red-500" />
                   <NumberInput label="Y" value={actor.transform.y} onChange={(v) => handleChange('transform', v, 'y')} color="text-green-500" />
                   <NumberInput label="Z" value={actor.transform.z} onChange={(v) => handleChange('transform', v, 'z')} color="text-blue-500" />
                </div>
            </div>

            <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                <span className="text-neutral-500">Rotation</span>
                <div className="grid grid-cols-3 gap-1">
                   <NumberInput label="X" value={0} onChange={()=>{}} color="text-red-500" />
                   <NumberInput label="Y" value={0} onChange={()=>{}} color="text-green-500" />
                   <NumberInput label="Z" value={actor.transform.rotation} onChange={(v) => handleChange('transform', v, 'rotation')} color="text-blue-500" />
                </div>
            </div>

            <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
                <span className="text-neutral-500">Scale</span>
                <div className="grid grid-cols-3 gap-1">
                   <NumberInput label="X" value={actor.transform.scale} onChange={(v) => handleChange('transform', v, 'scale')} color="text-red-500" />
                   <NumberInput label="Y" value={actor.transform.scale} onChange={(v) => handleChange('transform', v, 'scale')} color="text-green-500" />
                   <NumberInput label="Z" value={actor.transform.scale} onChange={(v) => handleChange('transform', v, 'scale')} color="text-blue-500" />
                </div>
            </div>
        </div>

        {/* Appearance Group */}
        <div className="space-y-2">
           <div className="bg-[#262626] p-1 px-2 font-bold text-[10px] text-neutral-400 uppercase tracking-wider rounded-sm">Appearance</div>
           <div className="grid grid-cols-[60px_1fr] gap-2 items-center">
               <span className="text-neutral-500">Color</span>
               <div className="flex items-center space-x-2">
                 <input 
                   type="color" 
                   value={actor.color} 
                   onChange={(e) => handleChange('color', e.target.value)}
                   className="w-8 h-8 bg-transparent border-0 cursor-pointer"
                 />
                 <span className="text-neutral-400 font-mono">{actor.color}</span>
               </div>
           </div>
        </div>

         {/* AI Scripting Section */}
         <div className="space-y-2">
            <div className="bg-gradient-to-r from-blue-900 to-[#262626] p-1 px-2 font-bold text-[10px] text-blue-200 uppercase tracking-wider rounded-sm flex justify-between items-center">
                <span>Gemini Scripting</span>
                <svg className="w-3 h-3 text-blue-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>
            </div>
            
            <div className="flex items-center space-x-2">
                <span className="text-neutral-500 w-16">Language:</span>
                <select 
                    value={actor.scriptLanguage || 'C++'} 
                    onChange={(e) => handleChange('scriptLanguage', e.target.value)}
                    className="flex-1 bg-[#151515] border border-neutral-700 text-neutral-300 p-1 rounded focus:outline-none focus:border-blue-500"
                >
                    {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
            </div>

            <textarea 
               className="w-full h-32 bg-[#111] border border-neutral-700 p-2 font-mono text-[10px] text-green-400 resize-none focus:outline-none"
               value={actor.script || '// Click Generate to create AI script...'}
               readOnly
            />
            
            <button 
              onClick={handleGenerateScript}
              disabled={isGenerating}
              className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-1 rounded flex justify-center items-center space-x-2 transition-all disabled:opacity-50"
            >
               {isGenerating ? (
                   <span>Thinking...</span>
               ) : (
                   <>
                       <span className="text-lg">✨</span>
                       <span>Generate {actor.scriptLanguage || 'C++'} Script</span>
                   </>
               )}
            </button>
         </div>

      </div>
    </div>
  );
};

const NumberInput = ({ label, value, onChange, color }: { label: string, value: number, onChange: (val: number) => void, color: string }) => (
    <div className="flex items-center bg-[#151515] rounded overflow-hidden border border-neutral-800 focus-within:border-neutral-500">
        <div className={`px-2 py-1 text-[9px] font-bold ${color} cursor-ew-resize select-none`}>{label}</div>
        <input 
            type="number" 
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full bg-transparent text-neutral-300 focus:outline-none p-1 no-spinners"
        />
        <style>{`.no-spinners::-webkit-outer-spin-button, .no-spinners::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }`}</style>
    </div>
);
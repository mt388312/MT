import React from 'react';
import { Actor } from '../types';

interface OutlinerProps {
  actors: Actor[];
  onSelect: (id: string) => void;
}

export const Outliner: React.FC<OutlinerProps> = ({ actors, onSelect }) => {
  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-neutral-300 text-xs">
      <div className="p-2 bg-[#262626] font-bold border-b border-neutral-700 flex justify-between items-center">
        <span>Outliner</span>
        <span className="text-[10px] text-neutral-500">{actors.length} actors</span>
      </div>
      <div className="p-2 border-b border-neutral-700 bg-[#151515]">
        <input 
          type="text" 
          placeholder="Search Actors..." 
          className="w-full bg-[#262626] border border-neutral-700 rounded px-2 py-1 text-neutral-200 focus:outline-none focus:border-orange-500 placeholder-neutral-600"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="text-neutral-500 bg-[#1e1e1e] sticky top-0">
            <tr>
              <th className="p-2 font-normal border-b border-neutral-700">Label</th>
              <th className="p-2 font-normal border-b border-neutral-700">Type</th>
            </tr>
          </thead>
          <tbody>
            {actors.map(actor => (
              <tr 
                key={actor.id} 
                onClick={() => onSelect(actor.id)}
                className={`cursor-pointer hover:bg-[#2d2d2d] ${actor.selected ? 'bg-[#005fb8] hover:bg-[#005fb8] text-white' : ''}`}
              >
                <td className="p-1 pl-4 flex items-center">
                   {/* Icon based on type */}
                   <span className={`w-2 h-2 rounded-full mr-2 ${actor.selected ? 'bg-white' : 'bg-orange-500'}`}></span>
                   {actor.name}
                </td>
                <td className="p-1 text-neutral-500">{actor.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
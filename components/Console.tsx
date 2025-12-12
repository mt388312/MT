import React from 'react';
import { LogMessage } from '../types';

export const Console: React.FC<{ logs: LogMessage[] }> = ({ logs }) => {
    return (
        <div className="h-full bg-[#111] text-neutral-300 text-[10px] font-mono flex flex-col">
            <div className="bg-[#262626] px-2 py-1 flex justify-between border-b border-neutral-700">
                <span className="font-bold">Output Log</span>
                <input type="text" placeholder="Filter" className="bg-[#111] border border-neutral-600 rounded px-1 w-32 focus:outline-none" />
            </div>
            <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
                {logs.map(log => (
                    <div key={log.id} className={`hover:bg-[#222] px-1 ${
                        log.type === 'error' ? 'text-red-500' : 
                        log.type === 'warning' ? 'text-yellow-500' : 
                        log.type === 'success' ? 'text-green-500' : 'text-neutral-400'
                    }`}>
                        <span className="opacity-50 mr-2">[{log.timestamp}]</span>
                        <span>{log.text}</span>
                    </div>
                ))}
            </div>
            <div className="p-1 border-t border-neutral-700 flex">
                <span className="text-orange-500 mr-1">{'>'}</span>
                <input type="text" className="bg-transparent w-full focus:outline-none text-white" placeholder="Enter console command" />
            </div>
        </div>
    )
}
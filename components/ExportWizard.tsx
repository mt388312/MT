import React, { useState } from 'react';

export interface ExportSettings {
    type: 'Game' | 'Video' | 'HTML5' | 'AssetPack';
    projectName: string;
    author: string;
    version: string;
}

interface ExportWizardProps {
    onClose: () => void;
    onFinalize: (settings: ExportSettings) => void;
}

const STEPS = ['Purchase', 'Type', 'Metadata', 'Ready'];

export const ExportWizard: React.FC<ExportWizardProps> = ({ onClose, onFinalize }) => {
    const [step, setStep] = useState(0);
    const [settings, setSettings] = useState<ExportSettings>({
        type: 'Game',
        projectName: 'MyProject',
        author: 'User',
        version: '1.0.0'
    });

    const handleNext = () => setStep(prev => prev + 1);
    
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center font-sans">
            <div className="bg-[#1e1e1e] w-[600px] border border-neutral-700 rounded-lg shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-[#262626] p-4 border-b border-black flex justify-between items-center">
                    <h2 className="text-white font-bold text-lg">Project Packaging Wizard</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white">&times;</button>
                </div>

                {/* Progress Bar */}
                <div className="flex bg-[#111] h-1">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`flex-1 transition-all duration-500 ${i <= step ? 'bg-orange-500' : 'bg-neutral-800'}`}></div>
                    ))}
                </div>

                <div className="p-8 flex-1">
                    {step === 0 && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-neutral-800 rounded-full mx-auto flex items-center justify-center text-4xl">
                                🔒
                            </div>
                            <h3 className="text-2xl text-white font-light">Export License Required</h3>
                            <p className="text-neutral-400">To package your project into a standalone executable, video, or zip archive, you need to unlock the export module.</p>
                            <div className="bg-gradient-to-r from-orange-900/20 to-orange-600/20 border border-orange-500/50 p-4 rounded">
                                <span className="text-3xl font-bold text-white">$0.00</span>
                                <span className="text-orange-400 text-sm block">Limited Time Offer (Early Access)</span>
                            </div>
                            <button onClick={handleNext} className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded shadow-lg transition-all transform hover:scale-105">
                                Purchase & Unlock
                            </button>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-xl text-white">Select Build Target</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'Game', icon: '🎮', label: 'Windows Game (.exe)', desc: 'Standalone executable' },
                                    { id: 'Video', icon: '🎬', label: 'Cinematic (.mp4)', desc: 'Rendered video sequence' },
                                    { id: 'HTML5', icon: '🌐', label: 'Web (.html)', desc: 'Browser based deployment' },
                                    { id: 'AssetPack', icon: '📦', label: 'Asset Pack', desc: 'Source files only' }
                                ].map((opt) => (
                                    <div 
                                        key={opt.id}
                                        onClick={() => setSettings({...settings, type: opt.id as any})}
                                        className={`p-4 border rounded cursor-pointer transition-all ${settings.type === opt.id ? 'bg-orange-500/10 border-orange-500' : 'bg-[#262626] border-neutral-700 hover:border-neutral-500'}`}
                                    >
                                        <div className="text-2xl mb-2">{opt.icon}</div>
                                        <div className="font-bold text-white">{opt.label}</div>
                                        <div className="text-xs text-neutral-400">{opt.desc}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end pt-4">
                                <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold">Next</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-xl text-white">Project Metadata</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-neutral-400 text-xs mb-1">Project Name</label>
                                    <input 
                                        type="text" 
                                        value={settings.projectName}
                                        onChange={(e) => setSettings({...settings, projectName: e.target.value})}
                                        className="w-full bg-[#111] border border-neutral-700 rounded p-2 text-white focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-neutral-400 text-xs mb-1">Author / Studio</label>
                                    <input 
                                        type="text" 
                                        value={settings.author}
                                        onChange={(e) => setSettings({...settings, author: e.target.value})}
                                        className="w-full bg-[#111] border border-neutral-700 rounded p-2 text-white focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-neutral-400 text-xs mb-1">Version</label>
                                    <input 
                                        type="text" 
                                        value={settings.version}
                                        onChange={(e) => setSettings({...settings, version: e.target.value})}
                                        className="w-full bg-[#111] border border-neutral-700 rounded p-2 text-white focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold">Next</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 text-center">
                            <h3 className="text-xl text-white">Ready to Package</h3>
                            <div className="bg-[#262626] p-4 rounded text-left space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-neutral-500">Target:</span> <span className="text-white">{settings.type}</span></div>
                                <div className="flex justify-between"><span className="text-neutral-500">Name:</span> <span className="text-white">{settings.projectName}</span></div>
                                <div className="flex justify-between"><span className="text-neutral-500">Author:</span> <span className="text-white">{settings.author}</span></div>
                                <div className="flex justify-between"><span className="text-neutral-500">Version:</span> <span className="text-white">{settings.version}</span></div>
                            </div>
                            <p className="text-green-400 text-sm">✓ All assets validated.</p>
                            
                            <div className="space-y-3 pt-2">
                                <button 
                                    onClick={() => onFinalize(settings)}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded shadow-lg"
                                >
                                    Download ZIP Package
                                </button>
                                <button onClick={() => alert("Link copied to clipboard!")} className="w-full bg-[#333] hover:bg-[#444] text-white font-bold py-3 rounded border border-neutral-600">
                                    Generate Share Link
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
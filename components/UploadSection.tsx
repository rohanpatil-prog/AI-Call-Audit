
import React, { useState, useRef } from 'react';
import { AuditSession } from '../types';
import { analyzeCallTranscript, analyzeAudioBuffer } from '../geminiService';

interface UploadSectionProps {
  onComplete: (session: AuditSession) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTodayFormatted = () => {
    const d = new Date();
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const d = file.lastModified ? new Date(file.lastModified) : new Date();
      const fileDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const results = await analyzeAudioBuffer(base64, file.type);
        
        if (results.metadata) {
          results.metadata.callDate = fileDate;
        }

        onComplete({
          id: `AUD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          filename: file.name,
          audioUrl: URL.createObjectURL(file),
          status: 'completed',
          results
        });
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Analysis failed. Please check your connection and try again.");
      setIsProcessing(false);
    }
  };

  const handleTranscriptSubmit = async () => {
    if (!transcriptInput.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const results = await analyzeCallTranscript(transcriptInput);
      if (results.metadata) {
        results.metadata.callDate = getTodayFormatted();
      }
      onComplete({
        id: `AUD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        filename: "Manual Submission",
        status: 'completed',
        results
      });
    } catch (err) {
      setError("Failed to analyze transcript. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-100 mb-8">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`pb-4 px-6 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'upload' ? 'text-[#00338d] border-b-2 border-[#00338d]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Audio Input
        </button>
        <button 
          onClick={() => setActiveTab('text')}
          className={`pb-4 px-6 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'text' ? 'text-[#00338d] border-b-2 border-[#00338d]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Transcript Text
        </button>
      </div>

      <div className="min-h-[250px] flex flex-col justify-center">
        {activeTab === 'upload' ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-10 text-center hover:border-[#00338d] transition group bg-gray-50/30">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="audio/*" 
                onChange={handleFileUpload} 
              />
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition shadow-sm border border-blue-100">
                <svg className="w-8 h-8 text-[#00338d]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <p className="text-gray-600 font-bold mb-1">Upload Audio Recording</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">WAV / MP3 / M4A • Max 25MB</p>
              <button 
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 bg-[#ff7e00] text-white px-10 py-3 rounded-xl font-black text-sm shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:bg-gray-400"
              >
                {isProcessing ? 'AI AUDITING IN PROGRESS...' : 'SELECT FILE'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea 
              value={transcriptInput}
              onChange={(e) => setTranscriptInput(e.target.value)}
              placeholder="Paste the conversation transcript here for compliance scanning..."
              className="w-full h-48 p-5 border-2 border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none text-gray-900 font-semibold text-base shadow-inner bg-gray-50/50"
            />
            <div className="flex justify-end">
              <button 
                disabled={isProcessing || !transcriptInput}
                onClick={handleTranscriptSubmit}
                className="bg-[#ff7e00] text-white px-10 py-3 rounded-xl font-black text-sm shadow-xl hover:bg-orange-600 transition-all disabled:bg-gray-300"
              >
                {isProcessing ? 'SCANNING CONTENT...' : 'START AI AUDIT'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-3 border border-red-100 animate-bounce">
            <svg className="w-5 h-5 flex-none" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;

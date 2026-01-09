
import React, { useState, useRef, useEffect } from 'react';
import { AuditSession, ComplianceIssue, RiskLevel } from '../types';
import RiskChart from './RiskChart';

interface AuditDashboardProps {
  session: AuditSession;
  onReset: () => void;
}

const AuditDashboard: React.FC<AuditDashboardProps> = ({ session, onReset }) => {
  const [issues, setIssues] = useState<ComplianceIssue[]>(session.results?.issues || []);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAutoStopEnabled, setIsAutoStopEnabled] = useState(true);

  const activeIssue = issues.find(i => i.id === activeIssueId);
  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const totalCount = issues.length;

  // Sync audio state and handle auto-stop logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Precise auto-stop logic: Only stop if we are reviewing a flag and haven't disabled the constraint
      if (isAutoStopEnabled && activeIssue && !audio.paused && activeIssue.endTime !== undefined) {
        if (audio.currentTime >= activeIssue.endTime) {
          audio.pause();
          audio.currentTime = activeIssue.endTime;
        }
      }
    };
    
    const handleDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeIssue, isAutoStopEnabled]);

  // Jump audio when active issue changes
  useEffect(() => {
    if (activeIssue && audioRef.current && activeIssue.startTime !== undefined) {
      audioRef.current.currentTime = activeIssue.startTime;
      setCurrentNotes(activeIssue.notes || '');
      setIsAutoStopEnabled(true);
      audioRef.current.pause();
    }
  }, [activeIssueId]);

  const handleStatusChange = (id: string, status: 'validated' | 'rejected') => {
    const updatedIssues = issues.map(i => i.id === id ? { ...i, status, notes: currentNotes } : i);
    setIssues(updatedIssues);

    setTimeout(() => {
      const nextPending = updatedIssues.find(i => i.status === 'pending');
      if (nextPending) {
        setActiveIssueId(nextPending.id);
      } else {
        setActiveIssueId(null);
      }
    }, 450);
  };

  const startAudit = () => {
    const firstPending = issues.find(i => i.status === 'pending');
    if (firstPending) {
      setActiveIssueId(firstPending.id);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const results = session.results;
  if (!results) return null;

  const riskColor = results.riskLevel === RiskLevel.HIGH ? 'text-red-600' : results.riskLevel === RiskLevel.MEDIUM ? 'text-orange-600' : 'text-green-600';
  const riskBg = results.riskLevel === RiskLevel.HIGH ? 'bg-red-50 border-red-100' : results.riskLevel === RiskLevel.MEDIUM ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn max-w-7xl mx-auto pb-20 print:block">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-full { width: 100% !important; border: none !important; box-shadow: none !important; }
          .bg-blue-950, .bg-white\\/10 { background-color: transparent !important; color: black !important; }
          .text-white { color: black !important; }
          .print-border { border: 1px solid #eee !important; margin-bottom: 20px !important; }
          .print-break { page-break-inside: avoid; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
      
      {session.audioUrl && <audio ref={audioRef} src={session.audioUrl} className="hidden" />}

      {/* Header Actions */}
      <div className="lg:col-span-12 flex flex-col md:flex-row md:items-end justify-between gap-4 no-print">
        <div>
          <button onClick={onReset} className="text-white/80 flex items-center gap-2 hover:text-white mb-2 transition-colors font-bold text-xs group tracking-widest uppercase">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </button>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-none tracking-tight">Audit Investigator</h2>
          <p className="text-blue-200 text-sm md:text-base font-bold mt-1 opacity-90">Ref: {session.id} • Date: {results.metadata?.callDate}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 border border-white/20 font-bold text-sm flex items-center gap-2 transition-all shadow-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Export Report
          </button>
          <button onClick={onReset} className="px-7 py-2.5 bg-[#ff7e00] text-white rounded-xl font-black text-sm shadow-xl hover:bg-orange-600 transition-all active:scale-95">
            Finalize Audit
          </button>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="lg:col-span-12 flex flex-wrap gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 items-center justify-between no-print shadow-xl">
        {[
          { label: 'Agent', val: results.metadata?.agentName, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          { label: 'Customer', val: results.metadata?.customerName, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { label: 'Length', val: formatTime(duration) || results.metadata?.duration, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Channel', val: results.metadata?.department, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-4 border-r border-white/10 last:border-0">
            <div className="p-1.5 bg-white/10 rounded-lg border border-white/10">
              <svg className="w-4 h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
            </div>
            <div>
              <div className="text-[8px] uppercase font-black text-blue-300 tracking-widest">{item.label}</div>
              <div className="text-sm font-bold text-white truncate max-w-[120px]">{item.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 space-y-6 flex flex-col no-print">
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100">
          <h3 className="text-base font-black text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
            Compliance Summary
          </h3>
          <RiskChart score={results.riskScore} />
          
          <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
             <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Audit Index Guide</div>
             <div className="flex items-center justify-between text-[10px] font-bold">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <span className="text-gray-600">0 - 30 (Safe)</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                   <span className="text-gray-600">31 - 60 (Watch)</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-red-500"></div>
                   <span className="text-gray-600">61+ (Critical)</span>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 flex flex-col flex-1 min-h-[400px]">
          <h3 className="text-base font-black text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
            Compliance Flags ({pendingCount})
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
            {issues.map((issue) => {
              const isActive = activeIssueId === issue.id;
              const isResolved = issue.status !== 'pending';
              const isValidated = issue.status === 'validated';
              return (
                <button
                  key={issue.id}
                  onClick={() => setActiveIssueId(issue.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 group relative ${
                    isActive 
                      ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-4 ring-orange-500/5' 
                      : (isResolved ? 'opacity-50 grayscale border-gray-100' : 'border-gray-50 hover:border-blue-200 hover:bg-blue-50/30')
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${isActive ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {issue.category}
                    </span>
                    {isResolved && (
                      <span className={`flex items-center gap-0.5 text-[8px] font-black uppercase ${isValidated ? 'text-green-600' : 'text-red-600'}`}>
                        {isValidated ? 'Violation' : 'Safe'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">"{issue.excerpt}"</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workflow Column */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Violation Investigator */}
        <div className={`bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 print:opacity-100 ${!activeIssue ? 'opacity-90' : 'opacity-100'}`}>
          <div className="px-8 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black uppercase text-orange-600 tracking-widest mb-0.5 block">Audit Workstation</span>
              <h3 className="text-2xl font-black text-gray-800">
                {activeIssue ? activeIssue.category : (pendingCount > 0 ? "Let's Start the Audit" : "Audit Complete")}
              </h3>
            </div>
            {activeIssue && (
              <div className="flex items-center gap-3 no-print">
                 <span className="text-[10px] font-black uppercase bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-orange-600 shadow-sm">
                   Flagged: {formatTime(activeIssue.startTime || 0)} - {formatTime(activeIssue.endTime || 0)}
                 </span>
              </div>
            )}
          </div>

          <div className="p-8 space-y-8">
            {activeIssue ? (
              <>
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-5">
                    <div className="bg-orange-50/50 p-6 rounded-2xl border-l-[6px] border-orange-400 shadow-inner relative">
                      <p className="text-xl font-bold text-gray-800 italic leading-snug">"{activeIssue.excerpt}"</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">AI Logic / Regulatory Insight</h4>
                      <p className="text-gray-700 text-base font-medium leading-relaxed bg-gray-50/50 p-5 rounded-xl border border-gray-100">{activeIssue.explanation}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Auditor Feedback</h4>
                    <textarea
                      value={currentNotes}
                      onChange={(e) => setCurrentNotes(e.target.value)}
                      placeholder="Enter detailed audit findings or remediation required..."
                      className="no-print w-full h-28 p-5 bg-white border-2 border-gray-100 rounded-2xl text-base font-bold text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none shadow-sm placeholder:text-gray-300 placeholder:font-normal"
                    />
                    <div className="hidden print:block p-5 border-2 border-gray-100 rounded-2xl italic text-sm text-gray-700 bg-gray-50">
                      {currentNotes || "No manual observations provided."}
                    </div>
                  </div>
                </div>

                {/* Audio Controller */}
                <div className="bg-gray-100 rounded-2xl p-6 no-print shadow-inner border border-gray-200">
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={togglePlay}
                        className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 flex-none"
                      >
                        {isPlaying ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                          <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </button>
                      <div className="flex-1 space-y-3">
                         <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="bg-white px-2 py-0.5 rounded shadow-sm">{formatTime(currentTime)}</span>
                            <div className="flex gap-4 items-center">
                               {isAutoStopEnabled ? (
                                 <button 
                                  onClick={() => setIsAutoStopEnabled(false)} 
                                  className="text-orange-600 font-bold hover:underline flex items-center gap-1"
                                 >
                                   <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse"></div>
                                   UNLOCK PLAYBACK
                                 </button>
                               ) : (
                                 <span className="text-gray-400 font-bold uppercase">Full Track Mode</span>
                               )}
                               <span className="bg-white px-2 py-0.5 rounded shadow-sm">{formatTime(duration)}</span>
                            </div>
                         </div>
                         <div className="relative h-2.5 w-full bg-gray-300 rounded-full overflow-hidden">
                            {activeIssue.startTime !== undefined && activeIssue.endTime !== undefined && (
                              <div 
                                className="absolute h-full bg-orange-400 opacity-40 z-0" 
                                style={{ 
                                  left: `${(activeIssue.startTime / (duration || 1)) * 100}%`, 
                                  width: `${((activeIssue.endTime - activeIssue.startTime) / (duration || 1)) * 100}%` 
                                }}
                              ></div>
                            )}
                            <input 
                              type="range"
                              min="0"
                              max={duration || 0}
                              step="0.1"
                              value={currentTime}
                              onChange={handleSeek}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div 
                              className="absolute top-0 left-0 h-full bg-blue-600 transition-all z-[1]"
                              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            ></div>
                         </div>
                         <p className="text-[9px] font-black text-gray-500 text-center italic tracking-widest uppercase">
                            {isAutoStopEnabled ? `Automatic clamp set to ${formatTime(activeIssue.endTime || 0)}` : "Playback constraint removed"}
                         </p>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 no-print">
                  <button 
                    onClick={() => handleStatusChange(activeIssue.id, 'validated')}
                    className="flex-1 bg-green-600 text-white py-4 rounded-xl font-black text-base shadow-xl hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Confirm Violation
                  </button>
                  <button 
                    onClick={() => handleStatusChange(activeIssue.id, 'rejected')}
                    className="flex-1 bg-white border-2 border-red-50 text-red-600 py-4 rounded-xl font-black text-base shadow-lg hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    Mark as Safe
                  </button>
                </div>
              </>
            ) : (
              <div className="py-20 flex flex-col items-center text-center space-y-6">
                 {pendingCount > 0 ? (
                   <>
                     <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-2 shadow-lg">
                        <svg className="w-10 h-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <div className="max-w-sm">
                        <h4 className="text-3xl font-black text-gray-800 mb-2">Ready to Start</h4>
                        <p className="text-gray-500 text-base font-medium mb-6">AI detected {pendingCount} compliance issues on {results.metadata?.callDate}. Begin manual verification to finalize.</p>
                        <button 
                          onClick={startAudit}
                          className="px-10 py-3 bg-blue-600 text-white rounded-xl font-black text-sm shadow-xl hover:bg-blue-700 transition-all active:scale-95"
                        >
                          Start Investigation
                        </button>
                     </div>
                   </>
                 ) : (
                   <>
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2 shadow-lg">
                        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <div className="max-w-sm">
                        <h4 className="text-3xl font-black text-gray-800 mb-2">Audit Completed</h4>
                        <p className="text-gray-500 text-base font-medium">All flags for this interaction have been reviewed and finalized on {results.metadata?.callDate}.</p>
                     </div>
                   </>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* Transcript Explorer */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col flex-1 min-h-[500px] border border-gray-100">
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center no-print">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              Call Transcript Logs
            </h3>
          </div>
          
          <div className="flex-1 p-8 space-y-5 overflow-y-auto max-h-[600px] custom-scrollbar print:max-h-none print:overflow-visible">
            {results.transcript.map((line, idx) => {
              const isActiveLine = activeIssueId && line.issueId === activeIssueId;
              const issueForLine = issues.find(i => i.id === line.issueId);
              const isResolved = issueForLine && issueForLine.status !== 'pending';

              return (
                <div key={idx} className={`flex flex-col ${line.speaker === 'Agent' ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-2 mb-1.5 px-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${line.speaker === 'Agent' ? 'text-blue-600' : 'text-gray-400'}`}>
                      {line.speaker}
                    </span>
                    {line.timestamp && <span className="text-[9px] font-bold text-gray-300">[{line.timestamp}]</span>}
                  </div>
                  <div className={`relative max-w-[85%] px-5 py-3.5 rounded-2xl text-base leading-relaxed shadow-sm transition-all duration-300 ${
                    line.speaker === 'Agent' 
                      ? (line.issueId 
                          ? `bg-orange-50 border-2 ${isActiveLine ? 'border-orange-500 shadow-lg' : (isResolved ? 'border-gray-100 opacity-60' : 'border-orange-200')} text-gray-800 font-medium` 
                          : 'bg-blue-50/50 border border-blue-100/50 text-gray-800 rounded-tl-none')
                      : 'bg-gray-100/50 text-gray-500 rounded-tr-none border border-transparent italic'
                  }`}>
                    {line.text}
                    {line.issueId && !isResolved && (
                      <button 
                        onClick={() => setActiveIssueId(line.issueId!)}
                        className={`mt-3 block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${isActiveLine ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                      >
                        {isActiveLine ? 'Investigating...' : 'Review Flag'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditDashboard;

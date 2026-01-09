
import React from 'react';
import { AuditSession, RiskLevel } from '../types';

interface ComplianceHistoryViewProps {
  history: AuditSession[];
  onSelect: (session: AuditSession) => void;
  onNavigate: () => void;
}

const ComplianceHistoryView: React.FC<ComplianceHistoryViewProps> = ({ history, onSelect, onNavigate }) => {
  const displayHistory = history.length > 0 ? history : [
    {
      id: 'AUD-83921',
      timestamp: new Date().toISOString(),
      filename: 'sales_call_john_doe.mp3',
      status: 'completed' as const,
      results: { 
        riskScore: 68, 
        riskLevel: RiskLevel.HIGH, 
        metadata: { agentName: 'John Agent', customerName: 'Alice Smith', callDate: '28/12/2025', duration: '08:24', department: 'Life' } 
      }
    },
    {
      id: 'AUD-83920',
      timestamp: new Date().toISOString(),
      filename: 'interaction_premium_plus.mp3',
      status: 'completed' as const,
      results: { 
        riskScore: 12, 
        riskLevel: RiskLevel.LOW, 
        metadata: { agentName: 'Sarah Sales', customerName: 'Bob Brown', callDate: '27/12/2025', duration: '12:15', department: 'Direct' } 
      }
    }
  ] as unknown as AuditSession[];

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full max-w-7xl space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">Audit History</h2>
          <p className="text-blue-200">Historical records of all call compliance assessments</p>
        </div>
        <button 
           onClick={onNavigate}
           className="bg-[#ff7e00] text-white px-8 py-3 rounded-xl font-black shadow-xl hover:bg-orange-600 transition-all active:scale-95"
        >
          New Audit Call
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Call Reference</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Agent / Customer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date Audited</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Risk Level</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Score</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayHistory.map((session) => (
                <tr key={session.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-800">{session.id}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[150px]">{session.filename}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-blue-600">{session.results?.metadata?.agentName}</div>
                    <div className="text-xs text-gray-500">to {session.results?.metadata?.customerName}</div>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-600 font-black">
                    {session.results?.metadata?.callDate || formatDate(session.timestamp)}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      session.results?.riskLevel === RiskLevel.HIGH ? 'bg-red-100 text-red-600' :
                      session.results?.riskLevel === RiskLevel.MEDIUM ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {session.results?.riskLevel}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`text-xl font-black ${
                      (session.results?.riskScore || 0) > 60 ? 'text-red-600' :
                      (session.results?.riskScore || 0) > 30 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {session.results?.riskScore}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => { onSelect(session); onNavigate(); }}
                      className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplianceHistoryView;

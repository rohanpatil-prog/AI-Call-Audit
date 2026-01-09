
import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import AuditDashboard from './components/AuditDashboard';
import AnalyticsDashboardView from './components/AnalyticsDashboardView';
import ComplianceHistoryView from './components/ComplianceHistoryView';
import RiskRulesView from './components/RiskRulesView';
import { AuditSession } from './types';

export type NavTab = 'audit' | 'analytics' | 'history' | 'rules';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('audit');
  const [currentSession, setCurrentSession] = useState<AuditSession | null>(null);
  
  // Mock history state to show functionality
  const [history, setHistory] = useState<AuditSession[]>([]);

  const handleAuditComplete = (session: AuditSession) => {
    setCurrentSession(session);
    setHistory(prev => [session, ...prev]);
  };

  const resetAudit = () => {
    setCurrentSession(null);
  };

  const renderContent = () => {
    if (currentSession && currentTab === 'audit') {
      return (
        <div className="w-full h-full max-w-7xl animate-fadeIn">
          <AuditDashboard session={currentSession} onReset={resetAudit} />
        </div>
      );
    }

    switch (currentTab) {
      case 'analytics':
        return <AnalyticsDashboardView history={history} />;
      case 'history':
        return <ComplianceHistoryView history={history} onSelect={setCurrentSession} onNavigate={() => setCurrentTab('audit')} />;
      case 'rules':
        return <RiskRulesView />;
      case 'audit':
      default:
        return (
          <div className="w-full max-w-5xl">
            <div className="text-white mb-10 text-center md:text-left">
              <h4 className="text-sm font-semibold tracking-widest uppercase mb-2 opacity-80">Bajaj Life Insurance Compliance Intelligence</h4>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                AI Call Audit & <br />
                <span className="text-orange-400">Mis-selling Detection</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                Automatically analyze customer interaction calls to identify compliance risks, omissions, 
                and regulatory violations for Bajaj Life Insurance interactions.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <UploadSection onComplete={handleAuditComplete} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="bg-blue-900/40 border border-blue-400/20 p-6 rounded-xl text-white">
                <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="font-semibold mb-1">Zero Mis-selling</h3>
                <p className="text-sm opacity-70">Detect guaranteed return claims instantly.</p>
              </div>
              <div className="bg-blue-900/40 border border-blue-400/20 p-6 rounded-xl text-white">
                <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="font-semibold mb-1">Full Disclosure</h3>
                <p className="text-sm opacity-70">Verify mandatory policy risks explained.</p>
              </div>
              <div className="bg-blue-900/40 border border-blue-400/20 p-6 rounded-xl text-white">
                <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="font-semibold mb-1">Audit Trail</h3>
                <p className="text-sm opacity-70">Automated documentation for regulators.</p>
              </div>
              <div className="bg-blue-900/40 border border-blue-400/20 p-6 rounded-xl text-white">
                <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="font-semibold mb-1">Scale Reviews</h3>
                <p className="text-sm opacity-70">Audit 100% of calls instead of 2%.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#00338d]">
      <Header onTabChange={setCurrentTab} activeTab={currentTab} onResetHome={() => { resetAudit(); setCurrentTab('audit'); }} />
      
      <main className="flex-1 flex flex-col items-center py-12 px-4 md:px-8 overflow-y-auto">
        {renderContent()}
      </main>

      <footer className="py-6 border-t border-blue-400/20 text-white/50 text-center text-sm px-4">
        &copy; Bajaj Life Insurance Limited (Formerly known as Bajaj Allianz Life Insurance Company Limited). All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;

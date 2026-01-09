
import React, { useState, useRef } from 'react';

const RiskRulesView: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeRules = [
    { title: 'IRDAI Regulation Sec 41', desc: 'Mandatory prohibition of rebates and disclosure of agent commission if asked.', category: 'Legal', severity: 'Critical' },
    { title: 'Bajaj Mis-selling Guard', desc: 'No guaranteed returns can be promised on ULIP or market-linked plans.', category: 'Internal', severity: 'Critical' },
    { title: 'Customer Benefit Disclosure', desc: 'Agents must mention premium payment term vs policy term clearly.', category: 'Disclosure', severity: 'High' },
    { title: 'Anti-Pressure Selling', desc: 'Calling multiple times within 24 hours or using aggressive language.', category: 'Ethics', severity: 'Medium' },
    { title: 'Free-Look Period Info', desc: 'Must mention the 15-day/30-day free look period for all new policies.', category: 'Service', severity: 'High' },
  ];

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate AI knowledge base update
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);
    }, 3000);
  };

  return (
    <div className="w-full max-w-7xl animate-fadeIn space-y-8">
      {/* Unified Header to ensure column alignment */}
      <div className="w-full">
        <h2 className="text-3xl font-black text-white">Risk & Compliance Rules</h2>
        <p className="text-blue-200">Current logic and regulatory guidelines used by the AI auditing engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rules List Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Active Compliance Framework
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  Version 2.4.1
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {activeRules.map((rule, i) => (
                <div key={i} className="p-6 border border-gray-50 bg-gray-50/30 rounded-2xl hover:border-blue-200 hover:bg-white transition-all duration-300 group shadow-sm hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                     <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-gray-200 text-gray-500 px-2 py-1 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {rule.category}
                        </span>
                        <h4 className="text-lg font-extrabold text-gray-800 leading-tight">{rule.title}</h4>
                     </div>
                     <span className={`self-start sm:self-auto text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                       rule.severity === 'Critical' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                     }`}>
                       {rule.severity} Severity
                     </span>
                  </div>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Knowledge Update Sidebar Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 flex-1">
             <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-7 h-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
             </div>
             
             <h3 className="text-xl font-black text-gray-800 mb-2">Knowledge Update</h3>
             <p className="text-gray-500 text-sm mb-8 leading-relaxed">
               Inject new regulatory circulars or Bajaj internal guidelines to immediately update AI auditing logic.
             </p>

             <div 
               onClick={() => !isUploading && fileInputRef.current?.click()}
               className={`border-2 border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all duration-300 ${
                 isUploading 
                  ? 'border-orange-300 bg-orange-50' 
                  : uploadSuccess
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-100 bg-gray-50/50 hover:border-orange-400 hover:bg-orange-50/30'
               }`}
             >
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handlePdfUpload} />
                
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Processing...</div>
                  </div>
                ) : uploadSuccess ? (
                  <div className="space-y-4">
                     <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                     </div>
                     <div className="text-[10px] font-black uppercase text-green-600 tracking-widest">Base Updated</div>
                  </div>
                ) : (
                  <div className="space-y-4 group">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-gray-300 group-hover:text-orange-500 transition-all duration-300 shadow-sm border border-gray-100">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                     </div>
                     <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover:text-orange-600 transition-colors">
                       Drop Guidelines PDF
                     </div>
                  </div>
                )}
             </div>

             <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex gap-4">
                   <div className="flex-none pt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[11px] font-black text-blue-900 uppercase">System Notice</p>
                      <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                        New rules are applied immediately to all future auditing sessions.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskRulesView;

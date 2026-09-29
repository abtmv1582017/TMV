import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Search, Filter } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, language } = useApp();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'সিস্টেম নিরীক্ষা ও নিরাপত্তা লগ' : 'System Security & Compliance Audit Logs'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · Immutable Digital Personal Data Protection (DPDP) Audit Trail
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by user, action, details..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">Timestamp</th>
              <th className="py-2.5 px-4">User</th>
              <th className="py-2.5 px-4">Role</th>
              <th className="py-2.5 px-4">Action Code</th>
              <th className="py-2.5 px-4">Details</th>
              <th className="py-2.5 px-4 text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition">
                <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                <td className="py-3 px-4 font-sans font-semibold text-slate-900">{log.userName}</td>
                <td className="py-3 px-4 font-sans capitalize text-slate-600">{log.userRole}</td>
                <td className="py-3 px-4 text-sky-800 font-bold">{log.action}</td>
                <td className="py-3 px-4 font-sans text-slate-700">{log.details}</td>
                <td className="py-3 px-4 text-right text-slate-400">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

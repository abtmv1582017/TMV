import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstitutionalSettings } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Settings,
  Building2,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Shield,
  GraduationCap
} from 'lucide-react';

export const InstitutionalSettingsView: React.FC = () => {
  const { settings, updateSettings, language } = useApp();

  const [form, setForm] = useState<InstitutionalSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const backupJson = StorageService.exportDatabaseBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamralipta_lms_backup_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importDatabaseBackup(content);
      if (success) {
        alert('Database backup restored successfully! Reloading...');
        window.location.reload();
      } else {
        setImportError('Invalid backup file format or corrupt JSON structure.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all LMS data to factory defaults? All newly entered courses and submissions will be reset.')) {
      StorageService.resetAllData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'প্রাতিষ্ঠানিক সেটিংস ও ব্যাকআপ' : 'Institutional Settings & Database Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamralipta Mahavidyalaya · College Profile, Grading Policy, Data Backups & System Integrity
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* College Profile */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-600" />
            Institution Identity & Accreditation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700">College Name (English):</label>
              <input
                type="text"
                required
                value={form.collegeName}
                onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">College Name (বাংলা / Bengali):</label>
              <input
                type="text"
                value={form.collegeBengaliName}
                onChange={(e) => setForm({ ...form, collegeBengaliName: e.target.value })}
                className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Motto / Tagline:</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Affiliation & University:</label>
              <input
                type="text"
                value={form.affiliation}
                onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
                className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Postal Address:</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Contact Email:</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full text-xs mt-1 px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Institutional Profile</span>
            </button>
          </div>
        </div>

        {/* Grading Scale Scheme */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-sky-600" />
            Configured 10-Point CBCS Grading Policy (Vidyasagar University)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Letter Grade</th>
                  <th className="py-2 px-3">Qualifying Range</th>
                  <th className="py-2 px-3 text-center">Grade Point</th>
                  <th className="py-2 px-3 text-right">Academic Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {form.gradingScale.map((scale, i) => (
                  <tr key={i}>
                    <td className="py-2.5 px-3 font-bold text-sky-900">{scale.grade}</td>
                    <td className="py-2.5 px-3">≥ {scale.minPercent}% Score</td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold">{scale.gpa.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{scale.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Backup & System Recovery */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            Data Backup, Disaster Recovery & Reset
          </h2>
          <p className="text-xs text-slate-600">
            Export complete TM-LMS database state (courses, assignments, submissions, quizzes, grades, attendance, discussions) as an offline JSON snapshot.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Database Backup (JSON)</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer border border-slate-300">
              <Upload className="w-4 h-4" />
              <span>Restore from Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Factory Sample Data</span>
            </button>
          </div>

          {importError && (
            <div className="text-xs text-rose-600 font-semibold">{importError}</div>
          )}
        </div>
      </form>
    </div>
  );
};

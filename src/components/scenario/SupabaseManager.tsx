/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  UploadCloud, 
  RefreshCw, 
  Copy, 
  Check, 
  Code, 
  Info, 
  AlertTriangle,
  ServerCrash
} from 'lucide-react';
import { SUPABASE_TABLES_INFO, isSupabaseConfigured } from '../../lib/supabase';

interface SupabaseManagerProps {
  isMockDeactivated: boolean;
  onToggleMockMode: (deactivate: boolean) => void;
  onSeedDatabase: () => Promise<void>;
  onForceRefresh: () => Promise<void>;
  isUploading: boolean;
  isFetching: boolean;
  operationLogs: string;
}

export default function SupabaseManager({
  isMockDeactivated,
  onToggleMockMode,
  onSeedDatabase,
  onForceRefresh,
  isUploading,
  isFetching,
  operationLogs
}: SupabaseManagerProps) {
  const [selectedTableTab, setSelectedTableTab] = useState<string>(SUPABASE_TABLES_INFO[0].name);
  const [copiedSql, setCopiedSql] = useState<string | null>(null);

  const activeTable = SUPABASE_TABLES_INFO.find(t => t.name === selectedTableTab) || SUPABASE_TABLES_INFO[0];

  const handleCopySql = (sql: string, name: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedSql(name);
    setTimeout(() => setCopiedSql(null), 2000);
  };

  const dbUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const hasValidCreds = isSupabaseConfigured;

  return (
    <div id="supabase-manager" className="bg-[#05070c]/90 border border-slate-800 rounded-xl p-5 space-y-6 shadow-xl relative overflow-hidden">
      {/* Absolute aura backdrop */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-950/40 pb-4 bg-rose-950/5 p-3 rounded-lg border border-rose-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-950/20 text-red-400 border border-red-900/40">
            <Database size={18} className={isFetching || isUploading ? 'animate-spin' : ''} />
          </div>
          <div>
            <h3 className="text-sm font-bold font-sans text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="text-rose-400">[DEBUG] SANDBOX DATABASE BRIDGING PANEL</span>
              {!isMockDeactivated ? (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-semibold uppercase">
                  MOCK PLAYGROUND ACTIVE
                </span>
              ) : (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-400 font-semibold uppercase animate-pulse">
                  DEBUG: CONNECTED TO DEV STORAGE
                </span>
              )}
            </h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
              ⚠️ Warning: ONLY prototype aspect tables may be modified. Live scenario tables are server-enforced and cannot be written from browser.
            </p>
          </div>
        </div>

        {/* Global Toggle Button: Deactivate mockup data */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1 border border-slate-850 rounded-lg shrink-0">
          <button
            onClick={() => onToggleMockMode(false)}
            className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase transition-all ${
              !isMockDeactivated 
                ? 'bg-slate-900 text-slate-200 border border-slate-850 shadow' 
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            Use Mock Data
          </button>
          <button
            onClick={() => {
              if (!hasValidCreds) {
                alert("Please declare VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your settings panel or .env first.");
                return;
              }
              onToggleMockMode(true);
            }}
            className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase transition-all ${
              isMockDeactivated 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow animate-pulse' 
                : 'text-slate-500 hover:text-indigo-400'
            }`}
          >
            Deactivate Mock Data
          </button>
        </div>
      </div>

      {/* Connection Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5 space-y-3.5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            Connection Diagnostics
          </div>

          <div className="p-3.5 rounded-xl border border-slate-850 bg-slate-950/50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">SUPABASE CONFIG:</span>
              {hasValidCreds ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[10px]">
                  <CheckCircle2 size={12} />
                  DECLARED VITE_ keys
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-500 font-bold font-mono text-[10px]">
                  <AlertTriangle size={12} className="animate-pulse" />
                  UNCONFIGURED
                </span>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-900/50 space-y-1">
              <div className="truncate"><span className="text-slate-600">URL:</span> {dbUrl || 'MISSING (Configure in Secrets panel)'}</div>
              <div><span className="text-slate-600">ANON:</span> {hasValidCreds ? '••••' + dbUrl.slice(-6) : 'MISSING'}</div>
            </div>

            {/* Instruction Callout when unconfigured */}
            {!hasValidCreds && (
              <div className="p-2.5 rounded-lg bg-indigo-950/20 text-indigo-300 border border-indigo-500/10 text-[9.5px] leading-normal space-y-1 font-mono">
                <div className="flex items-center gap-1 font-bold text-indigo-400 uppercase">
                  <Info size={11} />
                  <span>How to connect:</span>
                </div>
                <p>Add environment variables via AI Studio settings menu:</p>
                <code className="block bg-[#020306] p-1 rounded border border-slate-900 select-all text-slate-300 mt-1">
                  VITE_SUPABASE_URL=...<br />
                  VITE_SUPABASE_ANON_KEY=...
                </code>
              </div>
            )}

            {/* Practical Seeding Operations */}
            <div className="space-y-2 pt-2">
              <button
                onClick={onSeedDatabase}
                disabled={isUploading || !hasValidCreds}
                className={`w-full py-2 bg-slate-900 hover:bg-slate-850 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-800 hover:border-slate-700/80 rounded-lg text-[10px] font-mono font-bold tracking-wider text-slate-200 uppercase flex items-center justify-center gap-1.5 transition-all transition-colors`}
              >
                <UploadCloud size={13} className="text-indigo-400" />
                {isUploading ? 'Seeding Tables...' : 'Seed / Upload Aspects to Supabase'}
              </button>

              {isMockDeactivated && (
                <button
                  onClick={onForceRefresh}
                  disabled={isFetching || !hasValidCreds}
                  className="w-full py-2 bg-indigo-950/20 hover:bg-indigo-900/30 border border-indigo-500/15 disabled:opacity-50 rounded-lg text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
                  Fetch Live DB Dataset
                </button>
              )}
            </div>
          </div>

          {/* Table Logs Console */}
          {operationLogs && (
            <div className="space-y-1">
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">Process Stream Logs</div>
              <pre className="p-2.5 bg-black/80 border border-slate-900 text-[8.5px] text-zinc-400 rounded-lg overflow-y-auto max-h-[105px] font-mono whitespace-pre-wrap leading-tight">
                {operationLogs}
              </pre>
            </div>
          )}
        </div>

        {/* Database Tables Info Panel */}
        <div className="col-span-12 md:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Schema Definitions
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              5 Active Tables
            </span>
          </div>

          {/* Quick Table Selector Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1.5 border-b border-slate-900">
            {SUPABASE_TABLES_INFO.map(table => (
              <button
                key={table.name}
                onClick={() => setSelectedTableTab(table.name)}
                className={`py-1 px-2.5 rounded text-[9.5px] font-mono transition-all shrink-0 font-bold uppercase transition-colors select-none ${
                  selectedTableTab === table.name
                    ? 'bg-slate-905 bg-slate-900/90 text-indigo-400 border border-slate-800'
                    : 'text-slate-500 hover:text-slate-350 bg-transparent'
                }`}
              >
                {table.name}
              </button>
            ))}
          </div>

          {/* Active Table Details */}
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-875 border-slate-850/60 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-250 text-slate-200 font-bold font-sans">
                <Database size={13} className="text-indigo-400" />
                <span>table: {activeTable.name}</span>
              </div>
              <p className="text-[10px] text-slate-450 text-slate-400 font-sans mt-1 leading-normal">
                {activeTable.description}
              </p>
            </div>

            {/* Column properties */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">Columns Structure</div>
              <div className="grid grid-cols-1 gap-1 max-h-[140px] overflow-y-auto pr-1">
                {activeTable.columns.map(col => (
                  <div key={col.name} className="flex items-center justify-between p-1.5 px-2.5 bg-slate-950/80 rounded border border-slate-900 text-[10px] font-mono hover:border-slate-800/80 transition-all">
                    <span className="text-zinc-300 font-bold">{col.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-400 text-[9.5px] font-semibold bg-indigo-950/30 px-1 py-0.2 rounded border border-indigo-950/50 uppercase">{col.type}</span>
                      <span className="text-slate-500 text-[9px] leading-none text-right truncate max-w-[140px]">{col.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SQL script Copy block */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Code size={11} />
                  <span>SQL DDL Creation Script</span>
                </span>
                <button
                  onClick={() => handleCopySql(activeTable.sql, activeTable.name)}
                  className="text-[9px] font-mono text-slate-450 hover:text-indigo-400 bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded flex items-center gap-1 transition-colors transition-all cursor-pointer"
                >
                  {copiedSql === activeTable.name ? (
                    <>
                      <Check size={10} className="text-emerald-400" />
                      <span className="text-emerald-400">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      <span>COPY SQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3 bg-[#020306] border border-slate-900 text-[8.5px] font-mono text-cyan-400 rounded-lg overflow-x-auto select-all max-h-[100px] leading-snug">
                {activeTable.sql}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

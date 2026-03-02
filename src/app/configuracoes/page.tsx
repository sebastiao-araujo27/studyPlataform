'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Key, Trash2, Database, Save, AlertCircle, CheckCircle, Download, Upload, Shield } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { setApiKey, getApiKey, isApiKeyConfigured } from '@/lib/gemini';
import { clearAllCache, getCacheStats } from '@/lib/cache';
import { useProgressStore } from '@/lib/store';

export default function ConfigPage() {
  const [apiKey, setApiKeyState] = useState('');
  const [saved, setSaved] = useState(false);
  const [backupMsg, setBackupMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cacheStats, setCacheStats] = useState({ totalEntries: 0, totalSize: 0, oldestEntry: 0 });
  const { resetProgress } = useProgressStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setApiKeyState(getApiKey());
    setCacheStats(getCacheStats());
  }, []);

  const handleSaveKey = () => {
    setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearCache = () => {
    if (confirm('Limpar todo o cache? O conteúdo será regenerado na próxima visualização.')) {
      clearAllCache();
      setCacheStats(getCacheStats());
    }
  };

  const handleResetProgress = () => {
    if (confirm('Resetar TODO o progresso? Esta ação não pode ser desfeita.')) {
      resetProgress();
    }
  };

  const handleExportProgress = () => {
    try {
      const data = localStorage.getItem('study-platform-progress');
      if (!data) {
        setBackupMsg({ type: 'error', text: 'Nenhum progresso encontrado para exportar.' });
        return;
      }
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `study-platform-backup-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupMsg({ type: 'success', text: 'Backup exportado com sucesso!' });
      setTimeout(() => setBackupMsg(null), 4000);
    } catch {
      setBackupMsg({ type: 'error', text: 'Erro ao exportar backup.' });
    }
  };

  const handleImportProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        // Validate basic structure
        if (!parsed.state || !parsed.state.topicProgress) {
          setBackupMsg({ type: 'error', text: 'Arquivo de backup inválido.' });
          return;
        }
        if (!confirm('Importar este backup vai SUBSTITUIR seu progresso atual. Continuar?')) return;
        localStorage.setItem('study-platform-progress', text);
        setBackupMsg({ type: 'success', text: 'Backup importado! Recarregando...' });
        setTimeout(() => window.location.reload(), 1500);
      } catch {
        setBackupMsg({ type: 'error', text: 'Arquivo inválido. Selecione um backup .json válido.' });
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Breadcrumb items={[{ label: 'Configurações' }]} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Configurações</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Gerencie sua API Key e dados</p>
      </motion.div>

      {/* API Key */}
      <div className="card-static p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Key size={20} className="text-[var(--color-brand)]" />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">API Key do Gemini Pro</h2>
        </div>
        
        <p className="text-xs text-[var(--text-tertiary)]">
          Insira sua API Key do Google Gemini para habilitar a geração de conteúdo. 
          Obtenha em{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-[var(--text-link)] hover:underline">
            aistudio.google.com/apikey
          </a>
        </p>

        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKeyState(e.target.value)}
            placeholder="AIzaSy..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors"
          />
          <button
            onClick={handleSaveKey}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-brand)] text-white text-sm font-medium hover:bg-[var(--color-brand-dark)] transition-colors"
          >
            <Save size={14} />
            Salvar
          </button>
        </div>

        {saved && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[var(--color-success)] text-sm">
            <CheckCircle size={14} />
            API Key salva com sucesso!
          </motion.div>
        )}

        {!isApiKeyConfigured() && (
          <div className="flex items-center gap-2 text-[var(--color-warning)] text-xs">
            <AlertCircle size={14} />
            API Key não configurada. A geração de conteúdo está desabilitada.
          </div>
        )}

        {isApiKeyConfigured() && (
          <div className="flex items-center gap-2 text-[var(--color-success)] text-xs">
            <CheckCircle size={14} />
            API Key configurada e ativa.
          </div>
        )}
      </div>

      {/* Cache Management */}
      <div className="card-static p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-[var(--color-accent)]" />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Cache de Conteúdo</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[var(--bg-surface)]">
            <p className="text-lg font-bold text-[var(--text-primary)]">{cacheStats.totalEntries}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Entradas em cache</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--bg-surface)]">
            <p className="text-lg font-bold text-[var(--text-primary)]">{(cacheStats.totalSize / 1024).toFixed(1)} KB</p>
            <p className="text-xs text-[var(--text-tertiary)]">Tamanho total</p>
          </div>
        </div>

        <button
          onClick={handleClearCache}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)] text-sm border border-[var(--border-default)] hover:text-[var(--color-warning)] hover:border-[var(--color-warning)] transition-colors"
        >
          <Trash2 size={14} />
          Limpar Cache
        </button>
      </div>

      {/* Backup / Restore */}
      <div className="card-static p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-[var(--color-success)]" />
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Backup do Progresso</h2>
        </div>

        <p className="text-xs text-[var(--text-tertiary)]">
          Exporte seu progresso para um arquivo JSON. Use para restaurar em outro navegador, PC, ou após limpar dados.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportProgress}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-success)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={14} />
            Exportar Progresso
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)] text-sm font-medium border border-[var(--border-default)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors"
          >
            <Upload size={14} />
            Importar Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportProgress}
            className="hidden"
          />
        </div>

        {backupMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-2 text-sm ${backupMsg.type === 'success' ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}
          >
            {backupMsg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {backupMsg.text}
          </motion.div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="card-static p-6 space-y-4 border-[var(--color-error)]/30">
        <h2 className="text-lg font-bold text-[var(--color-error)]">Zona de Perigo</h2>
        <p className="text-xs text-[var(--text-tertiary)]">
          Ações irreversíveis. Pense duas vezes antes de prosseguir.
        </p>
        <button
          onClick={handleResetProgress}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--color-error)] text-sm border border-[var(--color-error)]/30 hover:bg-[rgba(239,68,68,0.1)] transition-colors"
        >
          <Trash2 size={14} />
          Resetar Todo Progresso
        </button>
      </div>
    </div>
  );
}

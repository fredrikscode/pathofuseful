import { useState } from 'react';
import { parsePoBCode, type PoBBuild } from '../utils/pob/parser';

interface Props {
  onImport: (build: PoBBuild) => void;
}

export function BuildImport({ onImport }: Props) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImport = async () => {
    if (!code.trim()) {
      setError('Please paste a PoB code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const build = await parsePoBCode(code);
      onImport(build);
      setCode('');
      setIsExpanded(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-bg-tertiary border border-border-primary hover:border-blue-500 rounded px-2 py-1.5 text-xs transition flex items-center gap-1.5"
        title="Import Path of Building"
      >
        <span>📋</span>
        <span>Import PoB</span>
      </button>

      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-bg-secondary border border-border-primary rounded-lg p-3 shadow-lg z-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold">Import Path of Building</h3>
            <button
              onClick={() => {
                setIsExpanded(false);
                setError('');
              }}
              className="text-text-tertiary hover:text-text-primary"
            >
              ✕
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste PoB code or pobb.in URL..."
            className="w-full bg-bg-primary border border-border-primary rounded p-2 text-xs font-mono resize-none focus:border-blue-500 focus:outline-none"
            rows={3}
          />

          {error && (
            <div className="mt-2 text-red-400 text-xs">{error}</div>
          )}

          <button
            onClick={handleImport}
            disabled={loading || !code.trim()}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-border-primary disabled:cursor-not-allowed px-3 py-1.5 rounded text-xs font-semibold transition"
          >
            {loading ? 'Importing...' : 'Import Build'}
          </button>
        </div>
      )}
    </div>
  );
}

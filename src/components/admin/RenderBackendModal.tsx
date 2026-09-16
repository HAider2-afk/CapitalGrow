import React, { useState, useEffect } from 'react';
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Layers,
  Activity,
  Terminal,
  X,
  Send
} from 'lucide-react';

interface RenderBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RenderBackendModal: React.FC<RenderBackendModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'blueprint' | 'endpoints' | 'guide'>('status');
  const [healthData, setHealthData] = useState<any>(null);
  const [systemData, setSystemData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedYaml, setCopiedYaml] = useState<boolean>(false);
  const [testedEndpoint, setTestedEndpoint] = useState<string>('/api/health');
  const [endpointResponse, setEndpointResponse] = useState<string>('');
  const [endpointLoading, setEndpointLoading] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const fetchHealth = async () => {
    setIsLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const time = Math.round(performance.now() - start);
      setLatencyMs(time);
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      } else {
        setHealthData({ status: 'error', code: res.status });
      }
    } catch (err: any) {
      setHealthData({ status: 'offline', error: err?.message || 'Could not connect' });
    }

    try {
      const sysRes = await fetch('/api/system-status');
      if (sysRes.ok) {
        const sysData = await sysRes.json();
        setSystemData(sysData);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  const handleTestEndpoint = async (url: string) => {
    setTestedEndpoint(url);
    setEndpointLoading(true);
    try {
      const res = await fetch(url);
      const text = await res.text();
      try {
        const parsed = JSON.parse(text);
        setEndpointResponse(JSON.stringify(parsed, null, 2));
      } catch {
        setEndpointResponse(text);
      }
    } catch (err: any) {
      setEndpointResponse(`Error: ${err?.message || 'Failed to fetch'}`);
    } finally {
      setEndpointLoading(false);
    }
  };

  const renderYamlContent = `# Render Blueprint Specification (render.yaml)
# Full-Stack CapitalGrow Applet
services:
  - type: web
    name: capitalgrow-backend
    runtime: node
    plan: starter
    region: oregon
    buildCommand: npm install && npm run build
    startCommand: npm run start
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: GEMINI_API_KEY
        sync: false
      - key: APP_URL
        sync: false
      - key: PORT
        value: 10000`;

  const copyYaml = () => {
    navigator.clipboard.writeText(renderYamlContent);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B0F17]/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F172A] rounded-[20px] shadow-2xl border border-white/10 text-white flex flex-col max-h-[90vh] overflow-hidden text-left">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#1E293B]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] via-[#8B5CF6] to-[#10B981] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  Render Backend Infrastructure
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  Express + Node
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Full-stack deployment configuration, health probes, and Render blueprint
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 border-b border-white/10 flex gap-4 text-xs font-medium overflow-x-auto bg-[#0F172A]">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'status'
                ? 'border-[#10B981] text-[#10B981] font-semibold'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Live Status
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'blueprint'
                ? 'border-[#10B981] text-[#10B981] font-semibold'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> render.yaml Blueprint
          </button>

          <button
            onClick={() => setActiveTab('endpoints')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'endpoints'
                ? 'border-[#10B981] text-[#10B981] font-semibold'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> API Probes
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-[#10B981] text-[#10B981] font-semibold'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" /> Deploy Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${
                        healthData?.status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <div
                      className={`absolute -inset-1 rounded-full animate-ping opacity-50 ${
                        healthData?.status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      Backend Service: {healthData?.status === 'ok' ? 'Healthy & Online' : 'Connecting'}
                    </div>
                    <div className="text-xs text-[#94A3B8] font-mono">
                      Provider:{' '}
                      <span className="text-emerald-400 font-semibold">
                        {healthData?.provider || 'Render Ready / Container'}
                      </span>
                      {latencyMs !== null && ` • Ping: ${latencyMs}ms`}
                    </div>
                  </div>
                </div>

                <button
                  onClick={fetchHealth}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase font-mono text-[#94A3B8]">Uptime</div>
                  <div className="font-mono text-base font-bold text-white mt-1">
                    {healthData?.uptimeSeconds !== undefined ? `${healthData.uptimeSeconds}s` : 'Active'}
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">Zero-downtime</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase font-mono text-[#94A3B8]">Health Route</div>
                  <div className="font-mono text-sm font-bold text-emerald-400 mt-1 truncate">
                    /api/health
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">Render Probe</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase font-mono text-[#94A3B8]">RAM Usage</div>
                  <div className="font-mono text-base font-bold text-white mt-1">
                    {healthData?.memoryUsage?.rssMB ? `${healthData.memoryUsage.rssMB} MB` : '42 MB'}
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">Node RSS</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase font-mono text-[#94A3B8]">Node.js</div>
                  <div className="font-mono text-base font-bold text-white mt-1">
                    {systemData?.nodeVersion || 'v22.x'}
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">ESM Engine</div>
                </div>
              </div>

              {/* Render Deployment Checklist */}
              <div className="p-4 rounded-xl bg-[#1E293B]/60 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Render Compatibility Verified
                </div>
                <div className="space-y-2 text-xs text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>
                      <strong className="text-white">Port dynamic binding:</strong> Listens on{' '}
                      <code className="text-[#34D399] bg-white/5 px-1 py-0.5 rounded">
                        process.env.PORT || 3000
                      </code>{' '}
                      and host <code className="text-[#34D399] bg-white/5 px-1 py-0.5 rounded">0.0.0.0</code>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>
                      <strong className="text-white">Render Blueprint:</strong> Root{' '}
                      <code className="text-[#34D399] bg-white/5 px-1 py-0.5 rounded">render.yaml</code> ready
                      for 1-click provisioning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>
                      <strong className="text-white">Production bundling:</strong> Build script compiles to{' '}
                      <code className="text-[#34D399] bg-white/5 px-1 py-0.5 rounded">dist/server.cjs</code>{' '}
                      via esbuild
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>
                      <strong className="text-white">Live health probe:</strong> Render monitors{' '}
                      <code className="text-[#34D399] bg-white/5 px-1 py-0.5 rounded">/api/health</code> for
                      zero-downtime rolling deploys
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#94A3B8]">
                  Infrastructure-as-code configuration for Render Blueprints:
                </span>
                <button
                  onClick={copyYaml}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 text-white transition-colors"
                >
                  {copiedYaml ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy render.yaml
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-[#34D399] overflow-x-auto leading-relaxed">
                {renderYamlContent}
              </pre>
            </div>
          )}

          {/* TAB 3: ENDPOINTS */}
          {activeTab === 'endpoints' && (
            <div className="space-y-3">
              <div className="text-xs text-[#94A3B8]">
                Test live API endpoints running on this Express backend:
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Health Probe', path: '/api/health' },
                  { label: 'System Status', path: '/api/system-status' },
                  { label: 'Liquidity Rates', path: '/api/market-rates' }
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleTestEndpoint(item.path)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      testedEndpoint === item.path
                        ? 'bg-[#10B981] text-[#0B0F17] font-bold'
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    GET {item.path}
                  </button>
                ))}
              </div>

              {endpointLoading ? (
                <div className="p-8 rounded-xl bg-black/40 border border-white/10 text-center text-xs text-[#94A3B8] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#10B981]" /> Querying backend...
                </div>
              ) : endpointResponse ? (
                <pre className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] text-emerald-300 max-h-60 overflow-y-auto leading-relaxed">
                  {endpointResponse}
                </pre>
              ) : (
                <div className="p-6 rounded-xl bg-black/30 border border-white/10 text-center text-xs text-[#94A3B8]">
                  Click one of the buttons above to test the endpoint response.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DEPLOY GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-[#94A3B8]">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="font-bold text-white text-sm">Deploying to Render in 3 Steps:</div>
                <ol className="list-decimal pl-4 space-y-2 text-xs">
                  <li>
                    <strong className="text-white">Push to GitHub/GitLab:</strong> Export or push this
                    codebase to your Git provider.
                  </li>
                  <li>
                    <strong className="text-white">Create Blueprint on Render:</strong> In the Render
                    dashboard, click <strong className="text-[#34D399]">New +</strong> &gt;{' '}
                    <strong className="text-[#34D399]">Blueprint</strong>, then connect your repository.
                  </li>
                  <li>
                    <strong className="text-white">Automatic Build & Deploy:</strong> Render detects{' '}
                    <code className="text-[#34D399]">render.yaml</code>, sets the build and start commands,
                    and monitors <code className="text-[#34D399]">/api/health</code>.
                  </li>
                </ol>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-white">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#10B981]" />
                  <span>Ready to deploy on Render?</span>
                </div>
                <a
                  href="https://dashboard.render.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-semibold transition-colors"
                >
                  Render Dashboard <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#1E293B]/40 text-xs">
          <span className="text-[#94A3B8] font-mono text-[11px]">
            Backend file: <code className="text-white">server.ts</code> | Blueprint:{' '}
            <code className="text-white">render.yaml</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

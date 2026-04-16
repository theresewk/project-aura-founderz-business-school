import { useEffect, useRef, useState } from "react";
import {
  Play,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import { AuraHeader } from "./components/AuraHeader";
import { AnalysisInput } from "./components/AnalysisInput";
import { AppraisalConfig, ConfigToggles } from "./components/AppraisalConfig";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { ANALYSIS_STEPS, MOCK_RESULT } from "./constants/systemPrompt";
import { processMedicalStudy } from "./services/mediphiApi";

type AppPhase = "idle" | "analyzing" | "complete";

function buildAnalysisSteps(config: ConfigToggles) {
  const steps = [ANALYSIS_STEPS[0]];

  if (config.picoElements) {
    steps.push(ANALYSIS_STEPS[1]);
  }

  if (config.methodologicalBias) {
    steps.push(ANALYSIS_STEPS[2]);
  }

  if (config.pValues || config.nntCalculation) {
    steps.push(ANALYSIS_STEPS[3]);
  }

  if (config.conflictOfInterest) {
    steps.push(ANALYSIS_STEPS[4]);
  }

  steps.push(ANALYSIS_STEPS[5]);

  return steps;
}

export default function App() {
  const [abstractText, setAbstractText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [config, setConfig] = useState<ConfigToggles>({
    methodologicalBias: true,
    picoElements: true,
    pValues: true,
    nntCalculation: true,
    conflictOfInterest: false,
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleConfigChange = (key: keyof ConfigToggles, value: boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleRunAppraisal = () => {
    if (enabledChecks === 0) {
      setErrorMsg(
        "Turn on at least one appraisal control before running the demo. Paste a study abstract or load the sample study, then choose which sections you want to generate."
      );
      setPhase("idle");
      setResult(null);
      return;
    }

    if (!abstractText.trim()) {
      setErrorMsg(
        "Please paste a PubMed abstract or load the sample study before running the appraisal."
      );
      return;
    }

    const processed = processMedicalStudy(abstractText);
    if (!processed.valid) {
      setErrorMsg(processed.error ?? "Unable to process the submitted study.");
      return;
    }

    setErrorMsg(null);
    setResult(null);
    setPhase("analyzing");
    setCurrentStep(0);

    const activeSteps = buildAnalysisSteps(config);
    let step = 0;
    const totalSteps = activeSteps.length;

    stepTimerRef.current = setInterval(() => {
      step += 1;
      if (step >= totalSteps) {
        clearInterval(stepTimerRef.current!);
        setCurrentStep(totalSteps);
        setResult(MOCK_RESULT);
        setPhase("complete");

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      } else {
        setCurrentStep(step);
      }
    }, 520);
  };

  const handleReset = () => {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    setPhase("idle");
    setCurrentStep(0);
    setResult(null);
    setErrorMsg(null);
  };

  useEffect(() => {
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, []);

  const isAnalyzing = phase === "analyzing";
  const isComplete = phase === "complete";
  const isBusy = isAnalyzing;
  const enabledChecks = Object.values(config).filter(Boolean).length;
  const activeAnalysisSteps = buildAnalysisSteps(config);

  return (
    <div
      style={{
        backgroundColor: "#F0F7EE",
        minHeight: "100vh",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <AuraHeader analysisComplete={isComplete} />

      <div className="mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6" style={{ maxWidth: "1440px" }}>
        <div className="flex flex-col lg:flex-row gap-4" style={{ alignItems: "flex-start" }}>
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <AnalysisInput
              abstractText={abstractText}
              onAbstractChange={setAbstractText}
              urlInput={urlInput}
              onUrlChange={setUrlInput}
              isAnalyzing={isBusy}
            />

            {errorMsg && (
              <div
                style={{
                  backgroundColor: "#fff1f1",
                  border: "1px solid #fca5a5",
                  borderLeft: "3px solid #ef4444",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <AlertCircle size={15} style={{ color: "#ef4444", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ fontSize: "13px", color: "#991b1b" }}>{errorMsg}</p>
              </div>
            )}

            {(isBusy || isComplete) && (
              <ProgressIndicator
                currentStep={currentStep}
                isComplete={isComplete}
                steps={activeAnalysisSteps}
              />
            )}

            {isComplete && result && (
              <div ref={resultsRef}>
                <ResultsDashboard result={result} config={config} />
              </div>
            )}

            {phase === "idle" && (
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px dashed #c6c6c6",
                  padding: "32px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#e8f4f6",
                    border: "1px solid #C4D7F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                  }}
                >
                  <Play size={20} style={{ color: "#1D8A99" }} />
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#525252",
                    marginBottom: "6px",
                  }}
                >
                  Demo appraisal results will appear here
                </p>
                <p style={{ fontSize: "12px", color: "#8d8d8d", maxWidth: "420px", margin: "0 auto" }}>
                  Paste a PubMed abstract in the input panel, configure your Responsible AI checks,
                  and click "Run Demo Appraisal" to preview the structured evidence dashboard.
                </p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-3" style={{ flexShrink: 0 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex lg:hidden items-center justify-between w-full"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #d1d5db",
                padding: "10px 14px",
                cursor: "pointer",
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              <div className="flex items-center gap-2">
                <Settings size={14} style={{ color: "#1D8A99" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#161616" }}>
                  Analysis Configuration
                </span>
                <span
                  style={{
                    backgroundColor: enabledChecks > 0 ? "#1D8A99" : "#c6c6c6",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "1px 6px",
                  }}
                >
                  {enabledChecks} active
                </span>
              </div>
              {sidebarOpen ? (
                <ChevronUp size={14} style={{ color: "#525252" }} />
              ) : (
                <ChevronDown size={14} style={{ color: "#525252" }} />
              )}
            </button>

            <div className={`flex flex-col gap-3 ${!sidebarOpen ? "hidden lg:flex" : "flex"}`}>
              <AppraisalConfig
                config={config}
                onConfigChange={handleConfigChange}
                isAnalyzing={isBusy}
              />

              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#F0F7EE",
                    borderBottom: "1px solid #d1d5db",
                    padding: "8px 14px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#161616",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Engine Configuration
                  </span>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  {[
                    { label: "Inference Model", value: "MEDIPHI-PubMed" },
                    { label: "Framework", value: "PE2 / EBM v3.1" },
                    { label: "Bias Tool", value: "Cochrane RoB 2.0" },
                    { label: "Deployment Mode", value: "Public Demo", color: "#f59e0b" },
                    { label: "Result Source", value: isComplete ? "Cached Example" : "Demo Ready", color: "#f59e0b" },
                    { label: "Active Checks", value: `${enabledChecks} / 5` },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "5px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ fontSize: "11px", color: "#8d8d8d" }}>{item.label}</span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: item.color ?? "#161616",
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    backgroundColor: "#fffbeb",
                    borderTop: "1px solid #fde68a",
                    padding: "8px 14px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <AlertCircle size={12} style={{ color: "#d97706", flexShrink: 0, marginTop: "1px" }} />
                  <p style={{ fontSize: "10px", color: "#92400e", lineHeight: "1.4" }}>
                    <strong>Public demo build.</strong> This deployment is configured to present the cached appraisal experience used for reviews and video demos.
                  </p>
                </div>
              </div>

              {!isComplete && (
                <button
                  onClick={handleRunAppraisal}
                  disabled={isBusy}
                  style={{
                    width: "100%",
                    backgroundColor: isBusy ? "#156470" : "#1D8A99",
                    color: "#F0F7EE",
                    border: "none",
                    padding: "14px 20px",
                    cursor: isBusy ? "not-allowed" : "pointer",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "background-color 0.2s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (!isBusy) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#156470";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isBusy) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1D8A99";
                    }
                  }}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
                      Generating Demo - Step {Math.min(currentStep + 1, ANALYSIS_STEPS.length)}/
                      {ANALYSIS_STEPS.length}
                    </>
                  ) : (
                    <>
                      <Play size={16} strokeWidth={2.5} />
                      Run Demo Appraisal
                    </>
                  )}
                  {isBusy && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(196,215,242,0.15) 50%, transparent 100%)",
                        animation: "shimmer 1.5s infinite",
                      }}
                    />
                  )}
                </button>
              )}

              {isComplete && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div
                    style={{
                      backgroundColor: "#1c1208",
                      border: "1px solid #f59e0b",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#f59e0b",
                        boxShadow: "0 0 6px #f59e0b",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#fcd34d",
                      }}
                    >
                      {`Demo appraisal shown - ${result?.appraisalScore}/100`}
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    style={{
                      width: "100%",
                      backgroundColor: "transparent",
                      color: "#1D8A99",
                      border: "1px solid #1D8A99",
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e8f4f6";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                  >
                    <RefreshCw size={14} />
                    New Demo Run
                  </button>
                </div>
              )}

              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderTop: "2px solid #C4D7F2",
                  padding: "12px 14px",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#0f4c7a",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Responsible AI Notice
                </p>
                <p style={{ fontSize: "11px", color: "#525252", lineHeight: "1.5" }}>
                  AURA is designed for research assistance only. Outputs do not replace peer
                  review or clinical expertise. Align usage with your institution&apos;s AI governance
                  and data privacy policies.
                </p>
                <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
                  {["Transparency", "Reliability", "Safety"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#1D8A99",
                        border: "1px solid #C4D7F2",
                        padding: "2px 6px",
                        letterSpacing: "0.06em",
                        backgroundColor: "#e8f4f6",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer
        style={{
          backgroundColor: "#1D8A99",
          borderTop: "1px solid #0f5f6b",
          padding: "10px 24px",
          marginTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span style={{ color: "#a8cce0", fontSize: "11px" }}>
          AURA Clinical Evidence Synthesis Engine - Demo Build
        </span>
        <span style={{ color: "#a8cce0", fontSize: "11px" }}>
          For Research Purposes Only · Not for Clinical Use
        </span>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        textarea:focus { outline: none; }
        button { font-family: 'IBM Plex Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f4f4f4; }
        ::-webkit-scrollbar-thumb { background: #c6c6c6; }
        ::-webkit-scrollbar-thumb:hover { background: #8d8d8d; }
        details summary::-webkit-details-marker { color: #6e7681; }
      `}</style>
    </div>
  );
}

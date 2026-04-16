import { useEffect, useRef } from "react";
import { CheckCircle2, Circle, Loader2, Cpu } from "lucide-react";
import { ANALYSIS_STEPS } from "../constants/systemPrompt";

type AnalysisStep = (typeof ANALYSIS_STEPS)[number];

interface ProgressIndicatorProps {
  currentStep: number;
  isComplete: boolean;
  steps: AnalysisStep[];
}

export function ProgressIndicator({
  currentStep,
  isComplete,
  steps,
}: ProgressIndicatorProps) {
  const progressValue = isComplete
    ? 100
    : currentStep < steps.length
      ? steps[currentStep].progress
      : 100;

  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [currentStep]);

  return (
    <div
      style={{
        backgroundColor: "#0d1117",
        border: "1px solid #30363d",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <div
        style={{
          backgroundColor: "#161b22",
          borderBottom: "1px solid #30363d",
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="flex items-center gap-2">
          <Cpu size={13} style={{ color: "#1D8A99" }} />
          <span style={{ color: "#8b949e", fontSize: "11px", letterSpacing: "0.04em" }}>
            MEDIPHI ENGINE - ANALYSIS LOG
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            style={{
              color: "#1D8A99",
              fontSize: "11px",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {progressValue}%
          </span>
          {!isComplete && (
            <Loader2
              size={12}
              style={{ color: "#1D8A99", animation: "spin 1s linear infinite" }}
            />
          )}
        </div>
      </div>

      <div style={{ height: "3px", backgroundColor: "#21262d", position: "relative" }}>
        <div
          style={{
            height: "100%",
            width: `${progressValue}%`,
            backgroundColor: "#1D8A99",
            transition: "width 0.5s ease",
            boxShadow: "0 0 8px rgba(29, 138, 153, 0.6)",
          }}
        />
      </div>

      <div
        ref={logRef}
        style={{
          padding: "12px 16px",
          maxHeight: "200px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
          <span style={{ color: "#4a9eff", fontSize: "11px" }}>SYS</span>
          <span style={{ color: "#6e7681", fontSize: "11px" }}>
            MEDIPHI inference engine initialised - SYSTEM_PROMPT loaded (2,847 tokens)
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
          <span style={{ color: "#4a9eff", fontSize: "11px" }}>SYS</span>
          <span style={{ color: "#6e7681", fontSize: "11px" }}>
            EBM knowledge base v4.2 - Cochrane RoB 2.0 framework active
          </span>
        </div>

        {steps.map((step, idx) => {
          const isStepDone = isComplete || idx < currentStep;
          const isStepActive = !isComplete && idx === currentStep;
          const isStepPending = !isComplete && idx > currentStep;

          if (isStepPending) return null;

          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                opacity: isStepPending ? 0.3 : 1,
                marginBottom: "2px",
              }}
            >
              <span
                style={{
                  color: isStepDone ? "#3fb950" : isStepActive ? "#1D8A99" : "#6e7681",
                  fontSize: "11px",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                {isStepDone ? "OK" : isStepActive ? ">" : "o"}
              </span>
              <div>
                <span
                  style={{
                    color: isStepDone ? "#e6edf3" : isStepActive ? "#79c0ff" : "#6e7681",
                    fontSize: "11px",
                    fontWeight: isStepActive ? 600 : 400,
                  }}
                >
                  [{String(step.id + 1).padStart(2, "0")}] {step.label}
                </span>
                <span style={{ color: "#6e7681", fontSize: "11px" }}>
                  {" "}- {step.description}
                </span>
              </div>
            </div>
          );
        })}

        {isComplete && (
          <>
            <div style={{ height: "1px", backgroundColor: "#21262d", margin: "6px 0" }} />
            <div style={{ display: "flex", gap: "10px" }}>
              <span style={{ color: "#3fb950", fontSize: "11px" }}>OK</span>
              <span style={{ color: "#3fb950", fontSize: "11px", fontWeight: 600 }}>
                DEMO APPRAISAL COMPLETE - Structured report prepared for review. Results below.
              </span>
            </div>
          </>
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid #21262d",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          overflowX: "auto",
        }}
      >
        {steps.map((step, idx) => {
          const isDone = isComplete || idx < currentStep;
          const isActive = !isComplete && idx === currentStep;
          return (
            <div key={step.id} className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-1">
                {isDone ? (
                  <CheckCircle2 size={12} style={{ color: "#3fb950" }} />
                ) : isActive ? (
                  <Loader2
                    size={12}
                    style={{ color: "#1D8A99", animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Circle size={12} style={{ color: "#30363d" }} />
                )}
                <span
                  style={{
                    color: isDone ? "#3fb950" : isActive ? "#79c0ff" : "#30363d",
                    fontSize: "10px",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label.split(" ")[0]}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    width: "16px",
                    height: "1px",
                    backgroundColor: isDone ? "#3fb950" : "#21262d",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

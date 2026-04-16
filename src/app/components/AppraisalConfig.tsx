import { Shield, AlertTriangle, FlaskConical, BarChart2, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";

export interface ConfigToggles {
  methodologicalBias: boolean;
  picoElements: boolean;
  pValues: boolean;
  nntCalculation: boolean;
  conflictOfInterest: boolean;
}

interface AppraisalConfigProps {
  config: ConfigToggles;
  onConfigChange: (key: keyof ConfigToggles, value: boolean) => void;
  isAnalyzing: boolean;
}

interface ToggleItemProps {
  id: keyof ConfigToggles;
  label: string;
  description: string;
  icon: React.ReactNode;
  riskLevel: "critical" | "high" | "standard";
  value: boolean;
  onChange: (val: boolean) => void;
  disabled: boolean;
}

function ToggleItem({
  id,
  label,
  description,
  icon,
  riskLevel,
  value,
  onChange,
  disabled,
}: ToggleItemProps) {
  const riskColors = {
    critical: { bg: "#fff1f1", border: "#fca5a5", dot: "#ef4444", label: "CRITICAL" },
    high: { bg: "#fffbeb", border: "#fcd34d", dot: "#f59e0b", label: "HIGH" },
    standard: { bg: "#f0f7ee", border: "#C4D7F2", dot: "#1D8A99", label: "STANDARD" },
  };
  const colors = riskColors[riskLevel];

  return (
    <div
      style={{
        backgroundColor: value ? colors.bg : "#ffffff",
        border: `1px solid ${value ? colors.border : "#e0e0e0"}`,
        padding: "12px",
        transition: "all 0.2s",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
      onClick={() => !disabled && onChange(!value)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div
            style={{
              color: value ? colors.dot : "#8d8d8d",
              marginTop: "1px",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: value ? "#161616" : "#525252",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: value ? colors.dot : "#8d8d8d",
                  letterSpacing: "0.08em",
                  border: `1px solid ${value ? colors.dot : "#c6c6c6"}`,
                  padding: "1px 4px",
                }}
              >
                {colors.label}
              </span>
            </div>
            <p
              style={{
                fontSize: "11px",
                color: "#525252",
                marginTop: "3px",
                lineHeight: "1.4",
                fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              {description}
            </p>
          </div>
        </div>

        <div
          style={{
            width: "36px",
            height: "20px",
            backgroundColor: value ? "#1D8A99" : "#c6c6c6",
            borderRadius: "2px",
            position: "relative",
            flexShrink: 0,
            transition: "background-color 0.2s",
            border: "1px solid transparent",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: value ? "18px" : "2px",
              width: "14px",
              height: "14px",
              backgroundColor: "#ffffff",
              transition: "left 0.2s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function AppraisalConfig({
  config,
  onConfigChange,
  isAnalyzing,
}: AppraisalConfigProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleItems: ToggleItemProps[] = [
    {
      id: "methodologicalBias",
      label: "Methodological Bias Check",
      description:
        "Evaluate selection, performance, detection, and attrition bias using Cochrane RoB 2.0 framework.",
      icon: <AlertTriangle size={15} strokeWidth={2} />,
      riskLevel: "critical",
      value: config.methodologicalBias,
      onChange: (v) => onConfigChange("methodologicalBias", v),
      disabled: isAnalyzing,
    },
    {
      id: "picoElements",
      label: "Extract PICO Elements",
      description:
        "Deconstruct Population, Intervention, Comparison, and Outcome from the study abstract.",
      icon: <FlaskConical size={15} strokeWidth={2} />,
      riskLevel: "standard",
      value: config.picoElements,
      onChange: (v) => onConfigChange("picoElements", v),
      disabled: isAnalyzing,
    },
    {
      id: "pValues",
      label: "Verify P-Values & CI",
      description:
        "Validate statistical significance thresholds (alpha=0.05) and 95% confidence interval interpretation.",
      icon: <BarChart2 size={15} strokeWidth={2} />,
      riskLevel: "high",
      value: config.pValues,
      onChange: (v) => onConfigChange("pValues", v),
      disabled: isAnalyzing,
    },
    {
      id: "nntCalculation",
      label: "Calculate NNT / ARR / RRR",
      description:
        "Derive Number Needed to Treat, Absolute & Relative Risk Reduction from reported event rates.",
      icon: <BarChart2 size={15} strokeWidth={2} />,
      riskLevel: "standard",
      value: config.nntCalculation,
      onChange: (v) => onConfigChange("nntCalculation", v),
      disabled: isAnalyzing,
    },
    {
      id: "conflictOfInterest",
      label: "Conflict of Interest Screen",
      description:
        "Flag industry funding, author affiliations, and potential publication bias signals.",
      icon: <Shield size={15} strokeWidth={2} />,
      riskLevel: "high",
      value: config.conflictOfInterest,
      onChange: (v) => onConfigChange("conflictOfInterest", v),
      disabled: isAnalyzing,
    },
  ];

  const enabledCount = Object.values(config).filter(Boolean).length;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #d1d5db",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          backgroundColor: "#F0F7EE",
          padding: "10px 16px",
          cursor: "pointer",
          border: "none",
          borderBottom: expanded ? "1px solid #d1d5db" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="flex items-center gap-2">
          <Shield size={14} style={{ color: "#1D8A99" }} strokeWidth={2} />
          <span
            style={{
              color: "#161616",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Responsible AI Configuration
          </span>
          <span
            style={{
              backgroundColor: enabledCount > 0 ? "#1D8A99" : "#c6c6c6",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: 700,
              padding: "1px 6px",
              minWidth: "20px",
              textAlign: "center",
            }}
          >
            {enabledCount}/{toggleItems.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} style={{ color: "#525252" }} />
        ) : (
          <ChevronDown size={14} style={{ color: "#525252" }} />
        )}
      </button>

      {expanded && (
        <>
          <div
            style={{
              backgroundColor: "#e8f4f6",
              borderBottom: "1px solid #b3d9df",
              padding: "8px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Info size={12} style={{ color: "#1D8A99", marginTop: "1px", flexShrink: 0 }} />
            <p style={{ color: "#0f4c5e", fontSize: "11px", lineHeight: "1.4" }}>
              These guardrails align with Microsoft&apos;s Responsible AI principles and the
              PE2 Evidence-Based Interrogation Framework. Disabling checks may reduce
              appraisal accuracy.
            </p>
          </div>

          <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {toggleItems.map((item) => (
              <ToggleItem key={item.id} {...item} />
            ))}
          </div>

          <div
            style={{
              borderTop: "1px solid #e0e0e0",
              padding: "8px 16px",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            {[
              {
                label: "Enable All",
                action: () => {
                  if (!isAnalyzing) {
                    (Object.keys(config) as (keyof ConfigToggles)[]).forEach((k) =>
                      onConfigChange(k, true)
                    );
                  }
                },
              },
              {
                label: "Disable All",
                action: () => {
                  if (!isAnalyzing) {
                    (Object.keys(config) as (keyof ConfigToggles)[]).forEach((k) =>
                      onConfigChange(k, false)
                    );
                  }
                },
              },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                disabled={isAnalyzing}
                style={{
                  color: "#1D8A99",
                  fontSize: "11px",
                  fontWeight: 500,
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: isAnalyzing ? "not-allowed" : "pointer",
                  padding: "2px 0",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  textDecoration: "underline",
                  opacity: isAnalyzing ? 0.5 : 1,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

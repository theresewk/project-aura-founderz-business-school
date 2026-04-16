import { useState } from "react";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  TrendingDown,
  Award,
  BookOpen,
  ChevronRight,
  Beaker,
  Info,
} from "lucide-react";
import { MOCK_RESULT } from "../constants/systemPrompt";
import type { ConfigToggles } from "./AppraisalConfig";

type ResultData = typeof MOCK_RESULT;

interface ResultsDashboardProps {
  result: ResultData;
  config: ConfigToggles;
}

function RiskBadge({ risk }: { risk: "Low" | "Moderate" | "High" }) {
  const map = {
    Low: { bg: "#dcfce7", color: "#166534", border: "#86efac", icon: <CheckCircle2 size={11} /> },
    Moderate: { bg: "#fef9c3", color: "#854d0e", border: "#fde047", icon: <MinusCircle size={11} /> },
    High: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5", icon: <XCircle size={11} /> },
  };
  const s = map[risk];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontSize: "10px",
        fontWeight: 700,
        padding: "2px 6px",
        letterSpacing: "0.06em",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {s.icon}
      {risk.toUpperCase()} RISK
    </span>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#1D8A99" : score >= 60 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 38;
  const strokeDash = (score / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <div style={{ position: "relative", width: "96px", height: "96px" }}>
        <svg width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="38" fill="none" stroke="#e0e0e0" strokeWidth="6" />
          <circle
            cx="48"
            cy="48"
            r="38"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="square"
            transform="rotate(-90 48 48)"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color,
              fontFamily: "'IBM Plex Mono', monospace",
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span style={{ fontSize: "9px", color: "#8d8d8d", letterSpacing: "0.04em" }}>
            /100
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {score >= 80 ? "HIGH QUALITY" : score >= 60 ? "MODERATE" : "LOW QUALITY"}
      </span>
    </div>
  );
}

function SectionHeader({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 0",
        borderBottom: "2px solid #1D8A99",
        marginBottom: "12px",
      }}
    >
      <span style={{ color: "#1D8A99" }}>{icon}</span>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#161616",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: "'IBM Plex Sans', sans-serif",
        }}
      >
        {label}
      </span>
      {badge && (
        <span
          style={{
            marginLeft: "auto",
            fontSize: "9px",
            fontWeight: 700,
            color: "#1D8A99",
            border: "1px solid #1D8A99",
            padding: "1px 6px",
            letterSpacing: "0.06em",
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function RawEvidencePanel({
  result,
  config,
}: {
  result: ResultData;
  config: ConfigToggles;
}) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #d1d5db",
        fontFamily: "'IBM Plex Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          backgroundColor: "#F0F7EE",
          borderBottom: "1px solid #d1d5db",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <FileText size={14} style={{ color: "#1D8A99" }} />
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#161616",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Raw Evidence Summary
        </span>
      </div>

      <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
        <div
          style={{
            backgroundColor: "#f0f7ee",
            border: "1px solid #C4D7F2",
            borderLeft: "3px solid #1D8A99",
            padding: "12px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#161616",
              lineHeight: "1.4",
              marginBottom: "8px",
            }}
          >
            {result.studyTitle}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {[
              { label: "Journal", value: result.journal },
              { label: "Published", value: result.publicationDate },
              { label: "DOI", value: result.doi },
              { label: "Design", value: result.studyDesign },
              { label: "N", value: result.sampleSize.toLocaleString() },
              { label: "Follow-up", value: result.followUpPeriod },
            ].map((item) => (
              <div key={item.label}>
                <span style={{ fontSize: "10px", color: "#8d8d8d", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", display: "block" }}>
                  {item.label}
                </span>
                <span style={{ fontSize: "12px", color: "#161616" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            backgroundColor: "#e8f4f6",
            border: "1px solid #b3d9df",
            marginBottom: "16px",
          }}
        >
          <Award size={14} style={{ color: "#1D8A99" }} />
          <div>
            <span style={{ fontSize: "10px", color: "#8d8d8d", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Evidence Level
            </span>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#1D8A99" }}>
              {result.evidenceLevel}
            </p>
          </div>
        </div>

        <SectionHeader icon={<BookOpen size={13} />} label="Structured Abstract" />
        <div
          style={{
            backgroundColor: "#fafafa",
            border: "1px solid #e0e0e0",
            padding: "14px",
            marginBottom: "16px",
          }}
        >
          {result.rawSummary.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: "12px",
                color: "#161616",
                lineHeight: "1.7",
                marginBottom: i < result.rawSummary.split("\n\n").length - 1 ? "12px" : 0,
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {config.pValues && (
          <>
            <SectionHeader icon={<TrendingDown size={13} />} label="Statistical Outcomes" />
            <div style={{ border: "1px solid #e0e0e0", marginBottom: "16px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1.5fr 1.2fr",
                  backgroundColor: "#f4f4f4",
                  borderBottom: "1px solid #e0e0e0",
                  padding: "6px 12px",
                }}
              >
                {["Endpoint", "Result", "95% CI", "P-Value"].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#525252",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              {result.statisticalResults.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1.5fr 1.2fr",
                    padding: "8px 12px",
                    borderBottom: i < result.statisticalResults.length - 1 ? "1px solid #f0f0f0" : "none",
                    backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "11px", color: "#161616", fontWeight: 500 }}>
                      {r.measure}
                    </span>
                    <p style={{ fontSize: "10px", color: "#8d8d8d", marginTop: "2px", lineHeight: "1.3" }}>
                      {r.interpretation}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#1D8A99",
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    {r.value}
                  </span>
                  <span style={{ fontSize: "11px", color: "#525252", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {r.ci || "-"}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: r.pValue?.includes("0.028") ? "#f59e0b" : "#166534",
                      fontWeight: 600,
                    }}
                  >
                    {r.pValue}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {config.methodologicalBias && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <SectionHeader icon={<CheckCircle2 size={13} />} label="Strengths" />
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                {result.keyStrengths.map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <ChevronRight size={11} style={{ color: "#1D8A99", flexShrink: 0, marginTop: "3px" }} />
                    <span style={{ fontSize: "11px", color: "#161616", lineHeight: "1.4" }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader icon={<AlertTriangle size={13} />} label="Limitations" />
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                {result.keyLimitations.map((l, i) => (
                  <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <ChevronRight size={11} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "3px" }} />
                    <span style={{ fontSize: "11px", color: "#161616", lineHeight: "1.4" }}>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CriticalAppraisalPanel({
  result,
  config,
}: {
  result: ResultData;
  config: ConfigToggles;
}) {
  const [expandedBias, setExpandedBias] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #d1d5db", fontFamily: "'IBM Plex Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ backgroundColor: "#1D8A99", borderBottom: "1px solid #0f5f6b", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <ShieldCheck size={14} style={{ color: "#F0F7EE" }} />
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#F0F7EE", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Critical Appraisal Scorecard
        </span>
        <span style={{ marginLeft: "auto", fontSize: "10px", backgroundColor: "#156470", color: "#C4D7F2", padding: "2px 6px", letterSpacing: "0.04em" }}>
          MEDIPHI v2.4
        </span>
      </div>

      <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
        <div style={{ backgroundColor: "#f0f7ee", border: "1px solid #C4D7F2", padding: "16px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
          <ScoreGauge score={result.appraisalScore} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "10px", color: "#8d8d8d", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
              Appraisal Quality Score
            </p>
            <p style={{ fontSize: "12px", color: "#161616", lineHeight: "1.5", marginBottom: "8px" }}>
              {result.clinicalSignificance}
            </p>
            {config.methodologicalBias && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "10px", color: "#8d8d8d" }}>Overall Bias:</span>
                <RiskBadge risk={result.overallBiasRisk} />
              </div>
            )}
          </div>
        </div>

        {config.picoElements && (
          <>
            <SectionHeader icon={<Beaker size={13} />} label="PICO Breakdown" badge="EXTRACTED" />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {[
                { key: "P", label: "Population", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", value: result.pico.population },
                { key: "I", label: "Intervention", color: "#0369a1", bg: "#e0f2fe", border: "#bae6fd", value: result.pico.intervention },
                { key: "C", label: "Comparison", color: "#0f766e", bg: "#f0fdfa", border: "#99f6e4", value: result.pico.comparison },
                { key: "O", label: "Outcome", color: "#b45309", bg: "#fffbeb", border: "#fde68a", value: result.pico.outcome },
              ].map((item) => (
                <div key={item.key} style={{ display: "flex", gap: "10px", backgroundColor: item.bg, border: `1px solid ${item.border}`, borderLeft: `3px solid ${item.color}`, padding: "10px" }}>
                  <div style={{ width: "24px", height: "24px", backgroundColor: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 800, fontFamily: "'IBM Plex Serif', serif", lineHeight: 1 }}>
                      {item.key}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: item.color, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "3px" }}>
                      {item.label}
                    </span>
                    <p style={{ fontSize: "11px", color: "#161616", lineHeight: "1.5" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {config.nntCalculation && (
          <>
            <SectionHeader icon={<TrendingDown size={13} />} label="NNT Calculation" badge="COMPUTED" />
            <div style={{ backgroundColor: "#f0f7ee", border: "1px solid #C4D7F2", padding: "14px", marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "12px" }}>
                {[
                  { label: "NNT", value: result.nnt.value.toString(), sub: `over ${result.nnt.period}`, highlight: true },
                  { label: "ARR", value: result.nnt.arr, sub: "Absolute Risk Reduction", highlight: false },
                  { label: "RRR", value: result.nnt.rrr, sub: "Relative Risk Reduction", highlight: false },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: "center", padding: "10px 6px", backgroundColor: stat.highlight ? "#1D8A99" : "#ffffff", border: `1px solid ${stat.highlight ? "#1D8A99" : "#e0e0e0"}` }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: stat.highlight ? "#F0F7EE" : "#1D8A99", fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: stat.highlight ? "#C4D7F2" : "#8d8d8d", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "4px" }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: "9px", color: stat.highlight ? "#a8d8e0" : "#8d8d8d", marginTop: "2px" }}>
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", backgroundColor: "#e8f4f6", padding: "8px", border: "1px solid #b3d9df" }}>
                <Info size={11} style={{ color: "#1D8A99", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ fontSize: "11px", color: "#0f4c5e", lineHeight: "1.5" }}>{result.nnt.context}</p>
              </div>
            </div>
          </>
        )}

        {config.methodologicalBias && (
          <>
            <SectionHeader icon={<AlertTriangle size={13} />} label="Bias Risk Assessment" badge="COCHRANE RoB 2.0" />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
              {result.biasAssessments.map((b, i) => (
                <div key={i} style={{ border: "1px solid #e0e0e0", cursor: "pointer", transition: "all 0.15s" }} onClick={() => setExpandedBias(expandedBias === i ? null : i)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", backgroundColor: expandedBias === i ? "#f0f7ee" : "#fafafa" }}>
                    {b.risk === "Low" ? (
                      <CheckCircle2 size={14} style={{ color: "#166534", flexShrink: 0 }} />
                    ) : b.risk === "Moderate" ? (
                      <MinusCircle size={14} style={{ color: "#854d0e", flexShrink: 0 }} />
                    ) : (
                      <XCircle size={14} style={{ color: "#991b1b", flexShrink: 0 }} />
                    )}
                    <span style={{ flex: 1, fontSize: "12px", fontWeight: 500, color: "#161616" }}>{b.domain}</span>
                    <RiskBadge risk={b.risk} />
                    <ChevronRight size={13} style={{ color: "#8d8d8d", transform: expandedBias === i ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                  </div>
                  {expandedBias === i && (
                    <div style={{ padding: "10px 12px 10px 34px", borderTop: "1px solid #e0e0e0", backgroundColor: "#ffffff" }}>
                      <p style={{ fontSize: "11px", color: "#525252", lineHeight: "1.6" }}>{b.justification}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {config.conflictOfInterest && (
          <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fcd34d", borderLeft: "3px solid #f59e0b", padding: "10px 12px", marginBottom: "4px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <AlertTriangle size={13} style={{ color: "#854d0e", flexShrink: 0, marginTop: "1px" }} />
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#854d0e", letterSpacing: "0.04em", marginBottom: "3px" }}>
                RESPONSIBLE AI ALERT - CONFLICT OF INTEREST
              </p>
              <p style={{ fontSize: "11px", color: "#854d0e", lineHeight: "1.4" }}>
                {result.fundingSource}. Independent replication is advisable before clinical guideline adoption.
              </p>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0", padding: "8px 12px", marginTop: "12px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <ShieldCheck size={11} style={{ color: "#8d8d8d", flexShrink: 0, marginTop: "1px" }} />
          <p style={{ fontSize: "10px", color: "#8d8d8d", lineHeight: "1.4" }}>
            This appraisal is generated by AURA/MEDIPHI for research purposes only. It does not constitute clinical advice, diagnosis, or treatment recommendation. Always defer to qualified clinical judgment and current institutional guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ResultsDashboard({ result, config }: ResultsDashboardProps) {
  return (
    <div>
      <div style={{ backgroundColor: "#e8f4f6", border: "1px solid #b3d9df", borderLeft: "3px solid #1D8A99", padding: "10px 16px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
        <ShieldCheck size={15} style={{ color: "#1D8A99" }} />
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f4c5e" }}>Critical Appraisal Complete</p>
          <p style={{ fontSize: "11px", color: "#525252" }}>
            MEDIPHI Engine has synthesised the following structured evidence report. Review both panels and apply clinical judgment before use.
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#1D8A99", padding: "4px 10px", flexShrink: 0 }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#F0F7EE", letterSpacing: "0.04em" }}>
            QUALITY SCORE: {result.appraisalScore}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RawEvidencePanel result={result} config={config} />
        <CriticalAppraisalPanel result={result} config={config} />
      </div>
    </div>
  );
}

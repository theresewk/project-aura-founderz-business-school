import { useState } from "react";
import { FileText, Link2, X, ClipboardPaste, Info } from "lucide-react";

interface AnalysisInputProps {
  abstractText: string;
  onAbstractChange: (text: string) => void;
  urlInput: string;
  onUrlChange: (url: string) => void;
  isAnalyzing: boolean;
}

const PLACEHOLDER_ABSTRACT = `Paste your PubMed abstract here...

Example:
BACKGROUND: Heart failure with reduced ejection fraction (HFrEF) remains associated with high morbidity and mortality despite advances in medical therapy. The role of SGLT2 inhibitors in non-diabetic HFrEF patients requires further investigation.

METHODS: We conducted a randomised, double-blind, placebo-controlled trial...

RESULTS: Among 3,730 patients randomised, the primary composite endpoint occurred in fewer patients in the empagliflozin group...

CONCLUSIONS: Empagliflozin significantly reduced the risk of cardiovascular death or hospitalisation for heart failure...`;

const SAMPLE_ABSTRACT = `BACKGROUND: Heart failure with reduced ejection fraction (HFrEF; LVEF <=40%) carries a 5-year mortality of approximately 50%, representing a significant public health burden. SGLT2 inhibitors have demonstrated benefit in large trials, but mechanistic understanding in non-diabetic populations remains incomplete.

METHODS: The CARDIO-PROTECT trial was a phase III, randomised, double-blind, placebo-controlled, multi-centre study (n=3,730). Adults >=18 years with stable HFrEF on guideline-directed medical therapy (GDMT) >=3 months were randomised 1:1 to empagliflozin 10 mg once daily or matching placebo. Stratified by LVEF strata and geographic region. Primary endpoint: composite of CV death or first hospitalisation for worsening heart failure (wHF). Follow-up: median 18 months.

RESULTS: Among 3,730 patients randomised (mean age 64.2 years; 78% male; 41% with type 2 diabetes), empagliflozin significantly reduced the primary composite endpoint vs. placebo (HR 0.75; 95% CI 0.65-0.86; p<0.001), representing an absolute risk reduction of 4.8% (NNT=21). Cardiovascular death was reduced (HR 0.82; 95% CI 0.69-0.98; p=0.028). Total HF hospitalisations were reduced by 30% (RR 0.70; 95% CI 0.58-0.85; p<0.001). KCCQ total symptom score improved by a mean of 4.2 points at 8 weeks (p<0.001). Adverse events were balanced; genital mycotic infections were more frequent with empagliflozin (4.2% vs 0.8%).

CONCLUSIONS: Empagliflozin significantly reduced CV death and HF hospitalisations in patients with HFrEF, regardless of diabetes status. These findings support the incorporation of empagliflozin into standard-of-care GDMT for HFrEF.

FUNDING: Supported by Academic Cardiovascular Research Consortium. Empagliflozin supplied by Boehringer Ingelheim (no editorial influence).
TRIAL REGISTRATION: ClinicalTrials.gov NCT04219137`;

export function AnalysisInput({
  abstractText,
  onAbstractChange,
  urlInput,
  onUrlChange,
  isAnalyzing,
}: AnalysisInputProps) {
  const [activeTab, setActiveTab] = useState<"paste" | "url">("paste");
  const [charCount, setCharCount] = useState(abstractText.length);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAbstractChange(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleLoadSample = () => {
    onAbstractChange(SAMPLE_ABSTRACT);
    setCharCount(SAMPLE_ABSTRACT.length);
  };

  const handleClear = () => {
    onAbstractChange("");
    setCharCount(0);
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #d1d5db",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#F0F7EE",
          borderBottom: "1px solid #d1d5db",
          padding: "10px 16px",
        }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <FileText size={14} style={{ color: "#1D8A99" }} strokeWidth={2} />
          <span
            style={{
              color: "#161616",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Study Input
          </span>
          <span
            style={{
              backgroundColor: "#C4D7F2",
              color: "#0f4c7a",
              fontSize: "10px",
              fontWeight: 600,
              padding: "1px 6px",
              letterSpacing: "0.04em",
            }}
          >
            REQUIRED
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLoadSample}
            disabled={isAnalyzing}
            style={{
              color: "#1D8A99",
              fontSize: "12px",
              padding: "3px 10px",
              border: "1px solid #1D8A99",
              backgroundColor: "transparent",
              cursor: isAnalyzing ? "not-allowed" : "pointer",
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 500,
              opacity: isAnalyzing ? 0.5 : 1,
            }}
          >
            Load Sample
          </button>
          {abstractText && (
            <button
              onClick={handleClear}
              disabled={isAnalyzing}
              style={{
                color: "#525252",
                padding: "4px",
                backgroundColor: "transparent",
                border: "none",
                cursor: isAnalyzing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #d1d5db" }} className="flex">
        {[
          { id: "paste" as const, icon: <ClipboardPaste size={13} />, label: "Paste Abstract" },
          { id: "url" as const, icon: <Link2 size={13} />, label: "Fetch from URL" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "9px 16px",
              fontSize: "12px",
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#1D8A99" : "#525252",
              backgroundColor: activeTab === tab.id ? "#F0F7EE" : "transparent",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: activeTab === tab.id ? "2px solid #1D8A99" : "2px solid transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'IBM Plex Sans', sans-serif",
              transition: "color 0.15s, background-color 0.15s",
              marginBottom: "-1px",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px" }}>
        {activeTab === "paste" ? (
          <div>
            <textarea
              value={abstractText}
              onChange={handleTextChange}
              disabled={isAnalyzing}
              placeholder={PLACEHOLDER_ABSTRACT}
              style={{
                width: "100%",
                minHeight: "220px",
                backgroundColor: isAnalyzing ? "#f4f4f4" : "#fafafa",
                border: "1px solid #c6c6c6",
                padding: "12px",
                fontSize: "13px",
                fontFamily: "'IBM Plex Mono', monospace",
                color: "#161616",
                resize: "vertical",
                outline: "none",
                lineHeight: "1.6",
                cursor: isAnalyzing ? "not-allowed" : "text",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                if (!isAnalyzing) e.target.style.borderColor = "#1D8A99";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#c6c6c6";
              }}
            />
            <div className="flex items-center justify-between" style={{ marginTop: "6px" }}>
              <div className="flex items-center gap-1">
                <Info size={11} style={{ color: "#8d8d8d" }} />
                <span style={{ color: "#8d8d8d", fontSize: "11px" }}>
                  Paste full PubMed abstract including BACKGROUND, METHODS, RESULTS, CONCLUSIONS
                </span>
              </div>
              <span
                style={{
                  color: charCount > 100 ? "#1D8A99" : "#8d8d8d",
                  fontSize: "11px",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {charCount.toLocaleString()} chars
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                backgroundColor: "#fff8e1",
                border: "1px solid #f0c040",
                padding: "8px 12px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Info size={13} style={{ color: "#856404" }} />
              <span style={{ color: "#856404", fontSize: "12px" }}>
                URL fetching requires a backend integration. This is a placeholder for the
                PubMed E-utilities API endpoint.
              </span>
            </div>
            <div className="flex gap-0">
              <div
                style={{
                  backgroundColor: "#e8e8e8",
                  border: "1px solid #c6c6c6",
                  borderRight: "none",
                  padding: "9px 12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Link2 size={14} style={{ color: "#525252" }} />
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="https://pubmed.ncbi.nlm.nih.gov/PMID/ or DOI link"
                disabled
                style={{
                  flex: 1,
                  border: "1px solid #c6c6c6",
                  padding: "9px 12px",
                  fontSize: "13px",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  color: "#525252",
                  backgroundColor: "#f4f4f4",
                  outline: "none",
                  cursor: "not-allowed",
                }}
              />
              <button
                disabled
                style={{
                  backgroundColor: "#c6c6c6",
                  color: "#6f6f6f",
                  border: "1px solid #c6c6c6",
                  padding: "9px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "not-allowed",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  letterSpacing: "0.04em",
                }}
              >
                FETCH
              </button>
            </div>
            <p style={{ color: "#8d8d8d", fontSize: "11px", marginTop: "6px" }}>
              Supported: PubMed PMID URLs, DOI links, ClinicalTrials.gov NCT IDs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Activity } from "lucide-react";

interface AuraHeaderProps {
  analysisComplete: boolean;
}

function getSessionDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `RES-${year}-${month}-${day}`;
}

export function AuraHeader({ analysisComplete }: AuraHeaderProps) {
  const sessionDate = getSessionDate();

  return (
    <header
      style={{ backgroundColor: "#1D8A99", fontFamily: "'IBM Plex Sans', sans-serif" }}
      className="w-full border-b-2 border-b-[#0f5f6b]"
    >
      <div
        style={{ backgroundColor: "#156470" }}
        className="hidden md:flex items-center justify-between px-6 py-1"
      >
        <span style={{ color: "#C4D7F2", fontSize: "11px", letterSpacing: "0.02em" }}>
          AURA CLINICAL EVIDENCE SYNTHESIS ENGINE - v.1 © 2026
        </span>
        <div className="flex items-center gap-6">
          <span style={{ color: "#C4D7F2", fontSize: "11px" }}>
            Session: {sessionDate}
          </span>
          <span
            style={{
              color: "#F0F7EE",
              fontSize: "11px",
              backgroundColor: analysisComplete ? "#0f5f6b" : "#0f5f6b",
            }}
            className="flex items-center gap-1"
          >
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: analysisComplete ? "#4ade80" : "#facc15",
                boxShadow: analysisComplete ? "0 0 6px #4ade80" : "0 0 6px #facc15",
              }}
            />
            {analysisComplete ? "APPRAISAL COMPLETE" : "STANDBY"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: "#F0F7EE",
              border: "1.5px solid #C4D7F2",
              padding: "6px",
            }}
          >
            <Activity style={{ color: "#1D8A99" }} size={20} strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1
                style={{
                  color: "#F0F7EE",
                  fontFamily: "'IBM Plex Serif', serif",
                  fontSize: "22px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                AURA
              </h1>
              <span
                style={{
                  color: "#C4D7F2",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Clinical Evidence Synthesis
              </span>
            </div>
            <p
              style={{
                color: "#a8cce0",
                fontSize: "11px",
                letterSpacing: "0.01em",
                marginTop: "2px",
              }}
              className="hidden sm:block"
            >
              Evidence-Based Medicine · Critical Appraisal Demo
            </p>
          </div>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: analysisComplete ? "#4ade80" : "#facc15",
              boxShadow: analysisComplete ? "0 0 6px #4ade80" : "0 0 6px #facc15",
            }}
          />
        </div>
      </div>

      <div
        style={{ backgroundColor: "#17737e", borderTop: "1px solid #2aa4b3" }}
        className="px-4 md:px-8 py-1.5 flex items-center gap-2"
      >
        {["Research Tools", "Critical Appraisal", "MEDIPHI Engine"].map((item, i, arr) => (
          <span key={item} className="flex items-center gap-2">
            <span
              style={{
                color: i === arr.length - 1 ? "#F0F7EE" : "#a8cce0",
                fontSize: "12px",
                letterSpacing: "0.01em",
              }}
            >
              {item}
            </span>
            {i < arr.length - 1 && (
              <span style={{ color: "#2aa4b3", fontSize: "12px" }}>/</span>
            )}
          </span>
        ))}
      </div>
    </header>
  );
}

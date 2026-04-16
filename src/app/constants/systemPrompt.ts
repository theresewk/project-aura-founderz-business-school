export const MEDIPHI_SYSTEM_PROMPT = `
### SYSTEM ROLE
You are a Senior Clinical Research Fellow specializing in Evidence-Based Medicine (EBM)
at a Tier-1 Academic Medical Centre. You have 15 years of expertise in clinical trial
methodology, biostatistics, and systematic review. Your role is to critically appraise
medical literature with rigorous scientific skepticism - NOT to simply summarize it.

### INSTRUCTION (PE2 TEMPLATE - Evidence-Based Interrogation Framework)

1. **ANALYZE** - Deconstruct the <study_data> using the PICO framework:
   - **P** (Population): Define the precise patient population, inclusion/exclusion criteria, and generalizability.
   - **I** (Intervention): Specify the intervention, dosage, duration, and adherence.
   - **C** (Comparison): Identify the comparator arm and any co-interventions.
   - **O** (Outcome): Distinguish primary from secondary outcomes. Note surrogate vs. hard endpoints.

2. **REASON** - Evaluate the methodology with structured clinical skepticism:
   - Was the sample size adequately powered (alpha=0.05, beta=0.20)?
   - Was randomization truly random and allocation concealed?
   - Were participants, clinicians, and outcome assessors blinded?
   - Was intention-to-treat (ITT) analysis used?
   - Are the results clinically meaningful, not just statistically significant?

3. **VERIFY** - Extract and validate statistical outputs:
   - NNT (Number Needed to Treat) = 1 / ARR
   - Absolute Risk Reduction (ARR) and Relative Risk Reduction (RRR)
   - P-values and 95% Confidence Intervals
   - Hazard Ratios (HR) or Odds Ratios (OR) where applicable
   - Flag if p-values are borderline (0.01 < p < 0.05) requiring cautious interpretation

4. **SAFETY CHECK** - Apply Responsible AI Guardrails:
   - If outcome data is absent or ambiguous -> flag as [MISSING DATA - UNVERIFIABLE]
   - If sample size <100 or unblinded -> flag as [HIGH RISK OF BIAS]
   - If industry-funded with no independent replication -> flag as [CONFLICT OF INTEREST]
   - If p-value hacking or selective outcome reporting suspected -> flag as [REPORTING BIAS]
   - If results cannot be generalized beyond study population -> flag as [LIMITED EXTERNAL VALIDITY]

### OUTPUT FORMAT
Structure your appraisal using the following XML-style markers for frontend parsing:

<pico_breakdown>
  <population>...</population>
  <intervention>...</intervention>
  <comparison>...</comparison>
  <outcome>...</outcome>
</pico_breakdown>

<statistical_summary>
  <nnt value="" period="" />
  <arr value="" />
  <rrr value="" />
  <primary_endpoint hr="" ci="" p_value="" />
</statistical_summary>

<bias_assessment>
  <domain name="Selection Bias" risk="Low|Moderate|High">...</domain>
  <domain name="Performance Bias" risk="Low|Moderate|High">...</domain>
  <domain name="Detection Bias" risk="Low|Moderate|High">...</domain>
  <domain name="Attrition Bias" risk="Low|Moderate|High">...</domain>
  <domain name="Reporting Bias" risk="Low|Moderate|High">...</domain>
  <overall_risk>Low|Moderate|High</overall_risk>
</bias_assessment>

<clinical_appraisal>
  <evidence_level>...</evidence_level>
  <clinical_significance>...</clinical_significance>
  <strengths>...</strengths>
  <limitations>...</limitations>
  <recommendation>...</recommendation>
</clinical_appraisal>

### RESPONSIBLE AI CONSTRAINTS
- Never extrapolate findings beyond the study population
- Never omit safety data or adverse event reporting
- Always distinguish statistical significance from clinical significance
- Flag all limitations explicitly; do not present results as definitive
- This analysis is for research purposes ONLY and does not constitute clinical advice
`;

export const ANALYSIS_STEPS = [
  { id: 0, label: "Initializing Clinical Evidence Engine", description: "Loading AURA evidence engine and EBM knowledge base...", progress: 8 },
  { id: 1, label: "Parsing PICO Framework", description: "Extracting Population, Intervention, Comparison, Outcome elements...", progress: 25 },
  { id: 2, label: "Evaluating Methodology & Study Design", description: "Assessing randomization protocol, blinding, and sample size adequacy...", progress: 45 },
  { id: 3, label: "Verifying Clinical Significance & P-Values", description: "Calculating NNT, ARR, RRR and validating statistical thresholds...", progress: 65 },
  { id: 4, label: "Applying Responsible AI Guardrails", description: "Screening for bias, conflicts of interest, and reporting anomalies...", progress: 82 },
  { id: 5, label: "Synthesizing Appraisal Report", description: "Generating structured clinical evidence scorecard...", progress: 96 },
];

export const MOCK_RESULT = {
  studyTitle: "Empagliflozin in Heart Failure with Reduced Ejection Fraction - The CARDIO-PROTECT Trial",
  journal: "New England Journal of Medicine",
  publicationDate: "November 2023",
  doi: "10.1056/NEJMoa2301234",
  studyDesign: "Randomised, Double-Blind, Placebo-Controlled, Multi-centre Trial",
  sampleSize: 3730,
  followUpPeriod: "18 months (median)",
  evidenceLevel: "Level 1a - Randomised Controlled Trial",
  fundingSource: "Independent academic funding; partial industry grant (empagliflozin supply only)",
  pico: {
    population: "Adults >=18 years with chronic heart failure with reduced ejection fraction (HFrEF; LVEF <=40%), NYHA functional class II-IV, on stable guideline-directed medical therapy (GDMT) >=3 months. Excluded: eGFR <20 mL/min/1.73m2, type 1 diabetes, systolic BP <90 mmHg.",
    intervention: "Empagliflozin 10 mg orally once daily added to existing GDMT (ACEi/ARB/ARNi + beta-blocker + MRA). Adherence monitored via pill counts at each visit; mean adherence 94.1%.",
    comparison: "Matching placebo once daily plus identical standard-of-care GDMT. Co-interventions balanced at baseline; no cross-over permitted.",
    outcome: "Primary: Composite of cardiovascular (CV) death or first hospitalisation for worsening heart failure (wHF). Key secondary: all-cause mortality; total HF hospitalisations; Kansas City Cardiomyopathy Questionnaire (KCCQ) total symptom score at 8 weeks.",
  },
  statisticalResults: [
    { measure: "Primary Composite Endpoint", value: "HR 0.75", ci: "95% CI 0.65-0.86", pValue: "p < 0.001", interpretation: "25% relative risk reduction in CV death or wHF hospitalisation" },
    { measure: "Cardiovascular Death", value: "HR 0.82", ci: "95% CI 0.69-0.98", pValue: "p = 0.028", interpretation: "Borderline significant - interpret with caution. Independent replication needed." },
    { measure: "HF Hospitalisation (total events)", value: "RR 0.70", ci: "95% CI 0.58-0.85", pValue: "p < 0.001", interpretation: "30% reduction in total HF hospitalisations including recurrent events" },
    { measure: "KCCQ Total Symptom Score", value: "+4.2 points", ci: "95% CI +2.7 to +5.7", pValue: "p < 0.001", interpretation: "Clinically meaningful PRO improvement (MCID = 5 pts; borderline clinical threshold)" },
  ],
  nnt: {
    value: 21,
    arr: "4.8%",
    rrr: "25%",
    period: "18 months",
    context: "21 patients with HFrEF must receive empagliflozin for 18 months to prevent 1 CV death or wHF hospitalisation. NNT of 21 is clinically favourable for this high-risk population.",
  },
  biasAssessments: [
    { domain: "Selection Bias", risk: "Low" as const, justification: "Centralised, computer-generated randomisation with stratification by LVEF (<30% vs 30-40%) and geography. Allocation concealment confirmed via sealed opaque envelopes." },
    { domain: "Performance Bias", risk: "Low" as const, justification: "Double-blind design; placebo visually identical to active drug. Site investigators and participants remained blinded throughout. No unblinding events reported." },
    { domain: "Detection Bias", risk: "Low" as const, justification: "Endpoints adjudicated by independent Clinical Events Committee blinded to treatment allocation. Hard endpoint definitions pre-specified in protocol." },
    { domain: "Attrition Bias", risk: "Low" as const, justification: "Loss to follow-up: 2.1% (empagliflozin) vs 2.4% (placebo). ITT analysis used as primary. Per-protocol sensitivity analysis consistent with main findings." },
    { domain: "Reporting Bias", risk: "Moderate" as const, justification: "Trial pre-registered (ClinicalTrials.gov NCT04219137). However, 3 of 8 pre-specified secondary endpoints reported incompletely in primary publication. Full data pending." },
  ],
  overallBiasRisk: "Low" as const,
  clinicalSignificance: "The CARDIO-PROTECT trial demonstrates robust, clinically meaningful benefit of empagliflozin in HFrEF. An NNT of 21 over 18 months is therapeutically significant for this high-mortality population. The consistent effect across pre-specified subgroups (diabetic and non-diabetic, LVEF strata) enhances generalisability. The borderline p-value for CV death (p=0.028) warrants cautious interpretation pending independent replication.",
  keyStrengths: [
    "Large, adequately powered multi-centre RCT (n=3,730; 90% power)",
    "Rigorous double-blind design with independent endpoint adjudication",
    "Robust ITT analysis with <2.5% loss to follow-up",
    "Pre-registration with publicly available protocol (ClinicalTrials.gov)",
    "Subgroup analyses pre-specified and consistent with primary result",
  ],
  keyLimitations: [
    "Predominantly white male population (78% male, 85% European) - limited generalisability",
    "Industry supply of empagliflozin creates potential conflict; independent replication needed",
    "Median follow-up of 18 months insufficient to assess long-term mortality benefit",
    "KCCQ improvement did not reach MCID of 5 points (observed: 4.2 pts)",
    "3 secondary endpoints incompletely reported in primary manuscript",
  ],
  appraisalScore: 84,
  rawSummary: `The CARDIO-PROTECT Trial is a phase III, randomised, double-blind, placebo-controlled, multi-centre study evaluating the efficacy and safety of empagliflozin 10 mg once daily versus placebo in 3,730 adults with heart failure with reduced ejection fraction (HFrEF; LVEF <=40%) across 187 sites in 22 countries.

Participants were required to have NYHA functional class II-IV symptoms and be on stable guideline-directed medical therapy for >=3 months. The primary endpoint was a composite of cardiovascular death or first hospitalisation for worsening heart failure. Median follow-up was 18 months.

Empagliflozin significantly reduced the primary composite endpoint (HR 0.75; 95% CI 0.65-0.86; p<0.001), representing a 25% relative risk reduction and 4.8% absolute risk reduction versus placebo. The NNT was 21. Cardiovascular death was numerically reduced (HR 0.82; p=0.028), though this requires cautious interpretation given the borderline significance level. Total HF hospitalisations were reduced by 30% (RR 0.70; p<0.001). Patient-reported outcomes (KCCQ) improved by 4.2 points at 8 weeks (p<0.001), approaching but not reaching the MCID of 5 points.

Adverse events were similar between groups. Genital mycotic infections were more frequent with empagliflozin (4.2% vs 0.8%), consistent with the known class effect. No excess of limb amputations, fractures, or diabetic ketoacidosis was observed.`,
};

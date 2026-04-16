const MEDICAL_TERMS = [
  "background", "methods", "results", "conclusions", "conclusion",
  "randomised", "randomized", "placebo", "controlled", "blinded", "double-blind",
  "single-blind", "open-label", "crossover", "cohort", "prospective", "retrospective",
  "observational", "longitudinal", "cross-sectional", "meta-analysis", "systematic review",
  "intention-to-treat", "per-protocol", "allocation", "concealment", "stratified",
  "patient", "participants", "adults", "children", "pediatric", "elderly",
  "disease", "syndrome", "disorder", "condition", "diagnosis", "comorbidity",
  "inclusion criteria", "exclusion criteria", "enrollment",
  "treatment", "intervention", "drug", "medication", "dose", "dosage",
  "therapy", "therapeutic", "pharmacological", "pharmacology", "adverse",
  "efficacy", "safety", "tolerability", "adherence", "compliance",
  "cardiac", "cardiovascular", "heart", "failure", "ejection", "fraction",
  "hypertension", "diabetes", "obesity", "stroke", "myocardial", "infarction",
  "cancer", "tumor", "tumour", "oncology", "pulmonary", "renal", "hepatic",
  "neurological", "cardiomyopathy", "atrial", "fibrillation", "thrombosis",
  "outcome", "endpoint", "primary", "secondary", "surrogate",
  "mortality", "morbidity", "hospitalisation", "hospitalization",
  "hazard", "ratio", "odds", "relative", "absolute", "risk",
  "confidence", "interval", "p-value", "p<", "p =", "statistical", "significance",
  "nnt", "arr", "rrr", "hr", "or", "rr",
  "lvef", "nyha", "sglt2", "ace", "arb", "egfr", "mmhg", "kccq",
  "gdmt", "hfref", "hfpef", "bmi", "icu", "cv",
  "empagliflozin", "dapagliflozin", "aspirin", "metformin", "statin",
  "insulin", "warfarin", "heparin", "metoprolol", "lisinopril",
  "funded", "funding", "trial registration", "clinicaltrials",
  "pubmed", "doi", "journal", "abstract",
];

export interface ProcessedInput {
  valid: boolean;
  error?: string;
}

export function processMedicalStudy(userInput: string): ProcessedInput {
  const trimmed = userInput.trim();

  if (trimmed.length < 100) {
    return {
      valid: false,
      error:
        "Please provide a valid medical study abstract (minimum 100 characters required). " +
        "Paste the full PubMed abstract including BACKGROUND, METHODS, RESULTS and CONCLUSIONS sections.",
    };
  }

  const lowerInput = trimmed.toLowerCase();
  const matchedTerms = MEDICAL_TERMS.filter((term) => lowerInput.includes(term));

  if (matchedTerms.length < 3) {
    return {
      valid: false,
      error:
        "Please provide a valid medical study. The input does not appear to contain " +
        "sufficient clinical or methodological terminology for evidence-based appraisal. " +
        "Ensure you have pasted a complete PubMed abstract.",
    };
  }

  return { valid: true };
}

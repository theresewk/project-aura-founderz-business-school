# AURA

AURA is a medical research intelligence dashboard demo for structured critical appraisal of clinical studies. It is designed to simulate an evidence review workflow where a user can load a sample abstract, choose which appraisal checks to run, and review a tailored evidence summary in a polished dashboard interface.

## Project Context

This project was developed as part of the Founderz AI Business School x Microsoft AI Skills 4 Women programme in partnership with QATAR Business Council.

AURA was created in response to the open challenge focused on solving real-world problems with AI and prompt engineering: choosing a field, identifying a meaningful problem, and building an AI-supported solution through testing, iteration, and prompt design. In this case, the chosen field is health research, with a focus on making evidence appraisal more structured, legible, and presentation-ready.

## Purpose

This project showcases a concept for guided evidence appraisal in a clinical research setting. The experience is built as a demo, which means the output is intentionally stable and presentation-ready rather than driven by live model inference.

## What the Demo Does

- Accepts pasted study text or a loaded sample abstract
- Lets the user choose which appraisal checks are active
- Simulates an in-progress evidence review workflow
- Returns a structured appraisal dashboard based on the selected controls
- Hides the analysis log once results are ready so the final report becomes the focus

## Appraisal Controls

The dashboard can be configured to show only the sections the user wants to review.

- Methodological Bias Check
- Extract PICO Elements
- Verify P-Values and Confidence Intervals
- Calculate NNT / ARR / RRR
- Conflict of Interest Screen

If all controls are turned off, the demo will not generate results until at least one appraisal area is enabled.

## How to Use

1. Open the dashboard.
2. Paste a study abstract or click `Load Sample`.
3. Turn the appraisal controls on or off depending on what you want to review.
4. Click `Run Demo Appraisal`.
5. Review the resulting evidence summary and scorecard.

## Local Run

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Important Note

This project is a demonstration interface for research and presentation purposes only. It is not intended for clinical decision-making, diagnosis, treatment selection, or patient care.

## License

All rights reserved. No permission is granted to use, copy, modify, distribute, sublicense, or create derivative works from this project without prior written permission from the copyright holder.

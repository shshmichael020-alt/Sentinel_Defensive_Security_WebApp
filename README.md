# Sentinel — Defensive Personal Security Suite

Sentinel is a zero-harm, client-first personal security web app built to protect people and data from threats.

Live Deployment: `https://sentinel-defensive-security-webapp.vercel.app/`

## Alignment with Problem Statement
- **Link Check (Detect + Prevent):** Static analysis of suspicious/phishing URLs, homoglyphs, and brand lookalikes without visiting destinations.
- **Message Check (Detect + Prevent):** Heuristic scan of SMS, WhatsApp, and email scams, flagging coercion, OTP demands, and nested links.
- **Password Check (Prevent):** 100% in-browser Shannon entropy evaluation, dictionary penalties, and rejection-sampled password generator.
- **Learn & Emergency (Raise Awareness + Emergencies):** 6 social engineering attack playbooks, interactive "Spot the Scam" drill, and 1930 / cybercrime helpline guidance.

## Architecture
```
types/       --> Fundamental domain types, discriminated unions, and signal schemas
constants/   --> Deterministic weights, limits, brand registries, copy, and rules
engine/      --> Pure mathematical scoring, Levenshtein, entropy, and signal extractors
hooks/       --> State management, live useMemo analysis, and roving tab navigation
components/  --> Accessible, projector-ready light-mode UI (WAI-ARIA tabs, SVG gauge)
api/explain  --> Minimal serverless route; accepts signal IDs & scores only (never raw text)
```

## Deterministic Scoring Rules
- **Weights:** `info` (0), `low` (8), `medium` (18), `high` (35), `critical` (60)
- **Combined Risk Formula:** `Score = round(100 * (1 - PRODUCT(1 - w_i / 100)))` clamped to `[0, 100]`
- **Verdicts:** `0-19` Low risk | `20-44` Caution | `45-69` Suspicious | `70-100` Dangerous
- **Password Entropy:** `<28` Very weak | `<36` Weak | `<60` Fair | `<80` Strong | `>=80` Very strong

## Privacy & Zero-Harm Guarantees
- **No Web Fetches:** Sentinel never connects to or crawls user-entered URLs.
- **Zero Password Transmission:** Passwords remain strictly in local React state and are never logged or stored.
- **Sanitized AI Route:** The optional explanation API receives only score and signal IDs (e.g. `['no_https']`), never raw user text.
- **No Tracking:** Zero cookies, zero third-party analytics, zero user fingerprinting.

## Optional AI Setup
The app operates deterministically without external services. To enable AI-synthesized summaries:
1. Set `AI_API_KEY` (Gemini API Key) in Vercel environment variables.
2. Optional: Set `AI_MODEL` (defaults to `gemini-2.0-flash`).

## Scripts & Testing
- `npm run dev`: Launch local Vite development server
- `npm run build`: Typecheck with `tsc --noEmit` and build production bundle
- `npm run test`: Run non-watch Vitest suite (82 unit, API, and UI integration tests)
- `npm run lint`: Run ESLint with zero allowed warnings
- `npm run typecheck`: Run TypeScript strict type verification

## Accessibility & Limitations
- Built to W3C WAI-ARIA authoring practices with roving `tabindex`, keyboard support, and `>= 4.5:1` contrast ratios.
- *Limitation:* Static heuristic analysis detects common indicators but is not a substitute for verified institutional communication channels.

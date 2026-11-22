# Sentinel — Defensive Personal Security Web Application

> **Problem Statement (Verbatim):** "Build a defensive solution that helps protect people, data or systems from threats. The focus is on detecting, preventing and raising awareness about risks such as scams, weak passwords, unsafe links, fake content or emergencies. The solution should keep users safer without harming anyone. Examples: Phishing detector, Password strength and safety checker, Campus safety alert system, Secure login, etc."

Live Deployment: `https://sentinel-defensive-security-webapp.vercel.app/`

Sentinel is a zero-knowledge defensive personal-security web application engineered for instant client-side threat detection, attack prevention, and security awareness. Built with React 18, TypeScript (strict), Vite, and Tailwind CSS.

## Architecture & Directory Structure

```
├── api/
│   └── explain.ts               # Serverless AI explanation route (sanitized signals only)
├── src/
│   ├── components/
│   │   ├── common/              # ActionPlan, RiskGauge, SeverityPill, SignalList, ExplainPanel
│   │   ├── layout/              # Header, Footer, PrivacyNote, KpiStrip, TabBar, SkipLink
│   │   ├── link/                # LinkPanel, UrlAnatomy (static lexical URL dissection)
│   │   ├── message/             # MessagePanel, HighlightedMessage (scam heuristics)
│   │   ├── password/            # PasswordPanel, GeneratorCard, StrengthMeter, CrackTimeCards
│   │   └── learn/               # LearnPanel (lazy-loaded), DrillCard, EmergencyHelp
│   ├── constants/               # TLD lists, brand registries, copy, limits, scoring weights
│   ├── engine/                  # Pure deterministic scoring, Levenshtein, Shannon entropy
│   ├── hooks/                   # useLinkCheck, useMessageCheck, usePasswordCheck, useExplain
│   └── types/                   # Discriminated unions, typed signal IDs, severity tiers
└── tests/                       # 82 automated Vitest tests across engine, hooks, API, and UI
```

## Defensive Capabilities Across 4 Tabs

| Tab | Role | Threat Protection & Capabilities |
| :--- | :--- | :--- |
| **Link Check** | Detect & Prevent | Lexical URL analysis, homoglyph attack detection, Brand Levenshtein distance, multi-part TLD extraction, dangerous schemes (`javascript:`, `data:`), and visual attack anatomy breakdown without visiting target destinations. |
| **Message Check** | Detect & Prevent | SMS/email/WhatsApp scam heuristics, urgency/coercion markers, OTP/credential harvesting detection, and single-pass embedded malicious URL extraction. |
| **Password Check** | Prevent | 100% in-browser Shannon entropy computation, dictionary pattern/keyboard walk penalties, crack-time estimations across 3 attack tiers, and cryptographically secure rejection-sampled generation. |
| **Learn & Emergency**| Raise Awareness | 6 social engineering attack playbooks, interactive 5-scenario "Spot the Scam" drill with immediate feedback, and actionable "Already Scammed? Act Now" emergency playbooks (helplines + bank steps). |

## Privacy & Zero-Harm Guarantees

1. **No URL Crawling or Visiting:** Sentinel evaluates URLs purely via offline static lexical analysis. User destinations are never fetched, visited, or pinged.
2. **Zero Password Storage or Transmission:** Passwords remain entirely within transient React client memory. They are never written to disk, indexed, logged, or transmitted over any network interface.
3. **Zero-Knowledge AI Explanations:** The optional `/api/explain` endpoint accepts strictly numeric scores and sanitized signal IDs (e.g. `{ kind: 'link', score: 85, signals: [{ id: 'lookalike_domain', severity: 'critical' }] }`). Raw user text, URLs, and passwords never leave the client browser.
4. **No Tracking, Analytics, or Cookies:** No third-party trackers, telemetry, or storage cookies are utilized.

## Hardening & Performance Benchmark Results

| Metric / Operation | Baseline (Pre-Hardening) | Hardened Result | Improvement / Delta |
| :--- | :--- | :--- | :--- |
| **Initial JS Bundle (Gzipped)** | 75.57 kB | **26.00 kB** | **-65.6% download reduction** |
| **Message Analysis (~3800 chars)** | 1.2135 ms / call | **0.4628 ms / call** | **+61.9% faster (2.6x speedup)** |
| **Message Highlighting (~3800 chars)**| 0.9760 ms / call | **0.1112 ms / call** | **+88.6% faster (8.8x speedup)** |
| **Password Analysis (Weak)** | 0.0316 ms / call | **0.0054 ms / call** | **+82.9% faster (5.8x speedup)** |
| **Password Analysis (Strong)** | 0.0619 ms / call | **0.0090 ms / call** | **+85.5% faster (6.9x speedup)** |
| **Code Duplication (jscpd)** | Minimal | **0.00% (0 clones)** | **Zero duplication** |
| **Max File Length** | 189 lines | **< 160 lines** | **Strict modular compliance** |
| **Engine Test Coverage** | N/A | **94.15% Statements** | **High confidence test suite** |

## Deterministic Scoring Math

- **Signal Weights:** `info`: 0, `low`: 8, `medium`: 18, `high`: 35, `critical`: 60.
- **Combined Risk Formula:** $S = \text{round}\left(100 \times \left(1 - \prod_{i=1}^n (1 - w_i / 100)\right)\right)$, clamped to $[0, 100]$.
- **Verdicts:** `0-19`: Low risk | `20-44`: Caution | `45-69`: Suspicious | `70-100`: Dangerous.
- **Password Entropy Tiers:** `<28 bits`: Very weak | `<36 bits`: Weak | `<60 bits`: Fair | `<80 bits`: Strong | `$\ge 80 bits$`: Very strong.

## Verification & Scripts

```bash
npm run dev            # Start local Vite development server
npm run typecheck      # TypeScript strict type verification
npm run lint           # ESLint verification (0 errors, 0 warnings under strict caps)
npm test               # Run all 82 Vitest unit, API, and UI integration tests
npm run test:coverage  # Execute coverage audit with v8 provider
npm run build          # Production bundle compilation and type checking
```

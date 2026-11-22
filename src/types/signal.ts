import type { Severity } from './severity';

export type UrlSignalId =
  | 'no_https'
  | 'ip_host'
  | 'punycode_idn'
  | 'userinfo_at'
  | 'excess_subdomains'
  | 'long_url'
  | 'suspicious_tld'
  | 'url_shortener'
  | 'phishing_keywords'
  | 'many_hyphens'
  | 'nonstandard_port'
  | 'encoded_obfuscation'
  | 'embedded_redirect'
  | 'brand_lookalike'
  | 'brand_in_subdomain_or_path'
  | 'dangerous_scheme'
  | 'official_domain_match';

export type MessageSignalId =
  | 'credential_request'
  | 'urgency_pressure'
  | 'account_threat'
  | 'prize_lottery'
  | 'risky_payment_method'
  | 'authority_impersonation'
  | 'secrecy_request'
  | 'contact_off_platform'
  | 'too_good_job_offer'
  | 'shouting_style'
  | 'risky_link_inside'
  | 'pressure_combo';

export type SignalId = UrlSignalId | MessageSignalId;

export interface Signal {
  readonly id: SignalId;
  readonly severity: Severity;
  readonly label: string;
  readonly evidence: string;
  readonly advice: string;
}

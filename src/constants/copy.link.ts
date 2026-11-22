import type { UrlSignalId } from '../types/signal';

export interface SignalCopyItem {
  readonly label: string;
  readonly advice: string;
}

export const URL_SIGNAL_COPY: Readonly<Record<UrlSignalId, SignalCopyItem>> = {
  dangerous_scheme: {
    label: 'Dangerous URL Scheme',
    advice: 'Never execute or open javascript or data schemes from untrusted sources.',
  },
  no_https: {
    label: 'Insecure Protocol (HTTP)',
    advice: 'Connection is unencrypted; avoid entering any personal data or credentials.',
  },
  ip_host: {
    label: 'Raw IP Address Host',
    advice: 'Legitimate services use registered domains, not bare IP addresses.',
  },
  punycode_idn: {
    label: 'Punycode / Homograph Character',
    advice: 'Non-ASCII characters can disguise spoofed domains that mimic real brands.',
  },
  userinfo_at: {
    label: 'Embedded Credentials / @ Trick',
    advice: 'Characters before @ are ignored by browsers, redirecting you to the actual host.',
  },
  excess_subdomains: {
    label: 'Excessive Subdomain Nesting',
    advice: 'Attackers create long subdomain chains to disguise the real domain owner.',
  },
  long_url: {
    label: 'Abnormally Long URL',
    advice: 'Unusually long URLs often attempt to hide destination parameters.',
  },
  suspicious_tld: {
    label: 'High-Risk Top-Level Domain',
    advice: 'This TLD is disproportionately associated with spam and disposable phishing hosts.',
  },
  url_shortener: {
    label: 'URL Shortener Detected',
    advice: 'Shorteners obscure the ultimate destination; verify the unshortened address first.',
  },
  phishing_keywords: {
    label: 'Suspicious Security Keywords',
    advice: 'Keywords like login, verify, and wallet in unexpected places suggest credential harvesting.',
  },
  many_hyphens: {
    label: 'Excessive Host Hyphens',
    advice: 'Multiple hyphens in a domain name often emulate legitimate multi-word brands.',
  },
  nonstandard_port: {
    label: 'Non-Standard Web Port',
    advice: 'Web services usually operate on port 80 or 443; non-standard ports warrant caution.',
  },
  encoded_obfuscation: {
    label: 'Excessive Percent Encoding',
    advice: 'Heavy encoding may hide malicious characters or destination URLs from basic filters.',
  },
  embedded_redirect: {
    label: 'Embedded Redirect Query',
    advice: 'A query parameter contains an external URL that may bounce you to an untrusted site.',
  },
  brand_lookalike: {
    label: 'Brand Typo / Lookalike Domain',
    advice: 'This domain closely mimics a trusted brand name and is very likely an active imposter.',
  },
  brand_in_subdomain_or_path: {
    label: 'Brand Token in Subdomain or Path',
    advice: 'A trusted brand is named in the path or subdomain, but the actual domain belongs elsewhere.',
  },
  official_domain_match: {
    label: 'Verified Brand Domain Match',
    advice: 'This URL matches a known official domain for the recognized organization.',
  },
};

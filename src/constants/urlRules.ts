export const MULTI_PART_SUFFIXES: readonly string[] = [
  'co.in',
  'co.uk',
  'com.au',
  'gov.in',
  'ac.in',
  'org.in',
  'com.br',
  'net.in',
  'edu.in',
  'co.nz',
  'co.za',
  'co.jp',
  'gov.uk',
  'org.uk',
  'ac.uk',
];

export const SUSPICIOUS_TLDS: readonly string[] = [
  'zip',
  'mov',
  'xyz',
  'top',
  'tk',
  'ml',
  'ga',
  'cf',
  'gq',
  'click',
  'country',
  'work',
  'support',
  'rest',
  'link',
  'kim',
  'party',
  'buzz',
  'fit',
  'surf',
];

export const URL_SHORTENERS: readonly string[] = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'is.gd',
  'cutt.ly',
  'rb.gy',
  'ow.ly',
  'buff.ly',
];

export const PHISHING_KEYWORDS: readonly string[] = [
  'login',
  'verify',
  'secure',
  'update',
  'account',
  'confirm',
  'wallet',
  'banking',
  'signin',
  'password',
  'suspended',
  'kyc',
];

export const DANGEROUS_SCHEMES: readonly string[] = [
  'javascript:',
  'data:',
  'file:',
  'vbscript:',
];

export const MULTI_PART_SUFFIXES_SET: ReadonlySet<string> = new Set(MULTI_PART_SUFFIXES);
export const SUSPICIOUS_TLDS_SET: ReadonlySet<string> = new Set(SUSPICIOUS_TLDS);
export const URL_SHORTENERS_SET: ReadonlySet<string> = new Set(URL_SHORTENERS);
export const PHISHING_KEYWORDS_SET: ReadonlySet<string> = new Set(PHISHING_KEYWORDS);
export const DANGEROUS_SCHEMES_SET: ReadonlySet<string> = new Set(DANGEROUS_SCHEMES);


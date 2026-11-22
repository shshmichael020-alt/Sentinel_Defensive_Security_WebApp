export interface BrandEntry {
  readonly name: string;
  readonly token: string;
  readonly officialDomains: readonly string[];
}

export const BRANDS: readonly BrandEntry[] = [
  { name: 'PayPal', token: 'paypal', officialDomains: ['paypal.com'] },
  { name: 'Google', token: 'google', officialDomains: ['google.com', 'google.co.in'] },
  { name: 'Microsoft', token: 'microsoft', officialDomains: ['microsoft.com', 'live.com'] },
  { name: 'Apple', token: 'apple', officialDomains: ['apple.com', 'icloud.com'] },
  { name: 'Amazon', token: 'amazon', officialDomains: ['amazon.com', 'amazon.in'] },
  { name: 'Netflix', token: 'netflix', officialDomains: ['netflix.com'] },
  { name: 'Facebook', token: 'facebook', officialDomains: ['facebook.com', 'fb.com'] },
  { name: 'Instagram', token: 'instagram', officialDomains: ['instagram.com'] },
  { name: 'WhatsApp', token: 'whatsapp', officialDomains: ['whatsapp.com'] },
  { name: 'LinkedIn', token: 'linkedin', officialDomains: ['linkedin.com'] },
  { name: 'GitHub', token: 'github', officialDomains: ['github.com'] },
  { name: 'Dropbox', token: 'dropbox', officialDomains: ['dropbox.com'] },
  { name: 'DHL', token: 'dhl', officialDomains: ['dhl.com'] },
  { name: 'FedEx', token: 'fedex', officialDomains: ['fedex.com'] },
  { name: 'Coinbase', token: 'coinbase', officialDomains: ['coinbase.com'] },
  { name: 'State Bank of India', token: 'sbi', officialDomains: ['sbi.co.in', 'onlinesbi.sbi'] },
  { name: 'HDFC Bank', token: 'hdfcbank', officialDomains: ['hdfcbank.com'] },
  { name: 'ICICI Bank', token: 'icicibank', officialDomains: ['icicibank.com'] },
  { name: 'Axis Bank', token: 'axisbank', officialDomains: ['axisbank.com'] },
  { name: 'Paytm', token: 'paytm', officialDomains: ['paytm.com'] },
  { name: 'PhonePe', token: 'phonepe', officialDomains: ['phonepe.com'] },
  { name: 'Flipkart', token: 'flipkart', officialDomains: ['flipkart.com'] },
  { name: 'IRCTC', token: 'irctc', officialDomains: ['irctc.co.in'] },
  { name: 'Income Tax India', token: 'incometax', officialDomains: ['incometax.gov.in'] },
  { name: 'UIDAI Aadhaar', token: 'uidai', officialDomains: ['uidai.gov.in'] },
];

export const OFFICIAL_DOMAIN_TO_BRAND: ReadonlyMap<string, BrandEntry> = new Map(
  BRANDS.flatMap((b) => b.officialDomains.map((d) => [d, b] as const)),
);


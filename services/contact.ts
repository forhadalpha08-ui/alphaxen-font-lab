// Official Alphaxen Direct Contact & Deal Routing Service

export const FOUNDRY_CONTACT = {
  phone: '+8801342900364',
  whatsappNumber: '8801342900364',
  email: 'alphaxen.foundry@gmail.com',
  secondaryEmail: 'contact@alphaxen.com',
  telegram: 'https://t.me/alphaxen',
  brandName: 'ALPHAXEN TYPE FOUNDRY'
};

export const createWhatsAppDealUrl = (params: {
  fontName?: string;
  licenseTier?: string;
  price?: number;
  customMessage?: string;
  type?: 'purchase' | 'custom_font' | 'seller_submission' | 'general';
}): string => {
  let text = '';

  if (params.customMessage) {
    text = params.customMessage;
  } else if (params.type === 'purchase' && params.fontName) {
    text = `Hello Alphaxen Foundry! 👋\n\nI want to deal/purchase a license for:\n📌 Typeface: ${params.fontName}\n📜 License Tier: ${params.licenseTier || 'Commercial'}\n💰 Listed Price: $${params.price || 89}\n\nPlease provide payment details (Bank/Stripe/USDC/bKash/Wire) and font package delivery.`;
  } else if (params.type === 'custom_font') {
    text = `Hello Alphaxen Foundry! 👋\n\nI would like to commission a *Custom Bespoke Typeface / Logotype* for my brand.\n\nPlease let me know your timeline, scope, and pricing details.`;
  } else if (params.type === 'seller_submission') {
    text = `Hello Alphaxen Team! 👋\n\nI am a Type Designer and would like to submit my typeface family for distribution on Alphaxen Foundry (85% Royalty Split).\n\nTypeface: ${params.fontName || 'New Typeface'}\nStyles: ${params.customMessage || 'Full Family'}`;
  } else {
    text = `Hello Alphaxen Foundry! I would like to inquire about your typefaces and licensing.`;
  }

  return `https://wa.me/${FOUNDRY_CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;
};

export const createEmailDealUrl = (params: {
  fontName?: string;
  licenseTier?: string;
  price?: number;
  subject?: string;
  body?: string;
  type?: 'purchase' | 'custom_font' | 'seller_submission' | 'general';
}): string => {
  let subject = params.subject || `Inquiry: ${params.fontName || 'Alphaxen Typeface'} Licensing`;
  let body = '';

  if (params.body) {
    body = params.body;
  } else if (params.type === 'purchase' && params.fontName) {
    subject = `[License Order] ${params.fontName} - ${params.licenseTier || 'Commercial'} License`;
    body = `Hello Alphaxen Type Foundry,\n\nI would like to acquire a license for the following typeface:\n\nTypeface: ${params.fontName}\nLicense Tier: ${params.licenseTier || 'Commercial'}\nPrice: $${params.price || 89}\n\nPlease reply with invoice and payment methods.\n\nBest regards,\n[Your Name / Company]`;
  } else if (params.type === 'custom_font') {
    subject = `[Custom Typeface Commission] Brand Typography Request`;
    body = `Hello Alphaxen Team,\n\nI want to discuss commissioning a custom bespoke typeface family for our brand.\n\nProject Scope:\nTimeline:\nBudget:\n\nBest regards,\n[Your Name]`;
  } else if (params.type === 'seller_submission') {
    subject = `[Typeface Submission] ${params.fontName || 'New Family'} - Creator Distribution`;
    body = `Hello Alphaxen Foundry Curators,\n\nI am submitting a new typeface family for consideration on Alphaxen.\n\nTypeface Name: ${params.fontName || ''}\nDesigner/Studio: \nCategory: \nAttached OTF/TTF / Specimen PDF:\n\nLooking forward to hearing from you.`;
  } else {
    body = `Hello Alphaxen Team,\n\nI have an inquiry regarding your type catalog.\n\nBest regards.`;
  }

  return `mailto:${FOUNDRY_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

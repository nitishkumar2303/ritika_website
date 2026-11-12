import { PRODUCTS, STUDIO_INFO } from '../data/studioData';

export type OrderProductSelection = '' | 'pencil' | 'initial' | 'plaque' | 'long' | 'custom';

export interface OrderFormInput {
  product: OrderProductSelection;
  quantity: number;
  customerName: string;
  phone: string;
  colour: string;
  personalisation: string;
  message: string;
  address: string;
  delivery: 'DTDC courier' | 'Local pickup in Shamli';
  bulk: 'No' | 'Bulk order (15 pieces or more)' | 'Gift packaging enquiry for bulk order';
  policyAgreed: boolean;
}

export interface SubtotalResult {
  unitPrice: number | null;
  subtotal: number | null;
  formattedTotal: string;
  isCustomQuote: boolean;
}

export function calculateOrderSubtotal(
  productId: OrderProductSelection,
  rawQuantity: number
): SubtotalResult {
  const qty = Number.isFinite(rawQuantity) && rawQuantity >= 1 ? Math.floor(rawQuantity) : 1;

  if (!productId) {
    return {
      unitPrice: null,
      subtotal: 0,
      formattedTotal: '₹0',
      isCustomQuote: false,
    };
  }

  if (productId === 'custom') {
    return {
      unitPrice: null,
      subtotal: null,
      formattedTotal: 'Quote on WhatsApp',
      isCustomQuote: true,
    };
  }

  const found = PRODUCTS.find((p) => p.id === productId);
  if (!found) {
    return {
      unitPrice: null,
      subtotal: 0,
      formattedTotal: '₹0',
      isCustomQuote: false,
    };
  }

  const subtotal = found.price * qty;
  return {
    unitPrice: found.price,
    subtotal,
    formattedTotal: `₹${subtotal.toLocaleString('en-IN')}`,
    isCustomQuote: false,
  };
}

export function validateOrderForm(input: OrderFormInput): {
  valid: boolean;
  errors: Partial<Record<keyof OrderFormInput, string>>;
} {
  const errors: Partial<Record<keyof OrderFormInput, string>> = {};

  if (!input.product) {
    errors.product = 'Please select a product or choose custom requirement.';
  }

  if (!Number.isFinite(input.quantity) || input.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1.';
  }

  if (!input.customerName.trim()) {
    errors.customerName = 'Please enter your full name.';
  }

  const digitsOnly = input.phone.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    errors.phone = 'Please enter a valid 10-digit WhatsApp mobile number.';
  }

  if (!input.address.trim()) {
    errors.address = 'Please enter your complete delivery address (or Shamli pickup note).';
  }

  if (!input.policyAgreed) {
    errors.policyAgreed =
      'Please acknowledge the advance payment and custom order policy before continuing.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppUrl(text: string, phoneNumber: string = STUDIO_INFO.whatsappNumber): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
}

export function buildOrderWhatsAppMessage(input: OrderFormInput): string {
  const qty = Number.isFinite(input.quantity) && input.quantity >= 1 ? Math.floor(input.quantity) : 1;
  const item = PRODUCTS.find((p) => p.id === input.product);
  const calc = calculateOrderSubtotal(input.product, qty);

  const lines = [
    'Hello Ritika! I would like to place an order with 3D PRINTING BY RITIKA.',
    '',
    'CUSTOMER DETAILS',
    `Name: ${input.customerName.trim()}`,
    `WhatsApp number: ${input.phone.trim()}`,
    '',
    'ORDER DETAILS',
    `Product: ${item ? item.name : 'Other / Custom requirement'}`,
    `Quantity: ${qty}`,
    `Unit price: ${item ? `₹${item.price}` : 'To be quoted'}`,
    `Estimated product subtotal: ${
      item && calc.subtotal !== null ? `₹${calc.subtotal.toLocaleString('en-IN')}` : 'Quote required'
    }`,
    `Preferred colour(s): ${input.colour.trim() || 'Not specified'}`,
    `Name / initial / text: ${input.personalisation.trim() || 'Not specified'}`,
    `Additional details: ${input.message.trim() || 'None'}`,
    '',
    'DELIVERY DETAILS',
    `Address: ${input.address.trim()}`,
    `Delivery preference: ${input.delivery}`,
    `Bulk / gift packaging: ${input.bulk || 'No'}`,
    '',
    'Please confirm availability and the final payable amount, including shipping. I understand 100% advance payment is required and my order is confirmed only after payment is received and verified.',
  ];

  return lines.join('\n');
}

export function buildOrderWhatsAppUrl(input: OrderFormInput): string {
  const message = buildOrderWhatsAppMessage(input);
  return buildWhatsAppUrl(message);
}

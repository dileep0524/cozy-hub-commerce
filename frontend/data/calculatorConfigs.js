// ─── Helpers ────────────────────────────────────────────────────────────────

function amazonIndiaReferralRate(category, price) {
  if (price <= 300) return 0;
  const rates = {
    'Books': 5.13,
    'Mobile Phones': 3.07,
    'Electronics': 4.1,
    'Cameras & Photography': 4.1,
    'Computers': 4.1,
    'Clothing & Apparel': 10.26,
    'Shoes & Handbags': 10.26,
    'Home & Kitchen': 9.23,
    'Toys & Baby': 7.18,
    'Sports & Fitness': 8.21,
    'Automotive': 9.23,
    'Health & Beauty': 10.26,
    'Food & Gourmet': 7.18,
    'Industrial & Scientific': 9.23,
    'Jewelry (Fine)': 13.85,
    'Jewelry (Artificial)': 15.38,
    'Watches (≤₹5000)': 15.38,
    'Watches (>₹5000)': 7.69,
    'Other': 9.23,
  };
  return rates[category] ?? 9.23;
}

function amazonIndiaClosingFee(price) {
  if (price <= 250) return 5;
  if (price <= 500) return 10;
  if (price <= 1000) return 20;
  if (price <= 5000) return 40;
  return 100;
}

function amazonIndiaShipping(weightG, area) {
  const w = Number(weightG) || 0;
  const base500 = { Local: 52, Regional: 72, National: 96 };
  const base1000 = { Local: 78, Regional: 108, National: 144 };
  const extra500 = { Local: 30, Regional: 40, National: 50 };
  if (w <= 500) return base500[area] ?? 52;
  if (w <= 1000) return base1000[area] ?? 78;
  const extraSlabs = Math.ceil((w - 1000) / 500);
  return (base1000[area] ?? 78) + extraSlabs * (extra500[area] ?? 30);
}

function flipkartShipping(weightG, zone, fbf) {
  const w = Number(weightG) || 0;
  const base = { Local: 40, Zonal: 60, National: 85 };
  const extra = { Local: 10, Zonal: 15, National: 20 };
  const slabs = Math.max(0, Math.ceil((w - 500) / 500));
  const base_ = base[zone] ?? 40;
  const extra_ = extra[zone] ?? 10;
  const selfShip = base_ + slabs * extra_;
  return fbf === 'FBF' ? selfShip * 1.2 : selfShip;
}

function jioMartShipping(weightG, area) {
  const w = Number(weightG) || 0;
  const base = { Local: 35, Regional: 55, National: 75 };
  const base_ = base[area] ?? 35;
  const slabs = Math.max(0, Math.ceil((w - 500) / 500));
  return base_ + slabs * 15;
}

function fmtR(n) { return Math.round(n * 100) / 100; }

function amazonUSReferralRate(category, price) {
  const price_ = Number(price) || 0;
  if (category === 'Amazon Devices & Accessories') return 45;
  if (category === 'Jewelry') return price_ <= 250 ? 20 : 5;
  if (category === 'Watches') return price_ <= 1500 ? 16 : 3;
  if (category === 'Grocery') return price_ <= 15 ? 8 : 15;
  const rates = {
    'Automotive': 12, 'Baby Products': 8, 'Beauty & Personal Care': 8,
    'Books': 15, 'CDs & Vinyl': 15, 'Cell Phones': 8,
    'Clothing & Accessories': 17, 'Computers': 8, 'Consumer Electronics': 8,
    'Furniture': 15, 'Handmade': 15, 'Health & Household': 8,
    'Home & Garden': 15, 'Kitchen': 15, 'Luggage': 15,
    'Sports & Outdoors': 15, 'Tools & Home Improvement': 15,
    'Toys & Games': 15, 'Video Games': 15, 'Other': 15,
  };
  return rates[category] ?? 15;
}

function amazonUSFBAFee(lengthIn, widthIn, heightIn, weightLbs) {
  const l = Number(lengthIn) || 0;
  const w = Number(widthIn) || 0;
  const h = Number(heightIn) || 0;
  const wt = Number(weightLbs) || 0;
  const dimWeight = (l * w * h) / 139;
  const chargeableWt = Math.max(wt, dimWeight);
  if (l <= 15 && w <= 12 && h <= 0.75 && chargeableWt < 1) return 3.06;
  if (chargeableWt <= 1) return 3.68;
  if (chargeableWt <= 2) return 4.99;
  if (chargeableWt <= 3) return 5.99;
  if (chargeableWt <= 20) return 5.99 + Math.ceil(chargeableWt - 3) * 0.38;
  return 9.73 + chargeableWt * 0.42;
}

function amazonUKReferralRate(category, priceGBP) {
  const p = Number(priceGBP) || 0;
  if (category === 'Jewelry') return p <= 225 ? 20 : 5;
  const rates = {
    'Books': 15, 'Consumer Electronics': 7, 'Clothing & Accessories': 15.3,
    'Home & Garden': 15.3, 'Shoes & Bags': 15.3, 'Sports & Outdoors': 15.3,
    'Toys & Games': 15, 'Automotive': 12, 'Baby': 8, 'Health & Beauty': 8,
    'Kitchen & Home': 15.3, 'Other': 15,
  };
  return rates[category] ?? 15;
}

function amazonUKFBAFee(weightG) {
  const w = Number(weightG) || 0;
  if (w <= 100) return 2.58;
  if (w <= 500) return 3.00;
  if (w <= 1000) return 3.31;
  if (w <= 2000) return 3.72;
  if (w <= 5000) return 7.49;
  if (w <= 10000) return 10.29;
  if (w <= 20000) return 14.08;
  return 15.88;
}

function walmartReferralRate(category, price) {
  const p = Number(price) || 0;
  if (category === 'Jewelry') return p <= 250 ? 20 : 5;
  const rates = {
    'Apparel & Accessories': 15, 'Baby': 15, 'Books': 15,
    'Consumer Electronics': 8, 'Home & Garden': 15, 'Kitchen': 15,
    'Sporting Goods': 15, 'Tires & Wheels': 10, 'Toys & Games': 15,
    'Video Games': 15, 'Wireless Phones': 8, 'Automotive': 12,
    'Beauty': 15, 'Tools': 15, 'Other': 15,
  };
  return rates[category] ?? 15;
}

// ─── Calculator Configs ───────────────────────────────────────────────────────

export const CALC_CONFIGS = {

  // ── Amazon FBA India ──────────────────────────────────────────────────────
  'fba/amazon': {
    title: 'Amazon FBA Calculator (India)',
    description: 'Calculate your Amazon India FBA fees, GST, and net profit for any product category.',
    currency: '₹',
    // Price values cross Amazon India's 5 closing-fee brackets (≤₹250 → ₹5, ≤₹500 → ₹10,
    // ≤₹1000 → ₹20, ≤₹5000 → ₹40, >₹5000 → ₹100) and the ₹300 zero-referral threshold.
    // Weight values hit FBA shipping slab boundaries (≤500g, ≤1000g, then +500g increments).
    comparisons: [
      { key: 'price', label: 'Price Comparison', description: 'Spans Amazon India closing-fee tiers & the ₹300 zero-referral threshold', values: [199, 350, 750, 2500, 6000] },
    ],
    fields: [
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Electronics', options: ['Books','Mobile Phones','Electronics','Cameras & Photography','Computers','Clothing & Apparel','Shoes & Handbags','Home & Kitchen','Toys & Baby','Sports & Fitness','Automotive','Health & Beauty','Food & Gourmet','Industrial & Scientific','Jewelry (Fine)','Jewelry (Artificial)','Watches (≤₹5000)','Watches (>₹5000)','Other'] },
      { key: 'price', label: 'Selling Price (₹)', type: 'number', defaultValue: 500, min: 0, step: 1 },
      { key: 'weight', label: 'Product Weight (grams)', type: 'number', defaultValue: 400, min: 0, step: 1 },
      { key: 'area', label: 'Delivery Area', type: 'radio', defaultValue: 'National', options: ['Local','Regional','National'] },
      { key: 'gst', label: 'Product GST Rate', type: 'select', defaultValue: '18', options: [{ value: '0', label: '0%' },{ value: '5', label: '5%' },{ value: '12', label: '12%' },{ value: '18', label: '18%' },{ value: '28', label: '28%' }] },
    ],
    calculate({ category, price, weight, area, gst }) {
      const p = Number(price) || 0;
      const gstRate = Number(gst) || 0;
      const referralRate = amazonIndiaReferralRate(category, p);
      const referralFee = fmtR(p * referralRate / 100);
      const closingFee = amazonIndiaClosingFee(p);
      const shippingFee = amazonIndiaShipping(weight, area);
      const subtotal = referralFee + closingFee + shippingFee;
      const gstOnFees = fmtR(subtotal * 0.18);
      const platformFees = fmtR(subtotal + gstOnFees);
      const productGST = fmtR(p * gstRate / 100);
      const totalDeductions = fmtR(platformFees + productGST);
      const profit = fmtR(p - totalDeductions);
      const rows = [
        { key: 'referral', label: `Referral Fee (${referralRate}%)`, value: referralFee, type: 'fee' },
        { key: 'closing', label: 'Closing Fee', value: closingFee, type: 'fee' },
        { key: 'shipping', label: 'FBA Shipping Fee', value: shippingFee, type: 'fee' },
        { key: 'gstFees', label: 'GST on Fees (18%)', value: gstOnFees, type: 'fee' },
        { key: 'platformTotal', label: 'Platform Fees', value: platformFees, type: 'total' },
      ];
      if (gstRate > 0) rows.push({ key: 'productGST', label: `Product GST (${gstRate}%)`, value: productGST, type: 'fee' });
      rows.push({ key: 'total', label: 'Total Deductions', value: totalDeductions, type: 'total' });
      rows.push({ key: 'profit', label: 'Your Profit', value: profit, type: 'profit' });
      return { rows, profit, totalFees: totalDeductions, profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0 };
    },
  },

  // ── Amazon FBA US ────────────────────────────────────────────────────────
  'fba/amazon-us': {
    title: 'Amazon FBA Calculator (US)',
    description: 'Estimate Amazon US FBA fulfillment fees and referral fees to know your net profit.',
    currency: '$',
    fields: [
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Consumer Electronics', options: ['Amazon Devices & Accessories','Automotive','Baby Products','Beauty & Personal Care','Books','CDs & Vinyl','Cell Phones','Clothing & Accessories','Computers','Consumer Electronics','Furniture','Grocery','Handmade','Health & Household','Home & Garden','Jewelry','Kitchen','Luggage','Sports & Outdoors','Tools & Home Improvement','Toys & Games','Video Games','Watches','Other'] },
      { key: 'price', label: 'Selling Price ($)', type: 'number', defaultValue: 25, min: 0, step: 0.01 },
      { key: 'length', label: 'Length (inches)', type: 'number', defaultValue: 10, min: 0, step: 0.1 },
      { key: 'width', label: 'Width (inches)', type: 'number', defaultValue: 7, min: 0, step: 0.1 },
      { key: 'height', label: 'Height (inches)', type: 'number', defaultValue: 2, min: 0, step: 0.1 },
      { key: 'weight', label: 'Weight (lbs)', type: 'number', defaultValue: 0.8, min: 0, step: 0.01 },
      { key: 'method', label: 'Fulfillment Method', type: 'radio', defaultValue: 'FBA', options: ['FBA','FBM'] },
    ],
    calculate({ category, price, length, width, height, weight, method }) {
      const p = Number(price) || 0;
      const refRate = amazonUSReferralRate(category, p);
      const referralFee = fmtR(p * refRate / 100);
      const fbaFee = method === 'FBA' ? fmtR(amazonUSFBAFee(length, width, height, weight)) : 0;
      const totalFees = fmtR(referralFee + fbaFee);
      const profit = fmtR(p - totalFees);
      const rows = [
        { key: 'referral', label: `Referral Fee (${refRate}%)`, value: referralFee, type: 'fee' },
      ];
      if (method === 'FBA') rows.push({ key: 'fba', label: 'FBA Fulfillment Fee', value: fbaFee, type: 'fee' });
      rows.push({ key: 'total', label: 'Total Fees', value: totalFees, type: 'total' });
      rows.push({ key: 'profit', label: 'Your Profit', value: profit, type: 'profit' });
      return { rows, profit, profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0 };
    },
  },

  // ── Amazon FBA UK ────────────────────────────────────────────────────────
  'fba/amazon-uk': {
    title: 'Amazon FBA Calculator (UK)',
    description: 'Calculate Amazon UK FBA fees in GBP including referral and fulfillment costs.',
    currency: '£',
    fields: [
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Consumer Electronics', options: ['Books','Consumer Electronics','Clothing & Accessories','Home & Garden','Jewelry','Kitchen & Home','Shoes & Bags','Sports & Outdoors','Toys & Games','Automotive','Baby','Health & Beauty','Other'] },
      { key: 'price', label: 'Selling Price (£)', type: 'number', defaultValue: 20, min: 0, step: 0.01 },
      { key: 'cogs', label: 'Cost of Goods (£)', type: 'number', defaultValue: 8, min: 0, step: 0.01 },
      { key: 'weight', label: 'Product Weight (grams)', type: 'number', defaultValue: 400, min: 0, step: 1 },
    ],
    calculate({ category, price, cogs, weight }) {
      const p = Number(price) || 0;
      const c = Number(cogs) || 0;
      const refRate = amazonUKReferralRate(category, p);
      const referralFee = fmtR(p * refRate / 100);
      const fbaFee = fmtR(amazonUKFBAFee(weight));
      const totalFees = fmtR(referralFee + fbaFee);
      const profit = fmtR(p - c - totalFees);
      return {
        rows: [
          { key: 'cogs', label: 'Cost of Goods', value: c, type: 'fee' },
          { key: 'referral', label: `Referral Fee (${refRate}%)`, value: referralFee, type: 'fee' },
          { key: 'fba', label: 'FBA Fulfillment Fee', value: fbaFee, type: 'fee' },
          { key: 'total', label: 'Total Fees', value: totalFees, type: 'total' },
          { key: 'profit', label: 'Net Profit', value: profit, type: 'profit' },
        ],
        profit,
        profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0,
      };
    },
  },

  // ── Amazon Domestic India ─────────────────────────────────────────────────
  'domestic/amazon': {
    title: 'Amazon Price Calculator (India)',
    description: 'Estimate Amazon India seller fees for Easy Ship, Self Ship, or Seller Flex.',
    currency: '₹',
    // Same tier logic as fba/amazon — closing fee brackets + ₹300 zero-referral threshold.
    // Weight at Amazon Easy Ship slab boundaries (mirrors FBA slab structure).
    comparisons: [
      { key: 'price', label: 'Price Comparison', description: 'Spans Amazon India closing-fee tiers & the ₹300 zero-referral threshold', values: [199, 350, 750, 2500, 6000] },
    ],
    fields: [
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Electronics', options: ['Books','Mobile Phones','Electronics','Cameras & Photography','Computers','Clothing & Apparel','Shoes & Handbags','Home & Kitchen','Toys & Baby','Sports & Fitness','Automotive','Health & Beauty','Food & Gourmet','Industrial & Scientific','Jewelry (Fine)','Jewelry (Artificial)','Watches (≤₹5000)','Watches (>₹5000)','Other'] },
      { key: 'price', label: 'Selling Price (₹)', type: 'number', defaultValue: 500, min: 0, step: 1 },
      { key: 'weight', label: 'Product Weight (grams)', type: 'number', defaultValue: 400, min: 0, step: 1 },
      { key: 'area', label: 'Delivery Area', type: 'radio', defaultValue: 'National', options: ['Local','Regional','National'] },
      { key: 'method', label: 'Shipping Method', type: 'radio', defaultValue: 'Easy Ship', options: ['Easy Ship','Self Ship','Seller Flex'] },
      { key: 'gst', label: 'Product GST Rate', type: 'select', defaultValue: '18', options: [{ value: '0', label: '0%' },{ value: '5', label: '5%' },{ value: '12', label: '12%' },{ value: '18', label: '18%' },{ value: '28', label: '28%' }] },
    ],
    calculate({ category, price, weight, area, method, gst }) {
      const p = Number(price) || 0;
      const gstRate = Number(gst) || 0;
      const referralRate = amazonIndiaReferralRate(category, p);
      const referralFee = fmtR(p * referralRate / 100);
      const closingFee = amazonIndiaClosingFee(p);
      const baseShipping = amazonIndiaShipping(weight, area);
      const methodMultiplier = method === 'Self Ship' ? 0.6 : method === 'Seller Flex' ? 0.8 : 1;
      const shippingFee = fmtR(baseShipping * methodMultiplier);
      const subtotal = referralFee + closingFee + shippingFee;
      const gstOnFees = fmtR(subtotal * 0.18);
      const platformFees = fmtR(subtotal + gstOnFees);
      const productGST = fmtR(p * gstRate / 100);
      const totalDeductions = fmtR(platformFees + productGST);
      const profit = fmtR(p - totalDeductions);
      const rows = [
        { key: 'referral', label: `Referral Fee (${referralRate}%)`, value: referralFee, type: 'fee' },
        { key: 'closing', label: 'Closing Fee', value: closingFee, type: 'fee' },
        { key: 'shipping', label: `Shipping Fee (${method})`, value: shippingFee, type: 'fee' },
        { key: 'gstFees', label: 'GST on Fees (18%)', value: gstOnFees, type: 'fee' },
        { key: 'platformTotal', label: 'Platform Fees', value: platformFees, type: 'total' },
      ];
      if (gstRate > 0) rows.push({ key: 'productGST', label: `Product GST (${gstRate}%)`, value: productGST, type: 'fee' });
      rows.push({ key: 'total', label: 'Total Deductions', value: totalDeductions, type: 'total' });
      rows.push({ key: 'profit', label: 'Your Profit', value: profit, type: 'profit' });
      return { rows, profit, totalFees: totalDeductions, profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0 };
    },
  },

  // ── Flipkart ──────────────────────────────────────────────────────────────
  'domestic/flipkart': {
    title: 'Flipkart Seller Fees Calculator',
    description: 'Calculate Flipkart commission, fixed fees, and shipping costs to find your net margin.',
    currency: '₹',
    // Flipkart has no closing-fee tiers or zero-referral threshold; values represent
    // typical commission-heavy price segments. Weight at Flipkart's 500g shipping slabs.
    comparisons: [
      { key: 'price', label: 'Price Comparison', description: 'Typical Flipkart price bands — budget (₹299), mid (₹599/₹1299), premium (₹2499/₹4999)', values: [299, 599, 1299, 2499, 4999] },
    ],
    fields: [
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Electronics', options: ['Mobiles','Electronics','Clothing & Fashion','Books','Home & Kitchen','Appliances','Watches','Shoes & Footwear','Jewellery','Toys','Beauty & Personal Care','Sports & Fitness','Automotive','Food & Nutrition','Other'] },
      { key: 'price', label: 'Selling Price (₹)', type: 'number', defaultValue: 500, min: 0, step: 1 },
      { key: 'weight', label: 'Product Weight (grams)', type: 'number', defaultValue: 400, min: 0, step: 1 },
      { key: 'zone', label: 'Delivery Zone', type: 'radio', defaultValue: 'National', options: ['Local','Zonal','National'] },
      { key: 'fulfillment', label: 'Fulfillment Method', type: 'radio', defaultValue: 'Non-FBF', options: ['FBF','Non-FBF'] },
      { key: 'gst', label: 'Product GST Rate', type: 'select', defaultValue: '12', options: [{ value: '0', label: '0%' },{ value: '5', label: '5%' },{ value: '12', label: '12%' },{ value: '18', label: '18%' },{ value: '28', label: '28%' }] },
    ],
    calculate({ category, price, weight, zone, fulfillment, gst }) {
      const p = Number(price) || 0;
      const gstRate = Number(gst) || 0;
      const commissionRates = { 'Mobiles': 2.8, 'Electronics': 5, 'Clothing & Fashion': 15, 'Books': 12, 'Home & Kitchen': 15, 'Appliances': 10, 'Watches': 15, 'Shoes & Footwear': 20, 'Jewellery': 22, 'Toys': 12, 'Beauty & Personal Care': 15, 'Sports & Fitness': 10, 'Automotive': 9, 'Food & Nutrition': 12, 'Other': 15 };
      const fixedFees = { 'Mobiles': 10, 'Electronics': 15, 'Clothing & Fashion': 20, 'Books': 10, 'Home & Kitchen': 20, 'Appliances': 30, 'Watches': 20, 'Shoes & Footwear': 20, 'Jewellery': 25, 'Toys': 15, 'Beauty & Personal Care': 15, 'Sports & Fitness': 15, 'Automotive': 20, 'Food & Nutrition': 10, 'Other': 20 };
      const commRate = commissionRates[category] ?? 15;
      const commissionFee = fmtR(p * commRate / 100);
      const fixedFee = fixedFees[category] ?? 20;
      const shippingFee = fmtR(flipkartShipping(weight, zone, fulfillment));
      const subtotal = commissionFee + fixedFee + shippingFee;
      const gstOnFees = fmtR(subtotal * 0.18);
      const platformFees = fmtR(subtotal + gstOnFees);
      const productGST = fmtR(p * gstRate / 100);
      const totalDeductions = fmtR(platformFees + productGST);
      const profit = fmtR(p - totalDeductions);
      const rows = [
        { key: 'commission', label: `Commission (${commRate}%)`, value: commissionFee, type: 'fee' },
        { key: 'fixed', label: 'Fixed Fee', value: fixedFee, type: 'fee' },
        { key: 'shipping', label: `Shipping Fee (${fulfillment})`, value: shippingFee, type: 'fee' },
        { key: 'gstFees', label: 'GST on Fees (18%)', value: gstOnFees, type: 'fee' },
        { key: 'platformTotal', label: 'Platform Fees', value: platformFees, type: 'total' },
      ];
      if (gstRate > 0) rows.push({ key: 'productGST', label: `Product GST (${gstRate}%)`, value: productGST, type: 'fee' });
      rows.push({ key: 'total', label: 'Total Deductions', value: totalDeductions, type: 'total' });
      rows.push({ key: 'profit', label: 'Your Profit', value: profit, type: 'profit' });
      return { rows, profit, totalFees: totalDeductions, profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0 };
    },
  },

  // ── JioMart ───────────────────────────────────────────────────────────────
  'domestic/jiomart': {
    title: 'JioMart Price Calculator',
    description: 'Calculate JioMart referral, closing, and shipping fees to estimate your take-home profit.',
    currency: '₹',
    // JioMart uses the same closing-fee tier structure as Amazon India.
    // Weight at JioMart's 500g shipping slab boundaries (₹35/₹55/₹75 base + ₹15/slab).
    comparisons: [
      { key: 'price', label: 'Price Comparison', description: 'Spans JioMart closing-fee tiers (mirrors Amazon India: ≤₹250, ≤₹500, ≤₹1000, ≤₹5000, >₹5000)', values: [199, 350, 750, 2500, 6000] },
    ],
    fields: [
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Electronics', options: ['Crafts','Electronics','Fashion','Groceries','Home & Lifestyle','Industrial','Local Shops','Precious Jewellery'] },
      { key: 'price', label: 'Selling Price (₹)', type: 'number', defaultValue: 500, min: 0, step: 1 },
      { key: 'weight', label: 'Product Weight (grams)', type: 'number', defaultValue: 400, min: 0, step: 1 },
      { key: 'area', label: 'Delivery Area', type: 'radio', defaultValue: 'National', options: ['Local','Regional','National'] },
      { key: 'gst', label: 'Product GST Rate', type: 'select', defaultValue: '18', options: [{ value: '0', label: '0%' },{ value: '5', label: '5%' },{ value: '12', label: '12%' },{ value: '18', label: '18%' },{ value: '28', label: '28%' }] },
    ],
    calculate({ category, price, weight, area, gst }) {
      const p = Number(price) || 0;
      const gstRate = Number(gst) || 0;
      const refRates = { 'Crafts': 12, 'Electronics': 5, 'Fashion': 15, 'Groceries': 3, 'Home & Lifestyle': 12, 'Industrial': 10, 'Local Shops': 5, 'Precious Jewellery': 4 };
      const refRate = refRates[category] ?? 10;
      const referralFee = fmtR(p * refRate / 100);
      const closingFee = amazonIndiaClosingFee(p);
      const shippingFee = jioMartShipping(weight, area);
      const subtotal = referralFee + closingFee + shippingFee;
      const gstOnFees = fmtR(subtotal * 0.18);
      const platformFees = fmtR(subtotal + gstOnFees);
      const productGST = fmtR(p * gstRate / 100);
      const totalDeductions = fmtR(platformFees + productGST);
      const profit = fmtR(p - totalDeductions);
      const rows = [
        { key: 'referral', label: `Referral Fee (${refRate}%)`, value: referralFee, type: 'fee' },
        { key: 'closing', label: 'Closing Fee', value: closingFee, type: 'fee' },
        { key: 'shipping', label: 'Shipping Fee', value: shippingFee, type: 'fee' },
        { key: 'gstFees', label: 'GST on Fees (18%)', value: gstOnFees, type: 'fee' },
        { key: 'platformTotal', label: 'Platform Fees', value: platformFees, type: 'total' },
      ];
      if (gstRate > 0) rows.push({ key: 'productGST', label: `Product GST (${gstRate}%)`, value: productGST, type: 'fee' });
      rows.push({ key: 'total', label: 'Total Deductions', value: totalDeductions, type: 'total' });
      rows.push({ key: 'profit', label: 'Your Profit', value: profit, type: 'profit' });
      return { rows, profit, totalFees: totalDeductions, profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0 };
    },
  },

  // ── Meesho ────────────────────────────────────────────────────────────────
  'domestic/meesho': {
    title: 'Meesho Price Calculator',
    description: 'Meesho charges 0% commission. Calculate your selling price and profit after GST and shipping.',
    currency: '₹',
    fields: [
      { key: 'cost', label: 'Cost Price (₹)', type: 'number', defaultValue: 200, min: 0, step: 1 },
      { key: 'shipping', label: 'Shipping Charges (₹)', type: 'number', defaultValue: 50, min: 0, step: 1 },
      { key: 'gst', label: 'GST Rate (%)', type: 'number', defaultValue: 12, min: 0, max: 28, step: 1 },
    ],
    calculate({ cost, shipping, gst }) {
      const cp = Number(cost) || 0;
      const sh = Number(shipping) || 0;
      const gstRate = Number(gst) || 0;
      const gstAmount = fmtR(cp * gstRate / 100);
      const spExclGST = fmtR(cp + sh);
      const spInclGST = fmtR(spExclGST * (1 + gstRate / 100));
      const profit = fmtR(spInclGST - cp - sh);
      return {
        rows: [
          { key: 'cost', label: 'Cost Price', value: cp, type: 'fee' },
          { key: 'shipping', label: 'Shipping Charges', value: sh, type: 'fee' },
          { key: 'gst', label: `GST on Cost (${gstRate}%)`, value: gstAmount, type: 'fee' },
          { key: 'commission', label: 'Meesho Commission', value: 0, type: 'fee' },
          { key: 'spExcl', label: 'Selling Price (excl. GST)', value: spExclGST, type: 'total' },
          { key: 'spIncl', label: 'Selling Price (incl. GST)', value: spInclGST, type: 'total' },
          { key: 'profit', label: 'Your Profit', value: profit, type: 'profit' },
        ],
        profit,
        profitPercent: spInclGST > 0 ? fmtR((profit / spInclGST) * 100) : 0,
      };
    },
  },

  // ── Amazon International US ───────────────────────────────────────────────
  'international/amazon-us': {
    title: 'Amazon Price Calculator (US)',
    description: 'Calculate Amazon US referral fees and shipping costs to determine your profit margin.',
    currency: '$',
    fields: [
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Consumer Electronics', options: ['Amazon Devices & Accessories','Automotive','Baby Products','Beauty & Personal Care','Books','CDs & Vinyl','Cell Phones','Clothing & Accessories','Computers','Consumer Electronics','Furniture','Grocery','Handmade','Health & Household','Home & Garden','Jewelry','Kitchen','Luggage','Sports & Outdoors','Tools & Home Improvement','Toys & Games','Video Games','Watches','Other'] },
      { key: 'price', label: 'Selling Price ($)', type: 'number', defaultValue: 25, min: 0, step: 0.01 },
      { key: 'shipping', label: 'Shipping Cost ($)', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
    ],
    calculate({ category, price, shipping }) {
      const p = Number(price) || 0;
      const sh = Number(shipping) || 0;
      const refRate = amazonUSReferralRate(category, p);
      const referralFee = fmtR(p * refRate / 100);
      const totalFees = fmtR(referralFee + sh);
      const profit = fmtR(p - totalFees);
      return {
        rows: [
          { key: 'referral', label: `Referral Fee (${refRate}%)`, value: referralFee, type: 'fee' },
          { key: 'shipping', label: 'Shipping Cost', value: sh, type: 'fee' },
          { key: 'total', label: 'Total Fees', value: totalFees, type: 'total' },
          { key: 'profit', label: 'Your Profit', value: profit, type: 'profit' },
        ],
        profit,
        profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0,
      };
    },
  },

  // ── Amazon International UK ───────────────────────────────────────────────
  'international/amazon-uk': {
    title: 'Amazon Price Calculator (UK)',
    description: 'Calculate Amazon UK referral fees in GBP and determine your selling profit.',
    currency: '£',
    fields: [
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Consumer Electronics', options: ['Books','Consumer Electronics','Clothing & Accessories','Home & Garden','Jewelry','Kitchen & Home','Shoes & Bags','Sports & Outdoors','Toys & Games','Automotive','Baby','Health & Beauty','Other'] },
      { key: 'price', label: 'Selling Price (£)', type: 'number', defaultValue: 20, min: 0, step: 0.01 },
      { key: 'shipping', label: 'Shipping Cost (£)', type: 'number', defaultValue: 4, min: 0, step: 0.01 },
    ],
    calculate({ category, price, shipping }) {
      const p = Number(price) || 0;
      const sh = Number(shipping) || 0;
      const refRate = amazonUKReferralRate(category, p);
      const referralFee = fmtR(p * refRate / 100);
      const totalFees = fmtR(referralFee + sh);
      const profit = fmtR(p - totalFees);
      return {
        rows: [
          { key: 'referral', label: `Referral Fee (${refRate}%)`, value: referralFee, type: 'fee' },
          { key: 'shipping', label: 'Shipping Cost', value: sh, type: 'fee' },
          { key: 'total', label: 'Total Fees', value: totalFees, type: 'total' },
          { key: 'profit', label: 'Your Profit', value: profit, type: 'profit' },
        ],
        profit,
        profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0,
      };
    },
  },

  // ── eBay ──────────────────────────────────────────────────────────────────
  'international/ebay': {
    title: 'eBay Price Calculator',
    description: 'Find the right selling price on eBay to cover all fees and hit your desired profit.',
    currency: '$',
    fields: [
      { key: 'itemCost', label: 'Item Cost ($)', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
      { key: 'shippingCost', label: 'Shipping Cost ($)', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
      { key: 'desiredProfit', label: 'Desired Profit ($)', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
      { key: 'fvfRate', label: 'Final Value Fee (%)', type: 'number', defaultValue: 12.9, min: 0, max: 30, step: 0.1 },
      { key: 'listingType', label: 'Listing Type', type: 'radio', defaultValue: 'Fixed Price', options: ['Fixed Price','Auction'] },
    ],
    calculate({ itemCost, shippingCost, desiredProfit, fvfRate, listingType }) {
      const cost = Number(itemCost) || 0;
      const sh = Number(shippingCost) || 0;
      const profit = Number(desiredProfit) || 0;
      const fvf = Number(fvfRate) || 12.9;
      const listingFee = 0.35;
      const paymentRate = 0.029;
      const paymentFixed = 0.30;
      // SP = (cost + sh + profit + listingFee + paymentFixed) / (1 - fvf/100 - paymentRate)
      const suggestedSP = fmtR((cost + sh + profit + listingFee + paymentFixed) / (1 - fvf / 100 - paymentRate));
      const finalValueFee = fmtR(suggestedSP * fvf / 100);
      const paymentFee = fmtR(suggestedSP * paymentRate + paymentFixed);
      const totalCosts = fmtR(cost + sh + listingFee + finalValueFee + paymentFee);
      const actualProfit = fmtR(suggestedSP - totalCosts);
      return {
        rows: [
          { key: 'itemCost', label: 'Item Cost', value: cost, type: 'fee' },
          { key: 'shipping', label: 'Shipping Cost', value: sh, type: 'fee' },
          { key: 'listing', label: `Listing Fee (${listingType})`, value: listingFee, type: 'fee' },
          { key: 'fvf', label: `Final Value Fee (${fvf}%)`, value: finalValueFee, type: 'fee' },
          { key: 'payment', label: 'Payment Processing (2.9% + $0.30)', value: paymentFee, type: 'fee' },
          { key: 'total', label: 'Total Costs', value: totalCosts, type: 'total' },
          { key: 'sp', label: 'Suggested Selling Price', value: suggestedSP, type: 'total' },
          { key: 'profit', label: 'Actual Profit', value: actualProfit, type: 'profit' },
        ],
        profit: actualProfit,
        profitPercent: suggestedSP > 0 ? fmtR((actualProfit / suggestedSP) * 100) : 0,
      };
    },
  },

  // ── Etsy ──────────────────────────────────────────────────────────────────
  'international/etsy': {
    title: 'Etsy Price Calculator',
    description: 'Calculate Etsy listing, transaction, and payment fees to find your true profit margin.',
    currency: '$',
    fields: [
      { key: 'price', label: 'Product Price ($)', type: 'number', defaultValue: 30, min: 0, step: 0.01 },
      { key: 'shipping', label: 'Shipping Fee ($)', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
      { key: 'productionCost', label: 'Production Cost ($)', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
      { key: 'offsiteAds', label: 'Offsite Ads Fee', type: 'select', defaultValue: '15', options: [{ value: '15', label: '15% (shops < $10k/yr)' },{ value: '12', label: '12% (shops > $10k/yr)' },{ value: '0', label: 'Opted Out' }] },
      { key: 'vatRate', label: 'VAT Rate (%)', type: 'number', defaultValue: 0, min: 0, max: 30, step: 0.5 },
    ],
    calculate({ price, shipping, productionCost, offsiteAds, vatRate }) {
      const p = Number(price) || 0;
      const sh = Number(shipping) || 0;
      const pc = Number(productionCost) || 0;
      const adsRate = Number(offsiteAds) || 0;
      const vat = Number(vatRate) || 0;
      const listingFee = 0.20;
      const transactionFee = fmtR((p + sh) * 0.065);
      const paymentFee = fmtR((p + sh) * 0.03 + 0.25);
      const offsiteFee = fmtR((p + sh) * adsRate / 100);
      const vatAmount = fmtR((p + sh) * vat / 100);
      const totalFees = fmtR(listingFee + transactionFee + paymentFee + offsiteFee + vatAmount);
      const profit = fmtR(p + sh - pc - totalFees);
      const rows = [
        { key: 'listing', label: 'Listing Fee ($0.20/item)', value: listingFee, type: 'fee' },
        { key: 'transaction', label: 'Transaction Fee (6.5%)', value: transactionFee, type: 'fee' },
        { key: 'payment', label: 'Payment Processing (3% + $0.25)', value: paymentFee, type: 'fee' },
      ];
      if (adsRate > 0) rows.push({ key: 'offsite', label: `Offsite Ads (${adsRate}%)`, value: offsiteFee, type: 'fee' });
      if (vat > 0) rows.push({ key: 'vat', label: `VAT (${vat}%)`, value: vatAmount, type: 'fee' });
      rows.push({ key: 'total', label: 'Total Fees', value: totalFees, type: 'total' });
      rows.push({ key: 'profit', label: 'Net Profit', value: profit, type: 'profit' });
      return { rows, profit, profitPercent: (p + sh) > 0 ? fmtR((profit / (p + sh)) * 100) : 0 };
    },
  },

  // ── Walmart ───────────────────────────────────────────────────────────────
  'international/walmart': {
    title: 'Walmart Seller Calculator',
    description: 'Calculate Walmart marketplace referral fees with no setup or monthly costs.',
    currency: '$',
    fields: [
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Home & Garden', options: ['Apparel & Accessories','Automotive','Baby','Beauty','Books','Consumer Electronics','Home & Garden','Jewelry','Kitchen','Sporting Goods','Tires & Wheels','Tools','Toys & Games','Video Games','Wireless Phones','Other'] },
      { key: 'price', label: 'Selling Price ($)', type: 'number', defaultValue: 25, min: 0, step: 0.01 },
      { key: 'shipping', label: 'Shipping Cost ($)', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
    ],
    calculate({ category, price, shipping }) {
      const p = Number(price) || 0;
      const sh = Number(shipping) || 0;
      const refRate = walmartReferralRate(category, p);
      const referralFee = fmtR(p * refRate / 100);
      const totalFees = fmtR(referralFee + sh);
      const profit = fmtR(p - totalFees);
      return {
        rows: [
          { key: 'referral', label: `Referral Fee (${refRate}%)`, value: referralFee, type: 'fee' },
          { key: 'shipping', label: 'Shipping Cost', value: sh, type: 'fee' },
          { key: 'total', label: 'Total Fees', value: totalFees, type: 'total' },
          { key: 'profit', label: 'Your Profit', value: profit, type: 'profit' },
        ],
        profit,
        profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0,
      };
    },
  },

  // ── Alibaba ───────────────────────────────────────────────────────────────
  'international/alibaba': {
    title: 'Alibaba Price Calculator',
    description: 'Estimate your per-unit cost on Alibaba including membership, payment processing, and shipping.',
    currency: '$',
    fields: [
      { key: 'productPrice', label: 'Product Price ($)', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
      { key: 'commission', label: 'Commission (%)', type: 'number', defaultValue: 0, min: 0, max: 30, step: 0.1 },
      { key: 'paymentFeeRate', label: 'Payment Processing (%)', type: 'number', defaultValue: 3.5, min: 0, max: 10, step: 0.1 },
      { key: 'membershipMonthly', label: 'Monthly Membership ($)', type: 'number', defaultValue: 1000, min: 0, step: 10 },
      { key: 'unitsPerMonth', label: 'Units Sold per Month', type: 'number', defaultValue: 100, min: 1, step: 1 },
      { key: 'shippingPerUnit', label: 'Shipping per Unit ($)', type: 'number', defaultValue: 2, min: 0, step: 0.01 },
    ],
    calculate({ productPrice, commission, paymentFeeRate, membershipMonthly, unitsPerMonth, shippingPerUnit }) {
      const pp = Number(productPrice) || 0;
      const comm = Number(commission) || 0;
      const payRate = Number(paymentFeeRate) || 3.5;
      const membership = Number(membershipMonthly) || 1000;
      const units = Math.max(1, Number(unitsPerMonth) || 1);
      const sh = Number(shippingPerUnit) || 0;
      const commFee = fmtR(pp * comm / 100);
      const payFee = fmtR(pp * payRate / 100);
      const membershipPerUnit = fmtR(membership / units);
      const totalCost = fmtR(pp + commFee + payFee + membershipPerUnit + sh);
      const suggestedSP = fmtR(totalCost / 0.8);
      const profitAtSuggestedSP = fmtR(suggestedSP - totalCost);
      return {
        rows: [
          { key: 'product', label: 'Product Cost', value: pp, type: 'fee' },
          { key: 'commission', label: `Commission (${comm}%)`, value: commFee, type: 'fee' },
          { key: 'payment', label: `Payment Processing (${payRate}%)`, value: payFee, type: 'fee' },
          { key: 'membership', label: 'Membership/Unit', value: membershipPerUnit, type: 'fee' },
          { key: 'shipping', label: 'Shipping/Unit', value: sh, type: 'fee' },
          { key: 'total', label: 'Total Cost/Unit', value: totalCost, type: 'total' },
          { key: 'sp', label: 'Required Selling Price (20% margin)', value: suggestedSP, type: 'total' },
          { key: 'profit', label: 'Profit at Suggested Price', value: profitAtSuggestedSP, type: 'profit' },
        ],
        profit: profitAtSuggestedSP,
        profitPercent: 20,
      };
    },
  },

  // ── General Ecommerce Seller Fees ─────────────────────────────────────────
  'other/seller-fees': {
    title: 'Ecommerce Seller Fees Calculator',
    description: 'Compare seller fees across Amazon, Flipkart, Meesho, and JioMart in one place.',
    currency: '₹',
    fields: [
      { key: 'platform', label: 'Marketplace Platform', type: 'select', defaultValue: 'Amazon India', options: ['Amazon India','Flipkart','JioMart','Meesho'] },
      { key: 'category', label: 'Product Category', type: 'select', defaultValue: 'Electronics', options: ['Electronics','Clothing & Fashion','Books','Home & Kitchen','Mobile Phones','Toys & Baby','Sports & Fitness','Health & Beauty','Food & Gourmet','Automotive','Shoes','Jewellery','Other'] },
      { key: 'price', label: 'Selling Price (₹)', type: 'number', defaultValue: 500, min: 0, step: 1 },
      { key: 'weight', label: 'Product Weight (grams)', type: 'number', defaultValue: 400, min: 0, step: 1 },
      { key: 'gst', label: 'GST Rate', type: 'select', defaultValue: '18', options: [{ value: '0', label: '0%' },{ value: '5', label: '5%' },{ value: '12', label: '12%' },{ value: '18', label: '18%' },{ value: '28', label: '28%' }] },
    ],
    calculate({ platform, category, price, weight, gst }) {
      const p = Number(price) || 0;
      // Map general category to platform-specific where needed
      const catMap = { 'Electronics': 'Electronics', 'Clothing & Fashion': 'Clothing & Apparel', 'Books': 'Books', 'Home & Kitchen': 'Home & Kitchen', 'Mobile Phones': 'Mobile Phones', 'Toys & Baby': 'Toys & Baby', 'Sports & Fitness': 'Sports & Fitness', 'Health & Beauty': 'Health & Beauty', 'Food & Gourmet': 'Food & Gourmet', 'Automotive': 'Automotive', 'Shoes': 'Shoes & Handbags', 'Jewellery': 'Jewellery', 'Other': 'Other' };
      const mappedCat = catMap[category] || 'Other';

      let rows, profit;
      if (platform === 'Amazon India') {
        const refRate = amazonIndiaReferralRate(mappedCat, p);
        const referralFee = fmtR(p * refRate / 100);
        const closingFee = amazonIndiaClosingFee(p);
        const shippingFee = amazonIndiaShipping(weight, 'National');
        const subtotal = referralFee + closingFee + shippingFee;
        const gstOnFees = fmtR(subtotal * 0.18);
        const totalFees = fmtR(subtotal + gstOnFees);
        profit = fmtR(p - totalFees);
        rows = [
          { key: 'referral', label: `Referral Fee (${refRate}%)`, value: referralFee, type: 'fee' },
          { key: 'closing', label: 'Closing Fee', value: closingFee, type: 'fee' },
          { key: 'shipping', label: 'Shipping Fee (National)', value: shippingFee, type: 'fee' },
          { key: 'gst', label: 'GST on Fees (18%)', value: gstOnFees, type: 'fee' },
          { key: 'total', label: 'Total Fees', value: totalFees, type: 'total' },
          { key: 'profit', label: 'Your Profit', value: profit, type: 'profit' },
        ];
      } else if (platform === 'Flipkart') {
        const commRates = { 'Electronics': 5, 'Clothing & Apparel': 15, 'Books': 12, 'Home & Kitchen': 15, 'Mobile Phones': 2.8, 'Toys & Baby': 12, 'Sports & Fitness': 10, 'Health & Beauty': 15, 'Food & Gourmet': 12, 'Automotive': 9, 'Shoes & Handbags': 20, 'Jewellery': 22, 'Other': 15 };
        const commRate = commRates[mappedCat] ?? 15;
        const commFee = fmtR(p * commRate / 100);
        const fixedFee = 20;
        const shippingFee = fmtR(flipkartShipping(weight, 'National', 'Non-FBF'));
        const subtotal = commFee + fixedFee + shippingFee;
        const gstOnFees = fmtR(subtotal * 0.18);
        const totalFees = fmtR(subtotal + gstOnFees);
        profit = fmtR(p - totalFees);
        rows = [
          { key: 'commission', label: `Commission (${commRate}%)`, value: commFee, type: 'fee' },
          { key: 'fixed', label: 'Fixed Fee', value: fixedFee, type: 'fee' },
          { key: 'shipping', label: 'Shipping Fee (National)', value: shippingFee, type: 'fee' },
          { key: 'gst', label: 'GST on Fees (18%)', value: gstOnFees, type: 'fee' },
          { key: 'total', label: 'Total Fees', value: totalFees, type: 'total' },
          { key: 'profit', label: 'Your Profit', value: profit, type: 'profit' },
        ];
      } else if (platform === 'JioMart') {
        const refRates = { 'Electronics': 5, 'Clothing & Apparel': 15, 'Books': 10, 'Home & Kitchen': 12, 'Mobile Phones': 5, 'Toys & Baby': 10, 'Sports & Fitness': 10, 'Health & Beauty': 12, 'Food & Gourmet': 3, 'Automotive': 10, 'Shoes & Handbags': 12, 'Jewellery': 4, 'Other': 10 };
        const refRate = refRates[mappedCat] ?? 10;
        const referralFee = fmtR(p * refRate / 100);
        const closingFee = amazonIndiaClosingFee(p);
        const shippingFee = jioMartShipping(weight, 'National');
        const subtotal = referralFee + closingFee + shippingFee;
        const gstOnFees = fmtR(subtotal * 0.18);
        const totalFees = fmtR(subtotal + gstOnFees);
        profit = fmtR(p - totalFees);
        rows = [
          { key: 'referral', label: `Referral Fee (${refRate}%)`, value: referralFee, type: 'fee' },
          { key: 'closing', label: 'Closing Fee', value: closingFee, type: 'fee' },
          { key: 'shipping', label: 'Shipping Fee (National)', value: shippingFee, type: 'fee' },
          { key: 'gst', label: 'GST on Fees (18%)', value: gstOnFees, type: 'fee' },
          { key: 'total', label: 'Total Fees', value: totalFees, type: 'total' },
          { key: 'profit', label: 'Your Profit', value: profit, type: 'profit' },
        ];
      } else {
        // Meesho
        const spExcl = fmtR(p + 50);
        const spIncl = fmtR(spExcl * 1.12);
        profit = fmtR(spIncl - p - 50);
        rows = [
          { key: 'cost', label: 'Your Cost Price', value: p, type: 'fee' },
          { key: 'shipping', label: 'Shipping (estimated)', value: 50, type: 'fee' },
          { key: 'commission', label: 'Commission (0%)', value: 0, type: 'fee' },
          { key: 'spExcl', label: 'Selling Price (excl. GST)', value: spExcl, type: 'total' },
          { key: 'spIncl', label: 'Selling Price (incl. 12% GST)', value: spIncl, type: 'total' },
          { key: 'profit', label: 'Your Profit', value: profit, type: 'profit' },
        ];
      }
      return { rows, profit, profitPercent: p > 0 ? fmtR((profit / p) * 100) : 0 };
    },
  },

  // ── Volumetric Weight ─────────────────────────────────────────────────────
  'other/volumetric-weight': {
    title: 'Volumetric Weight Calculator',
    description: 'Find the chargeable shipping weight based on package dimensions and carrier divisor.',
    currency: '',
    fields: [
      { key: 'length', label: 'Length (cm)', type: 'number', defaultValue: 30, min: 0, step: 0.1 },
      { key: 'width', label: 'Width (cm)', type: 'number', defaultValue: 20, min: 0, step: 0.1 },
      { key: 'height', label: 'Height (cm)', type: 'number', defaultValue: 15, min: 0, step: 0.1 },
      { key: 'carrier', label: 'Carrier / Method', type: 'select', defaultValue: 'Air (÷5000)', options: ['Air (÷5000)','Ground (÷4000)','FedEx / UPS (÷5000)','Custom'] },
      { key: 'customDivisor', label: 'Custom Divisor', type: 'number', defaultValue: 5000, min: 1, step: 1 },
      { key: 'actualWeight', label: 'Actual Weight (kg)', type: 'number', defaultValue: 1.2, min: 0, step: 0.01 },
    ],
    calculate({ length, width, height, carrier, customDivisor, actualWeight }) {
      const l = Number(length) || 0;
      const w = Number(width) || 0;
      const h = Number(height) || 0;
      const aw = Number(actualWeight) || 0;
      const divisorMap = { 'Air (÷5000)': 5000, 'Ground (÷4000)': 4000, 'FedEx / UPS (÷5000)': 5000, 'Custom': Number(customDivisor) || 5000 };
      const divisor = divisorMap[carrier] ?? 5000;
      const volume = fmtR(l * w * h);
      const volumetricWeight = fmtR(volume / divisor);
      const chargeableWeight = fmtR(Math.max(aw, volumetricWeight));
      const isVolumetric = volumetricWeight >= aw;
      return {
        rows: [
          { key: 'volume', label: 'Package Volume (cm³)', value: volume, type: 'fee', unit: 'cm³' },
          { key: 'divisor', label: `Carrier Divisor`, value: divisor, type: 'fee', unit: '' },
          { key: 'volumetric', label: 'Volumetric Weight (kg)', value: volumetricWeight, type: 'fee', unit: 'kg' },
          { key: 'actual', label: 'Actual Weight (kg)', value: aw, type: 'fee', unit: 'kg' },
          { key: 'chargeable', label: `Chargeable Weight (${isVolumetric ? 'volumetric' : 'actual'})`, value: chargeableWeight, type: 'profit', unit: 'kg' },
        ],
        profit: chargeableWeight,
        profitPercent: null,
      };
    },
  },

  // ── Finance Margin ────────────────────────────────────────────────────────
  'other/finance-margin': {
    title: 'Finance Margin Calculator',
    description: 'Calculate profit margin, markup percentage, and net profit from cost and selling price.',
    currency: '₹',
    fields: [
      { key: 'costPrice', label: 'Cost Price (₹)', type: 'number', defaultValue: 300, min: 0, step: 1 },
      { key: 'sellingPrice', label: 'Selling Price (₹)', type: 'number', defaultValue: 500, min: 0, step: 1 },
    ],
    calculate({ costPrice, sellingPrice }) {
      const cp = Number(costPrice) || 0;
      const sp = Number(sellingPrice) || 0;
      const profit = fmtR(sp - cp);
      const margin = sp > 0 ? fmtR((profit / sp) * 100) : 0;
      const markup = cp > 0 ? fmtR((profit / cp) * 100) : 0;
      return {
        rows: [
          { key: 'cost', label: 'Cost Price', value: cp, type: 'fee' },
          { key: 'sp', label: 'Selling Price', value: sp, type: 'fee' },
          { key: 'profit', label: 'Profit Amount', value: profit, type: 'profit' },
          { key: 'margin', label: 'Profit Margin (%)', value: margin, type: 'total', unit: '%' },
          { key: 'markup', label: 'Markup (%)', value: markup, type: 'total', unit: '%' },
        ],
        profit,
        profitPercent: margin,
      };
    },
  },

  // ── Age Calculator ────────────────────────────────────────────────────────
  'other/age': {
    title: 'Age Calculator',
    description: 'Find your exact age in years, months, and days from your date of birth.',
    currency: '',
    isAgeCalc: true,
    fields: [
      { key: 'dob', label: 'Date of Birth', type: 'date', defaultValue: '1995-01-01' },
      { key: 'refDate', label: 'Reference Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
    ],
    calculate({ dob, refDate }) {
      if (!dob || !refDate) return { rows: [], ageYears: 0, ageMonths: 0, ageDays: 0 };
      const birth = new Date(dob);
      const ref = new Date(refDate);
      if (isNaN(birth) || isNaN(ref) || ref < birth) return { rows: [], ageYears: 0, ageMonths: 0, ageDays: 0 };
      let years = ref.getFullYear() - birth.getFullYear();
      let months = ref.getMonth() - birth.getMonth();
      let days = ref.getDate() - birth.getDate();
      if (days < 0) { months -= 1; const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0); days += prevMonth.getDate(); }
      if (months < 0) { years -= 1; months += 12; }
      return { rows: [], ageYears: years, ageMonths: months, ageDays: days, profit: years, profitPercent: null };
    },
  },

  // ── Pythagorean Theorem ───────────────────────────────────────────────────
  'other/pythagorean': {
    title: 'Pythagorean Theorem Calculator',
    description: 'Solve for any side of a right triangle using a² + b² = c².',
    currency: '',
    isPythagorean: true,
    fields: [
      { key: 'mode', label: 'Find', type: 'radio', defaultValue: 'Find C', options: ['Find C','Find B','Find A'] },
      { key: 'sideA', label: 'Side A', type: 'number', defaultValue: 3, min: 0, step: 0.01 },
      { key: 'sideB', label: 'Side B', type: 'number', defaultValue: 4, min: 0, step: 0.01 },
      { key: 'sideC', label: 'Side C (hypotenuse)', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
      { key: 'unit', label: 'Unit', type: 'select', defaultValue: 'cm', options: ['cm','m','mm','in','ft'] },
    ],
    calculate({ mode, sideA, sideB, sideC, unit }) {
      const a = Number(sideA) || 0;
      const b = Number(sideB) || 0;
      const c = Number(sideC) || 0;
      let result, formula, label;
      if (mode === 'Find C') {
        result = fmtR(Math.sqrt(a * a + b * b));
        formula = `c = √(${a}² + ${b}²) = ${result} ${unit}`;
        label = `Hypotenuse C`;
      } else if (mode === 'Find B') {
        result = c * c - a * a >= 0 ? fmtR(Math.sqrt(c * c - a * a)) : null;
        formula = result != null ? `b = √(${c}² - ${a}²) = ${result} ${unit}` : 'Invalid: c must be > a';
        label = `Side B`;
      } else {
        result = c * c - b * b >= 0 ? fmtR(Math.sqrt(c * c - b * b)) : null;
        formula = result != null ? `a = √(${c}² - ${b}²) = ${result} ${unit}` : 'Invalid: c must be > b';
        label = `Side A`;
      }
      return { rows: [], result, formula, label, unit, profit: result, profitPercent: null };
    },
  },
};

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    children: [
      { label: 'Amazon seller account management registration', href: '/services/amazon' },
      { label: 'Flipkart seller account management registration', href: '/services/flipkart' },
      { label: 'Meesho seller account management registration', href: '/services/meesho' },
      { label: 'Jiomart seller account management registration', href: '/services/jiomart' },
    ],
  },
  {
    label: 'Calculator',
    children: [
      {
        label: 'FBA Calculator',
        children: [
          { label: 'Amazon FBA calculator', href: '/calculators/fba/amazon' },
          { label: 'Amazon FBA calculator US', href: '/calculators/fba/amazon-us' },
          { label: 'Amazon FBA calculator UK', href: '/calculators/fba/amazon-uk' },
        ],
      },
      {
        label: 'Domestic Calculator',
        children: [
          { label: 'Amazon price calculator', href: '/calculators/domestic/amazon' },
          { label: 'Flipkart seller fees calculator', href: '/calculators/domestic/flipkart' },
          { label: 'Jiomart price calculator', href: '/calculators/domestic/jiomart' },
          { label: 'Meesho price calculator', href: '/calculators/domestic/meesho' },
        ],
      },
      {
        label: 'International Calculator',
        children: [
          { label: 'Amazon price calculator US', href: '/calculators/international/amazon-us' },
          { label: 'Amazon price calculator UK', href: '/calculators/international/amazon-uk' },
          { label: 'eBay price calculator', href: '/calculators/international/ebay' },
          { label: 'Etsy price calculator', href: '/calculators/international/etsy' },
          { label: 'Walmart seller calculator', href: '/calculators/international/walmart' },
          { label: 'Alibaba price calculator', href: '/calculators/international/alibaba' },
        ],
      },
      {
        label: 'Other Calculator',
        children: [
          { label: 'Ecommerce seller fees calculator', href: '/calculators/other/seller-fees' },
          { label: 'Volumetric weight calculator', href: '/calculators/other/volumetric-weight' },
          { label: 'Finance margin calculator', href: '/calculators/other/finance-margin' },
          { label: 'Age calculator', href: '/calculators/other/age' },
          { label: 'Pythagorean theorem calculator', href: '/calculators/other/pythagorean' },
        ],
      },
    ],
  },
  { label: 'Blogs', href: '/blogs' },
  {
    label: 'Ecommerce Management',
    children: [
      { label: 'Alibaba seller account management', href: '/management/alibaba' },
      { label: 'Amazon seller account management', href: '/management/amazon' },
      { label: 'Etsy seller account management', href: '/management/etsy' },
      { label: 'Walmart seller account management', href: '/management/walmart' },
      { label: 'Flipkart seller account management', href: '/management/flipkart' },
      { label: 'Jiomart seller account management', href: '/management/jiomart' },
      { label: 'Meesho seller account management', href: '/management/meesho' },
    ],
  },
  {
    label: 'Free Onboarding',
    children: [
      { label: 'Amazon global onboarding', href: '/onboarding/amazon' },
      { label: 'eBay onboarding', href: '/onboarding/ebay' },
    ],
  },
  {
    label: 'Who We Are',
    children: [
      { label: 'Careers', href: '/careers' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

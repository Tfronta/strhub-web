export default {
consent: {
  label: "Analytics consent",
  body: "We use cookies to see which parts of STRhub are used most, so we can improve it.",
  privacyLink: "Learn more",
  accept: "Accept",
  decline: "Only necessary",
  close: "Close",
  current: {
    granted: "Analytics is on.",
    denied: "Analytics is off.",
  },
  preferences: "Cookie preferences",
},
privacy: {
  title: "Privacy",
  lead: "What STRhub measures, why, and how to switch it off.",
  updated: "Last updated: 11 November 2026",
  who: {
    heading: "Who is responsible",
    body: "STRhub is an open-access project maintained by Tamara Frontanilla. For anything about your data, write to",
  },
  measure: {
    heading: "What we measure",
    body: "We use Google Analytics 4 to understand how the site is used: pages visited, which tools and tutorials people use (for example, which marker is opened in the Motif Explorer or which tutorial command is copied), the interface language, device and browser type, and approximate location (country and city). Analytics collects no names or email addresses, we show no ads, and we sell no data. Google processes this data, also in the United States, under the EU-US Data Privacy Framework.",
  },
  when: {
    heading: "When Analytics stores cookies",
    consentRegion: "In the European Economic Area, the United Kingdom and Switzerland, Google Analytics stores cookies only after you accept. Until you choose, or if you decline, it stores nothing in your browser, and Google receives only signals without identifiers that it uses to estimate visits.",
    elsewhere: "Elsewhere, Analytics is on by default. Anyone can turn it on or off at any time from Cookie preferences, at the foot of every page.",
  },
  storage: {
    heading: "What the site keeps in your browser",
    name: "Name",
    purpose: "Purpose",
    duration: "Duration",
    language: "Remembers the language you chose.",
    consent: "Remembers your Analytics choice.",
    theme: "Remembers light or dark mode.",
    verified: "Keeps a STRhub Verified form draft while the tab is open.",
    analytics: "Google Analytics: tells visits apart. Only with your consent where consent is required.",
    oneYear: "1 year",
    untilCleared: "Until you clear it",
    untilTabClosed: "Until you close the tab",
    upToTwoYears: "Up to 2 years",
  },
  videos: {
    heading: "Videos",
    body: "Tutorial videos come from YouTube in privacy-enhanced mode (youtube-nocookie.com) and load only when you press play. From then on, YouTube's privacy policy applies.",
  },
  hosting: {
    heading: "Hosting",
    body: "The site runs on Vercel, which processes technical data such as your IP address to deliver pages and protect the service.",
  },
  rights: {
    heading: "Your choice",
    body: "Withdrawing consent is as easy as giving it: open Cookie preferences and choose Only necessary. In the European Union you can also contact your data protection authority.",
  },
},
} as const

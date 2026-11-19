/* =====================================================================
   EVOLURA TECHNOLOGIES — WEBSITE CONFIGURATION (v2)
   Edit this file for every text, service, office or colour change.
   Save, refresh, done. No build step.

   Content rule: describe what Evolura does and how it works. Add client
   names, logos, statistics or case studies only when they are real.
   ===================================================================== */
window.SITE = {

  brand: {
    name: "Evolura",
    legalName: "Evolura Technologies",
    suffix: "Technologies",
    tagline: "Evolve with intelligence."
  },

  theme: {
    ink: "#0B1220",        // dark hero, credentials band, footer
    body: "#3B4556",
    muted: "#6B7588",
    bg: "#FFFFFF",
    soft: "#F5F6F8",
    line: "#E3E6EC",
    accent: "#2F4FD8",
    accentSoft: "#E9EDFC",
    glowA: "#5B7CFF",      // 3D hero particle colours
    glowB: "#5EE3F5"
  },

  contact: {
    email: "hello@evolura.example",        // TODO your real email
    phone: "",                              // TODO e.g. "+92 300 0000000" ("" hides it)
    whatsapp: "",                           // TODO digits only ("" hides it)
    linkedin: "",                           // TODO company LinkedIn URL
    web3formsKey: "",                       // free key from https://web3forms.com; empty = form opens email app
    replyPromise: "We reply within one business day."   // TODO keep only if true
  },

  /* TODO add real offices; while empty, the footer shows deliveryNote instead. */
  offices: [
    // { city: "Lahore", country: "Pakistan", address: "Street, area", phone: "+92 ..." }
  ],
  deliveryNote: "Serving clients in the UK, United States, the Gulf and Pakistan.",

  nav: [
    { label: "Services", href: "#services" },
    { label: "Industries", href: "#industries" },
    { label: "Approach", href: "#approach" },
    { label: "About", href: "#about" }
  ],

  hero: {
    eyebrow: "Software · Cloud · Microsoft business applications",
    title: "We build the systems your business runs on.",
    text: "Evolura Technologies designs, builds and supports business software: Microsoft Dynamics 365 and Power Platform, web and mobile applications, integrations and AI. One accountable team, from the first workshop to long-term support.",
    primary: "Discuss your project",
    secondary: "Explore services",
    /* The 3D particle form morphs through these shapes. Each has a word shown under it. */
    scenes: [
      { shape: "sphere", word: "Plan" },
      { shape: "knot", word: "Connect" },
      { shape: "helix", word: "Automate" },
      { shape: "lattice", word: "Scale" }
    ]
  },

  serviceGroups: [
    { id: "all", label: "All services" },
    { id: "apps", label: "Business applications" },
    { id: "digital", label: "Web, mobile and software" },
    { id: "ai", label: "AI and cloud" }
  ],

  services: [
    { id: "fo", group: "apps", title: "Dynamics 365 Finance & Operations",
      short: "Implementation, extension and support across finance, supply chain, projects and warehouse.",
      points: ["Fit-gap analysis and solution design", "Configuration of finance, procurement, inventory, sales and warehouse",
               "X++ extensions, workflows, batch jobs and business events", "SSRS, Electronic Reporting and Excel add-in reports",
               "Security roles and environment management"] },
    { id: "projops", group: "apps", title: "Project Operations",
      short: "Project accounting, expenses and billing kept in step between Finance & Operations and Dataverse.",
      points: ["Project, expense and transaction category setup", "Dual-write maps, including custom fields",
               "Billing and calculation automation", "Sync monitoring and error handling"] },
    { id: "ce", group: "apps", title: "Dynamics 365 Customer Engagement",
      short: "Sales and customer service on Dataverse, connected to the ERP behind them.",
      points: ["Sales and customer service configuration", "Integration with Finance & Operations", "Data migration and user training"] },
    { id: "power", group: "apps", title: "Power Platform",
      short: "Power Apps, Power Automate and Power BI built with the governance your IT team expects.",
      points: ["Model-driven and canvas apps on Dataverse", "Automated approvals and processes",
               "Power BI reporting on business data", "Solutions, environments and deployment pipelines"] },
    { id: "migration", group: "apps", title: "Data migration and upgrades",
      short: "Moves from AX 2012 and legacy systems to Dynamics 365, rehearsed and reconciled before cutover.",
      points: ["Mapping and cleansing of master data and balances", "Repeated trial loads", "Reconciliation until the numbers match", "Cutover planning and go-live support"] },

    { id: "web", group: "digital", title: "Web development",
      short: "Fast, secure websites, portals and web applications on current frameworks.",
      points: ["Corporate websites and landing pages", "Customer, partner and vendor portals", "Web applications and dashboards",
               "React, Next.js, Node.js and .NET", "Performance, accessibility and SEO built in"] },
    { id: "mobile", group: "digital", title: "Mobile app development",
      short: "iOS and Android apps, native or cross-platform, from first design to the app stores.",
      points: ["Native iOS (Swift) and Android (Kotlin)", "Cross-platform with Flutter and React Native", "Offline mode, push notifications and secure sign-in",
               "Back-end APIs and admin panels", "App Store and Google Play publishing"] },
    { id: "commerce", group: "digital", title: "E-commerce and Shopify",
      short: "Online stores that load quickly, convert well and connect to your stock and finance systems.",
      points: ["Shopify and Shopify Plus stores", "Custom themes and apps", "Payment, courier and ERP integration", "Migration from other platforms"] },
    { id: "software", group: "digital", title: "Custom software and SaaS",
      short: "Software built around the processes that off-the-shelf products do not fit.",
      points: ["Requirements and solution architecture", "Line-of-business systems and internal tools", "Multi-tenant SaaS products",
               "Legacy modernisation", "Automated testing and release pipelines"] },
    { id: "ux", group: "digital", title: "UI and UX design",
      short: "Interfaces people understand on first use, designed and tested before code is written.",
      points: ["User research and journey mapping", "Wireframes and clickable prototypes", "Design systems", "Usability testing"] },

    { id: "ai", group: "ai", title: "AI agents and automation",
      short: "Agents and Copilot features grounded in your own data, with a person approving anything that matters.",
      points: ["Copilot Studio agents for Dynamics 365 and Teams", "Azure OpenAI over your documents and records",
               "Document and invoice processing", "Approval steps, permissions and test sets before release"] },
    { id: "integration", group: "ai", title: "Integration and APIs",
      short: "APIs, Logic Apps and events that keep your ERP, store, apps and partners in agreement.",
      points: ["REST APIs and webhooks", "Azure Logic Apps, Functions and Service Bus", "Dynamics 365 data entities and business events",
               "Monitoring, retries and alerts"] },
    { id: "cloud", group: "ai", title: "Cloud and DevOps",
      short: "Azure environments designed, automated and kept secure and cost-aware.",
      points: ["Azure architecture and migration", "Infrastructure as code", "CI/CD pipelines in Azure DevOps and GitHub", "Monitoring, backup and cost reviews"] },
    { id: "support", group: "ai", title: "Support and maintenance",
      short: "Ongoing support, updates and improvements once you are live.",
      points: ["Agreed response times", "Updates and security patches", "Small enhancements in planned releases"] }
  ],

  /* Dark band: principles, stated as commitments. TODO keep only those you will honour. */
  principles: {
    heading: "What working with us looks like.",
    text: "Clear commitments, written into every proposal.",
    items: [
      { t: "Senior-led", d: "Experienced consultants and engineers lead every engagement and stay with it." },
      { t: "Written scope first", d: "Scope, price and timeline agreed in writing before work starts." },
      { t: "You own the work", d: "Source code, configuration and documentation are handed over to you." },
      { t: "Security by default", d: "NDA before discovery, least-privilege access, and your data kept in your environment." }
    ]
  },

  industries: {
    heading: "Industries we build for.",
    text: "What we typically deliver for each sector.",
    items: [
      { name: "Manufacturing", lines: ["Production, inventory and quality on Dynamics 365", "Shop-floor and warehouse apps", "Supplier and dealer portals"] },
      { name: "Retail and e-commerce", lines: ["Shopify stores connected to stock and finance", "Store and warehouse handheld apps", "Customer loyalty apps"] },
      { name: "Distribution and logistics", lines: ["Warehouse management and label printing", "Courier and EDI integrations", "Driver and delivery apps"] },
      { name: "Professional services", lines: ["Project accounting and billing", "Timesheets and expenses on mobile", "Client portals and reporting"] },
      { name: "Healthcare", lines: ["Patient and appointment apps", "Secure portals and records integration", "Inventory for medical supplies"] },
      { name: "Startups and SaaS", lines: ["MVPs for web and mobile", "Multi-tenant platforms on Azure", "Product design and iteration"] }
    ]
  },

  features: [
    { kicker: "One team", title: "The people you meet are the people who deliver.",
      text: "The same team runs your project from workshop to support. Nothing is handed to people you have never met, and nobody has to relearn your business halfway through.",
      visual: "team" },
    { kicker: "Upgrade-safe", title: "Built to take updates without rework.",
      text: "We extend Dynamics 365 the way Microsoft intends, through extensions and events rather than changes to standard code, and we build web and mobile apps on maintained frameworks. Your systems keep receiving updates on schedule.",
      visual: "code" }
  ],

  approach: {
    heading: "How an engagement runs.",
    text: "A clear sequence, scaled to the size of your project.",
    steps: [
      { t: "Understand", d: "Workshops with the people who run the process. We write down what must change and what must not." },
      { t: "Design", d: "Solution, data and interface design, and a plan you can hold us to." },
      { t: "Build", d: "Short cycles, shown to your team as they are built." },
      { t: "Test", d: "Testing on real scenarios, with your users signing off." },
      { t: "Launch", d: "A rehearsed go-live and hands-on support through the first weeks." },
      { t: "Support", d: "Updates, fixes and improvements from the same team." }
    ]
  },

  platforms: {
    heading: "The technology we work with.",
    groups: [
      { name: "Microsoft", items: ["Dynamics 365 Finance", "Supply Chain Management", "Project Operations", "Customer Engagement", "Business Central", "Dataverse", "Power Apps", "Power Automate", "Power BI", "Copilot Studio"] },
      { name: "Cloud and integration", items: ["Azure", "Logic Apps", "Azure Functions", "Service Bus", "Azure OpenAI", "Azure DevOps", "GitHub Actions"] },
      { name: "Web and mobile", items: ["React", "Next.js", "Node.js", ".NET", "Flutter", "Swift", "Kotlin", "React Native", "Shopify", "PostgreSQL", "SQL Server"] }
    ],
    note: "Product names are trademarks of their owners. Evolura is an independent company."
  },

  about: {
    heading: "About Evolura.",
    text: [
      "Evolura Technologies is a software and Microsoft business applications company. We design, build and support the systems growing companies depend on: ERP and CRM on Dynamics 365, the apps and websites their customers use, and the integrations that hold them together.",
      "We are deliberately senior and direct about cost, risk and what software can and cannot fix, because long client relationships matter more to us than quick projects."
    ],
    /* Facts card. Empty values are hidden. TODO fill in. */
    facts: [
      { k: "Founded", v: "" },
      { k: "Headquarters", v: "" },
      { k: "Team", v: "" }
    ],
    models: [
      { t: "Fixed-price project", d: "Agreed scope, price and milestones." },
      { t: "Dedicated team", d: "Engineers who work only on your product, monthly." },
      { t: "Support retainer", d: "A monthly block of hours after go-live." }
    ]
  },

  contactSection: {
    heading: "Tell us about your project.",
    text: "Share what you are planning or what is not working. You will hear back from an engineer or consultant, not a sales team."
  },

  privacy: {
    lastUpdated: "19 November 2026",
    sections: [
      { h: "What we collect", p: "Only what you send through the contact form: your name, email, company, country and project details." },
      { h: "How we use it", p: "To reply to your enquiry and discuss your project. We do not sell or share it, and we do not use tracking cookies or advertising pixels." },
      { h: "Who processes it", p: "Form messages are delivered to our inbox by Web3Forms. Fonts are served by Google Fonts, which receives your IP address when the page loads." },
      { h: "How long we keep it", p: "Enquiries that do not lead to a project are deleted within 12 months." },
      { h: "Your rights", p: "Email us to see, correct or delete the information we hold about you. We respond within 30 days." }
    ]
  }
};

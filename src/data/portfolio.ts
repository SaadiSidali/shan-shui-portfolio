export const companies = {
  yassir: {
    name: "Yassir",
    url: "https://yassir.com",
    logo: "assets/yassir.svg",
    logoClassName: "",
    label: null,
    width: 132,
    height: 40,
  },
  sabil: {
    name: "Sabil",
    url: "https://sabil.dz",
    logo: "assets/sabil.png",
    logoClassName: "symbol-logo",
    label: "Sabil",
    width: 40,
    height: 40,
  },
  catering: {
    name: "Catering Hub",
    url: "https://caterings.com.au",
    logo: "assets/caterings.png",
    logoClassName: "symbol-logo",
    label: "Catering Hub",
    width: 40,
    height: 40,
  },
  brandrescue: {
    name: "BrandRescue",
    url: "https://brandrescue.com.au",
    logo: "assets/brandrescue.png",
    logoClassName: "brandrescue-logo",
    label: "BrandRescue",
    width: 68,
    height: 70,
  },
  piassa: {
    name: "Piassa",
    url: "https://play.google.com/store/apps/details?id=com.zackiber.piassamobile",
    logo: "assets/piassa.png",
    logoClassName: "symbol-logo",
    label: "Piassa",
    width: 40,
    height: 40,
  },
};

export const freelanceProjects = [
  {
    name: "DZSTA / Sittelle Travel",
    url: "https://dzsta.com",
    logo: "assets/dzsta.webp",
    width: 164,
    height: 106,
  },
  {
    name: "Oranaise",
    url: "https://www.oranaise.com.au/",
    logo: "assets/oranaise-logo.png",
    width: 200,
    height: 84,
  },
  {
    name: "Coolroom Hire SA",
    url: "https://www.coolroomhiresa.com.au/",
    logo: "assets/coolroom-logo.png",
    width: 1212,
    height: 724,
  },
  {
    name: "iPhone Prix Algérie / E-Mobile",
    url: "https://iphoneprixalgerie.com/",
    logo: "assets/iphoneprix-logo.png",
    width: 500,
    height: 500,
  },
  {
    name: "Enfes Gözleme",
    url: "https://www.enfes.com.au/",
    logo: "assets/enfes-logo.jpeg",
    width: 225,
    height: 225,
  },
  {
    name: "AI Mobile",
    url: "https://aimobilealgerie.com/",
    logo: "assets/aimobile-logo.webp",
    width: 1024,
    height: 1024,
  },
];

export const themes = [
  {
    name: "Couture",
    image: "assets/theme-couture.jpg",
    featured: true,
  },
  {
    name: "Nature",
    image: "assets/theme-nature.jpg",
    featured: false,
  },
  {
    name: "Circuit",
    image: "assets/theme-circuit.jpg",
    featured: false,
  },
  {
    name: "Forge",
    image: "assets/theme-forge.jpg",
    featured: false,
  },
  {
    name: "Heritage",
    image: "assets/theme-heritage.jpg",
    featured: false,
  },
  {
    name: "Marketplace",
    image: "assets/theme-ebay.jpg",
    featured: false,
  },
  {
    name: "Default",
    image: "assets/theme-default.jpg",
    featured: false,
  },
];

export const experience = [
  {
    company: companies.yassir,
    name: "Yassir",
    date: "JUN 2026 to PRESENT",
    role: "Software Engineer · Algiers, Algeria",
    description:
      "Transaction services and airtime top-up APIs with Node.js, TypeScript, NestJS, and MongoDB. DT One integration, operational dashboards, and production observability on GKE with Datadog.",
    current: true,
  },
  {
    company: companies.sabil,
    name: "Sabil",
    date: "APR 2025 to MAR 2026",
    role: "Software Engineer · Algiers, Algeria",
    description:
      "Backend services in Go and Python, web interfaces in SvelteKit, and AI features and automation pipelines integrated into production workflows.",
    current: false,
  },
  {
    company: companies.brandrescue,
    name: "BrandRescue.au",
    date: "MAY 2023 to APR 2025",
    role: "Full-Stack / Cloud Engineer · Adelaide, Australia",
    description:
      "Next.js application development, AWS infrastructure, automated workflows, and secure deployment patterns.",
    current: false,
  },
  {
    company: companies.catering,
    name: "Caterings Hub",
    date: "MAY 2023 to PRESENT",
    role: "Full-Stack Developer · Adelaide, Australia",
    description:
      "Frontend, backend, search, and cloud infrastructure. Built dashboards, subscriptions, and event management with Next.js, NestJS, PostgreSQL, Redis, and Elasticsearch.",
    current: false,
  },
  {
    company: companies.piassa,
    name: "Piassa",
    date: "DEC 2022 to MAR 2023",
    role: "Software Developer · Algiers, Algeria",
    description:
      "A desktop inventory management application for a car parts shop, built with Electron and React.",
    current: false,
  },
  {
    company: null,
    name: "Independent work",
    date: "DEC 2020 to PRESENT",
    role: "Freelance Full-Stack Developer",
    description:
      "Custom websites, web applications, performance improvements, and search optimization for clients.",
    current: false,
  },
];

export const skills = [
  {
    number: "01",
    title: "Build the experience",
    lines: ["TypeScript · JavaScript · React", "Next.js · SvelteKit"],
  },
  {
    number: "02",
    title: "Engineer the system",
    lines: ["Node.js · NestJS · Go · Python", "PostgreSQL · MongoDB · Redis"],
  },
  {
    number: "03",
    title: "Keep it running",
    lines: [
      "AWS · GCP · Docker · Kubernetes",
      "CI/CD · Datadog · Elasticsearch",
    ],
  },
];

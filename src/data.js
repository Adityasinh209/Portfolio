// ─────────────────────────────────────────────────────────────
//  Content source of truth: Adityasinh Rana's resume (PDF).
//  Link provenance:
//   • Certificate links → extracted from the resume PDF hyperlinks.
//   • Project live URLs → confirmed by Adityasinh.
//   • GitHub profile + project repos → github.com/Adityasinh209, matched to each project via
//     the repo homepage field, README, package.json and source tree.
//   • null → TODO, not found. Fill these in before deploying (hidden on the site until then).
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Adityasinh Rana',
  first: 'ADITYASINH',
  last: 'RANA',
  role: 'Full-Stack Software Developer',
  location: 'Jamnagar / Gandhinagar, India',
  email: 'adityasinh209@gmail.com',
  links: {
    github: 'https://github.com/Adityasinh209',
    linkedin: null, // TODO: add LinkedIn URL (label in resume PDF had no hyperlink embedded)
    linktree: null, // TODO: add Linktree URL (label in resume PDF had no hyperlink embedded)
  },
  summary:
    'Full-stack developer skilled in React/Next.js, Node.js, and AWS, with hands-on experience shipping cloud-integrated web applications across healthcare, developer tooling, and UI-focused projects. AWS Academy certified in Cloud Foundations and Cloud Security. Seeking a full-stack or software developer internship / entry-level role.',
};

// Five projects. Card copy and tech stacks come from each repo (README, package.json, source tree)
// and its live demo. Repo facts take precedence over the resume wording.
export const projects = [
  {
    // Repo: Adityasinh209/Ayusutra. README "AyurSutra: AI-Enabled Panchakarma Patient Management".
    // Live site self-titles "AyurSutra — Panchakarma Management System". Separate project from Ayusandhi.
    name: 'Ayusutra',
    tagline: 'AI-enabled Panchakarma clinic management system',
    stack: ['React 19', 'Vite', 'Tailwind CSS v4', 'React Router v7', 'Vitest'],
    points: [
      'Role-based platform for Panchakarma centres (doctor, receptionist, admin) covering patient registration, EMR records and therapy prescriptions.',
      'Smart therapy scheduling that recommends a therapist and slot from availability and existing bookings, with alternatives.',
      'Appointment tracking and master data for therapies, therapists and rooms, backed by a Vitest + React Testing Library suite.',
    ],
    live: 'https://ayusutra001.vercel.app/',
    code: 'https://github.com/Adityasinh209/Ayusutra',
    image: 'ayusutra',
    hue: 140,
  },
  {
    // Repo: Adityasinh209/Image-studio (description "Named as Pixora", homepage = live URL)
    name: 'Pixora',
    tagline: 'Batch image editor: enhance, cut out, portrait blur',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Sharp', 'Transformers.js', 'shadcn/ui'],
    points: [
      'Edit up to 15 images at once: enhance, resize and presets, with a before/after comparison slider.',
      'On-device AI background removal and camera-style portrait blur via Transformers.js.',
      'Server-side Sharp processing pipeline (Next.js API route) and one-click ZIP export.',
    ],
    live: 'https://pixora29.vercel.app/',
    code: 'https://github.com/Adityasinh209/Image-studio',
    image: 'pixora',
    hue: 265,
  },
  {
    // Repo: Adityasinh209/HackGen (homepage = live URL)
    name: 'HackGen',
    tagline: 'Hackathon problem statement generator',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'PostgreSQL', 'Prisma', 'Firebase Auth', 'PGlite', 'Recharts'],
    points: [
      'Pick a domain and difficulty, then roll for five unique problem statements. Lock favourites, bookmark ideas and export them as a PDF.',
      'Admin dashboard with Recharts analytics, user and session management, and a recycle bin.',
      'Dataset uploads (CSV, XLSX, DOCX, PDF) with duplicate detection and automatic domain and difficulty inference, on a PostgreSQL/Prisma data layer.',
    ],
    live: 'https://hackgen-cursor.vercel.app/',
    code: 'https://github.com/Adityasinh209/HackGen',
    image: 'hackgen',
    hue: 78,
  },
  {
    // Repo: Adityasinh209/Paymora (package "card-checkout"; live site title "Paymora — Checkout")
    name: 'Paymora',
    tagline: 'Animated billing checkout UI',
    stack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    points: [
      'Live 3D card preview with tilt that mirrors what you type, including the back of the card for CVV entry.',
      'Card brand and funding detection, Luhn validation and auto-formatting for card number and expiry.',
      'Card / UPI / Wallet payment tabs with Framer Motion transitions and reduced-motion support.',
    ],
    live: 'https://paymora01.vercel.app/',
    code: 'https://github.com/Adityasinh209/Paymora',
    image: 'paymora',
    hue: 200,
  },
  {
    // Repo: Adityasinh209/Ayusandhi (homepage = live URL)
    name: 'Ayusandhi',
    tagline: 'FHIR-compliant terminology service for Ayush & ICD-11 TM2',
    stack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Express'],
    points: [
      'Dual-coding search across NAMASTE and ICD-11 TM2 terms, with debounced instant search and automatic code detection.',
      'Detail dialogs showing English/Hindi names, synonyms and codes for each record.',
      'Built around FHIR R4 terminology services, India EHR standards and ABHA OAuth2.0 (authorization-ready).',
    ],
    live: 'https://ayusandhi.vercel.app/',
    code: 'https://github.com/Adityasinh209/Ayusandhi',
    image: 'ayusandhi',
    hue: 12,
  },
];

export const skills = [
  { group: 'Frontend', items: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion', 'Responsive Web Design'] },
  { group: 'Backend', items: ['Node.js', 'Express.js', 'Django', 'Prisma', 'REST API Design & Integration'] },
  { group: 'Databases', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase Firestore'] },
  { group: 'Cloud & DevOps', items: ['AWS S3', 'EC2', 'CloudWatch', 'CloudTrail', 'IAM', 'Vercel', 'Git', 'GitHub', 'Postman', 'Agile Development'] },
  { group: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'R'] },
  { group: 'Data & Other', items: ['Matplotlib', 'Seaborn', 'Plotly', 'Tableau', 'Power BI', 'NodeMCU (ESP8266)', 'Arduino IoT prototyping'] },
];

export const marqueeA = ['React', 'Next.js', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Prisma', 'Tailwind'];
export const marqueeB = ['Firebase', 'Django', 'MongoDB', 'Express', 'Python', 'Vercel', 'Framer Motion', 'Git'];

export const journey = [
  {
    when: '2025 — Present',
    title: 'Organizer',
    org: 'GDG On Campus, Karnavati University',
    text: 'Led end-to-end organization of technical events, developer workshops, and community learning sessions, coordinating logistics, speakers, sponsors, and university administration.',
    kind: 'Leadership',
  },
  {
    when: '2024 — 2025',
    title: 'Core Coordinator',
    org: 'GDG On Campus, Karnavati University',
    text: null,
    kind: 'Leadership',
  },
  {
    when: 'B.Tech',
    title: 'Computer Science and Engineering',
    org: 'Karnavati University (UIT)',
    text: 'SGPA: 7.36 (Semester 5)',
    kind: 'Education',
  },
  {
    when: 'HSC',
    title: 'Higher Secondary Certificate, Science',
    org: 'Podar International School',
    text: 'CBSE Board',
    kind: 'Education',
  },
];

export const certifications = [
  { name: 'AWS Academy Graduate — Cloud Security', issuer: 'Amazon Web Services', url: 'https://drive.google.com/file/d/1pwmNcEvZvZBszTVnLZm1cnb3KHneA42u/view?usp=drive_link' },
  { name: 'AWS Academy Graduate — Cloud Foundations', issuer: 'Amazon Web Services', url: 'https://drive.google.com/file/d/1VtxOUjkKimJvpthj9cbYWtWrDDuLLQjY/view?usp=drive_link' },
  { name: 'Claude 101', issuer: 'Anthropic', url: 'https://drive.google.com/file/d/1YhqMuKsv8H-DJf4AgnlpwHsMr9Wozdim/view?usp=drive_link' },
  { name: 'Code in Action', issuer: 'Anthropic', url: 'https://drive.google.com/file/d/151twa8oE9MA7o8fO6rSzG6QIorQIBING/view?usp=drive_link' },
];

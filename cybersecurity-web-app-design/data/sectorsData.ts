export interface SectorData {
  id: string
  title: string
  shortDesc: string
  iconType: string
  heroImageUrl: string
  threatLandscape: string[]
  bestPractices: string[]
  methodologies: string[]
  compliance: string[]
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime?: string
  activities?: any[]
  sections?: {
    introduction: {
      whyItMatters: string
      callouts: { label: string; value: string; trend?: string }[]
      threatLandscape: string[]
    }
    bestPractices: { title: string; content: string }[]
    caseStudies: { background: string; rootCause: string; impact: string; prevention: string }[]
    timeline: { step: number; title: string; description: string }[]
  }
}

export const sectors: SectorData[] = [
  {
    id: "education",
    title: "Education",
    shortDesc: "Protecting student data (FERPA), campus networks, and mitigating phishing.",
    iconType: "GraduationCap",
    heroImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
    threatLandscape: [
      "Targeted Phishing Campaigns: Students and faculty frequently receive highly tailored spear-phishing emails aiming to harvest university credentials and access research databases.",
      "Ransomware on Legacy Systems: Universities often run decentralized, legacy infrastructure which is prime real estate for double-extortion ransomware gangs looking for quick payouts.",
      "Research Data Theft: Nation-state actors heavily target R&D departments in higher education to steal intellectual property, military contracts, and undisclosed research data.",
      "Bring Your Own Device (BYOD): The massive proliferation of unmanaged, potentially compromised student devices across the campus Wi-Fi network dramatically increases the attack surface."
    ],
    bestPractices: [
      "Implement rigorous network segmentation to physically and logically separate student Wi-Fi, administrative enclaves, and highly sensitive research servers.",
      "Mandate Multi-Factor Authentication (MFA) for all faculty, staff, and student portal access, particularly for off-campus logins.",
      "Deploy aggressive Endpoint Detection and Response (EDR) agents on all university-owned assets, including lab computers and library kiosks.",
      "Conduct regular, gamified phishing simulation and awareness training tailored to the academic calendar."
    ],
    methodologies: [
      "Micro-segmentation & VLANs: Employ software-defined networking to isolate IoT devices from core student record databases.",
      "Behavioral Analytics (UEBA): Utilize machine learning baselines to detect anomalous login times or massive data exfiltration events.",
      "Zero Trust Network Access (ZTNA): Replace legacy VPNs with context-aware access controls that verify device posture.",
      "Automated Patch Management: Implement centralized tools to push critical CVE patches to thousands of distributed endpoints."
    ],
    compliance: [
      "FERPA (Family Educational Rights and Privacy Act): Mandates protection of student records and PII.",
      "GLBA (Gramm-Leach-Bliley Act): Applies to financial aid data security plans.",
      "Title IV: Requires a comprehensive information security program."
    ],
    difficulty: "Beginner",
    estimatedTime: "45 mins",
    activities: [{ id: "edu-1", type: "read", title: "Intro" }],
    sections: {
      introduction: {
        whyItMatters: "Academic networks are unique hubs of open collaboration, hosting thousands of temporary users alongside sensitive administrative data and multi-million dollar research projects.",
        callouts: [
          { label: "Average Breach Cost", value: "$3.7M", trend: "+12% YoY" },
          { label: "Phishing Success Rate", value: "32%", trend: "In students" },
          { label: "Legacy Infrastructure", value: "65%", trend: "Outdated" }
        ],
        threatLandscape: [
          "Spear-phishing harvesting student/faculty credentials.",
          "Legacy campus domain controllers targeted by ransomware.",
          "Theft of sensitive R&D and proprietary research data.",
          "BYOD networks lacking basic device health profiling."
        ]
      },
      bestPractices: [
        { title: "Network Micro-segmentation", content: "Isolate student dormitory Wi-Fi from the core administrative and research databases using software-defined virtual local networks." },
        { title: "Universal MFA Mandate", content: "Require hardware tokens or authenticator apps for all logins, eliminating passwords as a single point of failure." },
        { title: "Automated Device Patching", content: "Install endpoint agents to automatically deploy critical security updates within 48 hours of release." }
      ],
      caseStudies: [
        {
          background: "A major university suffered a campus-wide network lockout, halting online exams and administrative services.",
          rootCause: "An employee clicked on a phishing link disguised as a department billing invoice, providing domain admin credentials.",
          impact: "Over 40,000 students lost access to class portals; recovery cost $1.5M in digital forensics and response fees.",
          prevention: "Implement email filtering with attachment sandboxing and restrict administrative portal access to trusted IP ranges only."
        }
      ],
      timeline: [
        { step: 1, title: "Initial Compromise", description: "Spear-phishing email bypasses spam filters and is opened by a department admin." },
        { step: 2, title: "Credential Harvesting", description: "The victim inputs their login credentials on a spoofed portal." },
        { step: 3, title: "Privilege Escalation", description: "The hacker uses administrative tools to find and hijack high-level service accounts." },
        { step: 4, title: "Ransomware Execution", description: "A system-wide payload is deployed, encrypting all endpoints and backup servers." }
      ]
    }
  },
  {
    id: "corporate",
    title: "Private & Corporate",
    shortDesc: "Intellectual property defense, remote work security, and BEC prevention.",
    iconType: "Building",
    heroImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    threatLandscape: [
      "Business Email Compromise (BEC): Attackers spoof executive accounts or compromise vendor emails to intercept wire transfers or steal W-2 data, costing businesses billions annually.",
      "Supply Chain Compromise: Exploitation of trusted third-party vendors or ubiquitous software dependencies (e.g., SolarWinds, Log4j) to gain silent, long-term internal network access.",
      "Insider Threats: Both malicious employees intentionally stealing Intellectual Property (IP) before departing, and negligent employees accidentally mishandling sensitive corporate data.",
      "Remote Work Vulnerabilities: Unsecured home networks, split-tunneling VPNs, and shadow IT SaaS applications completely bypassing traditional corporate security perimeters."
    ],
    bestPractices: [
      "Adopt a Zero Trust Architecture (ZTA) focusing on continuous identity verification and device posture checking rather than relying on a hard network perimeter.",
      "Enforce strict Principle of Least Privilege (PoLP) and Just-In-Time (JIT) access for all corporate resources and cloud infrastructure.",
      "Implement robust Data Loss Prevention (DLP) solutions to monitor, alert on, and block the exfiltration of sensitive IP via email, USB, or cloud drives.",
      "Require hardware-based MFA (e.g., FIDO2 security keys) for highly privileged accounts."
    ],
    methodologies: [
      "Threat Hunting & Compromise Assessments: Proactively search through network telemetry and endpoint logs to identify hidden adversaries.",
      "Red Teaming & Penetration Testing: Regularly hire ethical hackers to simulate advanced threat actor tactics against corporate infrastructure.",
      "Secure Access Service Edge (SASE): Unify SD-WAN with cloud-native security functions to securely connect remote workers.",
      "Data Classification & Encryption: Implement automated tagging of documents and enforce AES-256 encryption."
    ],
    compliance: [
      "GDPR (General Data Protection Regulation): Strict data privacy and breach notification laws.",
      "CCPA/CPRA: California's comprehensive privacy laws governing consumer data.",
      "SOC 2 Type II: An auditing standard demonstrating commitment to security."
    ],
    difficulty: "Intermediate",
    estimatedTime: "60 mins",
    activities: [{ id: "corp-1", type: "read", title: "Intro" }, { id: "corp-2", type: "quiz", title: "Quiz" }],
    sections: {
      introduction: {
        whyItMatters: "Enterprise networks guard the intellectual property, trade secrets, and financial engines of the private sector, facing attacks designed for industrial espionage and direct financial theft.",
        callouts: [
          { label: "BEC Losses", value: "$2.7B", trend: "Annually globally" },
          { label: "Supply Chain Risk", value: "45%", trend: "Of breaches" },
          { label: "Avg Ransom Demand", value: "$812K", trend: "Rising" }
        ],
        threatLandscape: [
          "Business Email Compromise (BEC) wire transfer hijacking.",
          "Software supply chain compromise injecting malicious patches.",
          "Insider threat and unauthorized data exfiltration.",
          "Remote access endpoints exposing corporate subnets."
        ]
      },
      bestPractices: [
        { title: "Continuous Verification ZTA", content: "Implement policy engines that dynamically check device security stance before granting access to cloud ERP tools." },
        { title: "Principle of Least Privilege", content: "Strip local administrator rights from general office workstations and require approval for software execution." },
        { title: "Automated Data Loss Prevention", content: "Deploy network sensors to inspect egress emails and cloud transfers for credit card numbers or source code snippets." }
      ],
      caseStudies: [
        {
          background: "A global logistics firm had its operations crippled for days due to malware introduced via a third-party billing application.",
          rootCause: "The billing vendor's server was compromised, allowing attackers to push malware disguised as a software update.",
          impact: "Over $10M in delayed shipments, system restoration fees, and reputational damage.",
          prevention: "Isolate partner systems in separate DMZs and establish rigid API interface validation protocols."
        }
      ],
      timeline: [
        { step: 1, title: "Supplier Breach", description: "Attackers compromise an external SaaS vendor with database credentials." },
        { step: 2, title: "Malicious Update", description: "The vendor pushes a routine app update carrying a trojan horse to the corporate network." },
        { step: 3, title: "C2 Communication", description: "The trojan reaches back to the attacker's server to establish an encrypted shell." },
        { step: 4, title: "Data Harvesting", description: "Attackers navigate to file servers and exfiltrate proprietary customer data." }
      ]
    }
  },
  {
    id: "government",
    title: "Government & Public Sector",
    shortDesc: "Defending against APTs, securing classified data, and strict access controls.",
    iconType: "ShieldAlert",
    heroImageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200",
    threatLandscape: [
      "Advanced Persistent Threats (APTs): Highly resourced, state-sponsored actors conducting long-term cyber espionage, sabotage, or geopolitical disruption campaigns.",
      "Disinformation & Influence Operations: Weaponized, AI-driven information campaigns aimed at eroding public trust in democratic institutions.",
      "Critical Infrastructure Targeting: Cyber-kinetic attacks aimed at disrupting essential municipal services like water treatment facilities or power grids.",
      "Legacy Systems & Technical Debt: Vast amounts of outdated infrastructure in state and local government systems, making them highly vulnerable."
    ],
    bestPractices: [
      "Mandate the transition to Zero Trust network architectures across all agencies.",
      "Implement continuous diagnostic monitoring (CDM) and enforce strict, standardized configuration management.",
      "Utilize highly secure classified enclaves and strictly air-gapped networks for handling sensitive data.",
      "Develop and drill comprehensive incident response and COOP plans."
    ],
    methodologies: [
      "Defense-in-Depth Architecture: Layer overlapping security controls to mitigate single points of failure.",
      "Air-Gapping & Data Diodes: Physically isolate classified networks using hardware data diodes.",
      "Heuristic & Sandboxing Analysis: Detonate suspicious files in secure, isolated virtual environments.",
      "Continuous Authorization (cATO): Move away from point-in-time compliance to real-time automated assessment."
    ],
    compliance: [
      "FISMA (Federal Information Security Management Act): Standardized security compliance.",
      "NIST SP 800-53: Comprehensive catalog of security controls for federal systems.",
      "FedRAMP: Standardized approach to cloud security assessments."
    ],
    difficulty: "Advanced",
    estimatedTime: "90 mins",
    activities: [{ id: "gov-1", type: "read", title: "Intro" }, { id: "gov-2", type: "simulation", title: "Sim" }, { id: "gov-3", type: "quiz", title: "Quiz" }],
    sections: {
      introduction: {
        whyItMatters: "Public infrastructure and state databases hold citizen PII, intelligence telemetry, and command controls for critical municipal utilities, targeted by nation-state actors.",
        callouts: [
          { label: "APT Target Rate", value: "42%", trend: "Of state-backed hits" },
          { label: "Legacy Debt", value: "58%", trend: "Systems obsolete" },
          { label: "Avg Incident Duration", value: "22 Days", trend: "Offline downtime" }
        ],
        threatLandscape: [
          "State-sponsored cyber espionage targeting intelligence.",
          "Weaponized disinformation campaigns targeting elections.",
          "Cyber-kinetic infrastructure manipulation (grids, water).",
          "Municipal systems target-locked for ransomware payout."
        ]
      },
      bestPractices: [
        { title: "Air-Gapped Isolation", content: "Keep defense and intelligence repositories physically disconnected from the open internet, using hardware-locked data nodes." },
        { title: "Automated CDM Telemetry", content: "Inject automated agent scanners that continuously report compliance state to security operations teams." },
        { title: "Tabletop COOP Readiness", content: "Conduct monthly simulations for emergency response teams to practice operating on fallback manual protocols." }
      ],
      caseStudies: [
        {
          background: "A city water treatment plant experienced unauthorized remote software access adjusting chlorine mixture levels.",
          rootCause: "An employee shared remote management application passwords across several insecure public networks.",
          impact: "Emergency operations halted automated distribution; immediate intervention reverted parameters manually.",
          prevention: "Enforce strict IP lockouts and MFA on all operational tech portals, blocking public access."
        }
      ],
      timeline: [
        { step: 1, title: "System Enumeration", description: "Attackers scan municipal VPN endpoints for outdated, unpatched software." },
        { step: 2, title: "Vulnerability Exploit", description: "A remote code execution exploit is run, granting initial internal network visibility." },
        { step: 3, title: "Industrial Pivot", description: "The actor crosses boundaries into the physical supervisory control network (SCADA)." },
        { step: 4, title: "Controller Override", description: "Malicious commands are sent to Programmable Logic Controllers, altering operations." }
      ]
    }
  },
  {
    id: "manufacturing",
    title: "Production & Manufacturing",
    shortDesc: "OT/IT convergence, securing ICS/SCADA, and supply chain resilience.",
    iconType: "Factory",
    heroImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    threatLandscape: [
      "OT/IT Convergence Risks: The modern merging of Operational Technology (OT) and enterprise IT networks exposes previously air-gapped industrial control systems.",
      "Manufacturing Ransomware: Cyber disruptions that directly halt physical assembly lines cost millions per hour.",
      "Supply Chain Disruption: Cyberattacks on upstream tier-3 suppliers can cascade down, halting production.",
      "Legacy PLCs & Fragile OT: PLCs often lack built-in authentication and use plaintext protocols."
    ],
    bestPractices: [
      "Implement the Purdue Enterprise Reference Architecture (PERA) model to segment networks.",
      "Deploy specialized passive network monitoring to detect anomalous ICS commands without active scanning.",
      "Maintain offline, immutable backups of critical HMI, SCADA, and PLC configurations.",
      "Conduct rigorous, continuous third-party risk management (TPRM)."
    ],
    methodologies: [
      "Passive DPI for OT Protocols: Utilize DPI firewalls specifically tuned to understand Modbus, DNP3, CIP.",
      "OT Asset Discovery & Baselining: Use non-intrusive listening tools to build a 100% accurate asset inventory.",
      "Network Micro-segmentation: Divide the manufacturing floor into secure cells to contain malware.",
      "Hardware Root of Trust: Ensure new IIoT devices boot securely using TPM chips."
    ],
    compliance: [
      "IEC 62443: Definitive standard for industrial communication network security.",
      "NIST CSF (Cybersecurity Framework): Framework utilizing core functions to manage cyber risk.",
      "CMMC: Mandatory certification required for participants in the Defense supply chain."
    ],
    difficulty: "Intermediate",
    estimatedTime: "75 mins",
    activities: [{ id: "mfg-1", type: "read", title: "Intro" }, { id: "mfg-2", type: "quiz", title: "Quiz" }],
    sections: {
      introduction: {
        whyItMatters: "Operational Technology (OT) drives physical assembly lines, power generation, and water treatment. Cyberattacks here move from the digital realm to physical damage.",
        callouts: [
          { label: "Avg Assembly Cost", value: "$15K/Min", trend: "Line down cost" },
          { label: "Convergent Gaps", value: "73%", trend: "IT-OT intersections" },
          { label: "Active PLC Scans", value: "+19%", trend: "Industrial targets" }
        ],
        threatLandscape: [
          "Bypassing air-gaps via infected vendor maintenance laptops.",
          "Ransomware shutting down shop floor distribution channels.",
          "Unauthorized writing of configuration parameters to PLCs.",
          "Firmware hijacking of networked robotic sensors."
        ]
      },
      bestPractices: [
        { title: "Purdue Segmentation Model", content: "Enforce strict isolation layer architecture between operational machinery controls and enterprise corporate office networks." },
        { title: "Span Port Listening", content: "Employ zero-risk listening taps to inventory OT devices without transmitting data packets that can disrupt older PLCs." },
        { title: "Offline Logic Backups", content: "Store physical backup copies of assembly system program scripts inside tamper-proof, fireproof safes." }
      ],
      caseStudies: [
        {
          background: "A global automaker's main assembly line halted for 18 hours due to a ransomware infection targeting workstation controls.",
          rootCause: "A technician plugged an infected personal USB drive into a factory control computer to copy operational log files.",
          impact: "Production halted for 3,000 vehicles, causing direct revenue losses exceeding $4M.",
          prevention: "Enforce hardware USB blocker modules on physical ports and implement scanning kiosks."
        }
      ],
      timeline: [
        { step: 1, title: "Workstation Access", description: "An engineer uses an unauthorized USB drive to download logs." },
        { step: 2, title: "Malware Dispersal", description: "Worm malware copies itself to local SCADA database terminals." },
        { step: 3, title: "PLC Interception", description: "The worm detects Modbus protocol traffic and begins sending garbage commands." },
        { step: 4, title: "Safety Trip", description: "Local systems trigger automated emergency shutdowns due to lost communication." }
      ]
    }
  },
  {
    id: "healthcare",
    title: "Healthcare",
    shortDesc: "Protecting PHI, securing medical IoT, and mitigating clinical ransomware.",
    iconType: "HeartPulse",
    heroImageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
    threatLandscape: [
      "Clinical Ransomware: Cyberattacks that lock Electronic Health Record (EHR) systems directly threaten patient safety.",
      "Medical IoT (IoMT) Vulnerabilities: Connected infusion pumps or MRI machines often run unsupported operating systems.",
      "Data Extortion: PHI is highly valuable on the dark web for identity theft and medical fraud.",
      "Third-Party Breaches: Reliance on external billing vendors or telehealth platforms expands the attack surface."
    ],
    bestPractices: [
      "IoMT Micro-segmentation: Strictly isolate all medical devices on dedicated, restricted VLANs.",
      "Implement strict endpoint controls, application whitelisting, and EDR on nursing workstations.",
      "Develop and drill 'Downtime Procedures' for paper-based operations.",
      "Enforce rigorous Data Loss Prevention (DLP) and email encryption."
    ],
    methodologies: [
      "Network Access Control (NAC): Dynamically profile and sandbox devices plugging into hospital ports.",
      "Clinical Application Whitelisting: Lock down medical workstations to prevent unauthorized software execution.",
      "Deception Technology: Deploy honeypots mimicking EHR databases to catch lateral movement early.",
      "Secure Telehealth Architectures: Mandate end-to-end encryption (E2EE) and API authorization."
    ],
    compliance: [
      "HIPAA (Health Insurance Portability and Accountability Act): Safeguards for private health data.",
      "HITECH Act: Enhances HIPAA enforcement and increases notification penalties.",
      "FDA Pre/Post-market Cyber Guidelines: Rules requiring medical manufacturers to bake security into devices."
    ],
    difficulty: "Advanced",
    estimatedTime: "80 mins",
    activities: [{ id: "hc-1", type: "read", title: "Intro" }, { id: "hc-2", type: "puzzle", title: "Puzzle" }, { id: "hc-3", type: "quiz", title: "Quiz" }],
    sections: {
      introduction: {
        whyItMatters: "In healthcare, bytes equal lives. Ransomware locking Electronic Health Records (EHR) immediately delays surgeries, redirects ambulances, and threatens patient safety.",
        callouts: [
          { label: "Dark Web PHI Value", value: "$250+", trend: "Per patient record" },
          { label: "Unpatched IoMT", value: "82%", trend: "Connected devices" },
          { label: "Clinical Redirection", value: "40%", trend: "Of emergency rooms" }
        ],
        threatLandscape: [
          "Ransomware shutting down real-time vitals logging software.",
          "Command compromise of connected patient infusion pumps.",
          "Targeted theft of highly valuable clinical medical records.",
          "Compromised billing channels halting medical supplies."
        ]
      },
      bestPractices: [
        { title: "IoMT VLAN Micro-segmentation", content: "Isolate smart medical monitors from the main hospital administrative and hospital guest networks." },
        { title: "Workstation Lockout", content: "Configure clinical computers to restrict execution solely to whitelisted electronic medical record portals." },
        { title: "Simulated Offline Drills", content: "Practice processing prescriptions and patient intakes manually with physical paper logs during mock outages." }
      ],
      caseStudies: [
        {
          background: "A major hospital system had to divert critical trauma patients to alternative facilities due to a computer system lockout.",
          rootCause: "A billing associate opened a phishing attachment containing malware that encrypted the EHR master nodes.",
          impact: "Downtime lasted 12 days, resulting in delayed diagnostics and an estimated $8M recovery cost.",
          prevention: "Separate the medical records server domain from general administrative domains and establish offline mirror nodes."
        }
      ],
      timeline: [
        { step: 1, title: "Vendor Entry", description: "Attackers harvest portal logins belonging to an external clinic translator service." },
        { step: 2, title: "Workstation Footprint", description: "The compromised credentials grant entry to an administrative nursing terminal." },
        { step: 3, title: "Backup Deletion", description: "Attackers trace backup storage hosts and deploy scripts that erase active shadow copies." },
        { step: 4, title: "Database Encryption", description: "The EHR databases are encrypted, locking clinical staff out of patient history screens." }
      ]
    }
  },
  {
    id: "financial",
    title: "Financial",
    shortDesc: "PCI-DSS compliance, fraud prevention, and secure transaction architectures.",
    iconType: "Landmark",
    heroImageUrl: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=1200",
    threatLandscape: [
      "SWIFT Network & Wire Fraud: Sophisticated actors targeting global financial messaging to siphon funds.",
      "Account Takeover (ATO): Automated credential stuffing and social-engineered SIM swapping.",
      "API & Mobile Vulnerabilities: Open banking APIs and mobile backends exploited to bypass auth.",
      "DDoS Extortion: Threat actors launching massive attacks to take trading platforms offline."
    ],
    bestPractices: [
      "Implement continuous behavioral analytics and velocity checks to flag anomalies.",
      "Adopt shift-left security: Conduct aggressive SAST/DAST testing on APIs and mobile code.",
      "Enforce mandatory, non-phishable hardware MFA (FIDO2) for banking infrastructure.",
      "Maintain active threat intelligence sharing through organizations like FS-ISAC."
    ],
    methodologies: [
      "Fraud Analytics & ML Models: Deploy algorithms analyzing device fingerprint, typing speed, and location.",
      "Tokenization & P2PE: Replace sensitive PAN data with randomly generated tokens.",
      "API Gateway Hardening & Rate Limiting: Deploy advanced WAF and gateway schemas to throttle attacks.",
      "Hardware Security Modules (HSM): Utilize physically tamper-resistant hardware to manage keys."
    ],
    compliance: [
      "PCI-DSS: Prescriptive controls required for any entity processing card data.",
      "NYDFS 23 NYCRR 500: New York's rigorous requirements for financial companies.",
      "SOX (Sarbanes-Oxley Act): Mandates strict internal controls over financial reporting."
    ],
    difficulty: "Intermediate",
    estimatedTime: "70 mins",
    activities: [{ id: "fin-1", type: "read", title: "Intro" }, { id: "fin-2", type: "simulation", title: "Sim" }],
    sections: {
      introduction: {
        whyItMatters: "Financial networks protect the transactional machinery of the global economy. Attacks target high-speed transaction streams, API endpoints, and SWIFT channels.",
        callouts: [
          { label: "Avg Cost of Breach", value: "$5.9M", trend: "Highest of any sector" },
          { label: "Credential Stuffing", value: "800M", trend: "Attempts daily" },
          { label: "API Flaws Exploited", value: "67%", trend: "Of banking vectors" }
        ],
        threatLandscape: [
          "SWIFT messaging terminals targeted for fraudulent wire execution.",
          "SIM swap hacks bypassing transaction approvals.",
          "Object-level authorization exploits on consumer APIs.",
          "Multi-gigabit DDoS campaigns disrupting trading platforms."
        ]
      },
      bestPractices: [
        { title: "Velocity Check Verification", content: "Flag accounts initiating multiple payments from distinct geolocations within minutes." },
        { title: "API Validation Testing", content: "Run automated checks confirming API requests carry verified session authentication tokens." },
        { title: "FIDO2 Key Enforcement", content: "Require physical USB security tokens to unlock server consoles managing core transaction records." }
      ],
      caseStudies: [
        {
          background: "A digital lender had its customer credit database exfiltrated via an exposed API endpoint.",
          rootCause: "An API parameter lacked server-side access checks, enabling users to request records by editing data IDs.",
          impact: "Over 2M user records leaked; the company was fined $2.5M for inadequate security controls.",
          prevention: "Deploy API gateways validating parameters and block object-level data retrieval anomalies."
        }
      ],
      timeline: [
        { step: 1, title: "Endpoint Scanning", description: "Attackers discover public testing endpoints exposed on a banking API subdomain." },
        { step: 2, title: "Parameter Scraping", description: "A script loops customer accounts to identify those missing access validation." },
        { step: 3, title: "Exfiltration Loop", description: "The script downloads user profile records sequentially, mimicking legitimate app requests." },
        { step: 4, title: "Extortion Campaign", description: "The hacker sends ransom requests, threatening publication of sensitive financial histories." }
      ]
    }
  }
]

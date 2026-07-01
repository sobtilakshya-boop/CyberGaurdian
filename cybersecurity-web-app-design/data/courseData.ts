// ─── Cyber Hygiene Course Data ────────────────────────────────────────────────
// All 9 chapters with educational content, videos, quizzes, and activities.

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface VideoItem {
  id: string
  title: string
  youtubeId: string
  level: 'Beginner' | 'Expert' | 'Practical'
  duration: string
}

export interface ComicPanel {
  id: string
  title: string
  description: string
  imageUrl?: string
}

export interface ContentSection {
  title: string
  body: string
  type?: 'normal' | 'tip' | 'warning' | 'example'
}

export interface Chapter {
  id: number
  title: string
  subtitle: string
  description: string
  estimatedTime: string
  icon: string
  color: string
  xpReward: number
  content: ContentSection[]
  videos: VideoItem[]
  comicPanels: ComicPanel[]
  comicQuiz: QuizQuestion[]
  chapterQuiz: QuizQuestion[]
  activities: {
    dragAndDrop: { title: string; description: string; items: string[]; categories: string[] }
    matchFollowing: { title: string; pairs: { term: string; definition: string }[] }
    scenario: { title: string; situation: string; choices: { text: string; isCorrect: boolean; feedback: string }[] }
  }
  puzzleWords: string[]
  newsTips: { headline: string; summary: string; source: string; severity: 'low' | 'medium' | 'high' }[]
}

export const TOTAL_XP = 9 * 220 // max XP from completing all chapters

export const dailyTips = [
  "Use a unique, strong password for every account — a password manager makes this effortless.",
  "Enable Multi-Factor Authentication (MFA) on all critical accounts, especially email and banking.",
  "Think before you click: hover over links to verify the actual URL before opening them.",
  "Keep your operating system and applications updated to patch known security vulnerabilities.",
  "Back up critical data using the 3-2-1 rule: 3 copies, 2 media types, 1 offsite.",
  "Public Wi-Fi is dangerous. Always use a VPN when connecting to public networks.",
  "Lock your screen whenever you step away from your device — even for a minute.",
  "Verify the identity of callers requesting sensitive information — vishing is real.",
  "Check your bank and credit card statements weekly for unauthorized transactions.",
  "Review app permissions regularly. Does your flashlight app really need your contacts?",
  "Use encrypted messaging apps like Signal for sensitive communications.",
  "Delete accounts and apps you no longer use — they're unnecessary attack surfaces.",
  "Be skeptical of urgency in emails or messages — attackers use time pressure to bypass judgement.",
  "Never share OTPs or authentication codes with anyone, including 'bank support' callers.",
  "Run a reputable antivirus/EDR solution and keep its definitions updated daily.",
]

export const chapters: Chapter[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 1: Introduction to Cyber Hygiene
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Introduction to Cyber Hygiene",
    subtitle: "Building Your Digital Defense Foundation",
    description: "Understand what cyber hygiene means, why it matters, and how your digital actions create a footprint that can be exploited by adversaries.",
    estimatedTime: "45 min",
    icon: "🛡️",
    color: "cyan",
    xpReward: 220,
    content: [
      {
        title: "What Is Cyber Hygiene?",
        body: `Cyber hygiene refers to the practices, habits, and procedures individuals and organizations maintain to keep digital systems healthy, secure, and functioning optimally. Just as physical hygiene prevents illness, cyber hygiene prevents digital infections — malware, data breaches, and unauthorized access.\n\nThe concept originates from the broader field of information security and draws on principles from public health: prevention is far less costly than treatment. A single preventable breach can cost an organization millions of dollars in recovery costs, regulatory fines, and reputational damage.\n\nAt its core, cyber hygiene is about consistency. It is not a one-time action but an ongoing discipline that must be embedded into daily digital behavior. Security experts compare it to brushing teeth: it must happen every day to be effective.`,
        type: 'normal'
      },
      {
        title: "Why Cyber Hygiene Matters in 2024",
        body: `The global cost of cybercrime reached $8 trillion in 2023 and is projected to hit $10.5 trillion annually by 2025 (Cybersecurity Ventures). More than 90% of successful cyberattacks begin with a human action — clicking a phishing link, using a weak password, or failing to apply a security patch.\n\nEvery person connected to the internet is a potential target. Attackers do not discriminate by age, profession, or technical skill. They use automated tools to scan millions of systems simultaneously, looking for the weakest links: unpatched software, reused passwords, or misconfigured services.\n\nOrganizations face additional complexity: a single compromised employee account can serve as the entry point for an entire network breach. The 2020 SolarWinds supply chain attack, which affected over 18,000 organizations including US government agencies, began from a single compromised build server.`,
        type: 'warning'
      },
      {
        title: "Your Digital Footprint",
        body: `A digital footprint is the trail of data you leave behind when you use the internet. It consists of two types:\n\n**Active footprint:** Data you deliberately share — social media posts, form submissions, online purchases, and email communications.\n\n**Passive footprint:** Data collected without your direct action — browsing history tracked by cookies, IP addresses logged by websites, location data harvested by apps, and behavioral profiles built by advertisers.\n\nAttackers use digital footprints in OSINT (Open-Source Intelligence) reconnaissance to build targeted profiles. Before launching a spear phishing attack, adversaries research their targets on LinkedIn, Facebook, and company websites to craft convincing, personalized messages.`,
        type: 'normal'
      },
      {
        title: "The Modern Threat Landscape",
        body: `Understanding the threats you face is the first step toward defending against them. The primary categories in today's threat landscape include:\n\n• **Phishing & Social Engineering** — Manipulating people into revealing credentials or clicking malicious links.\n• **Ransomware** — Encrypting victim data and demanding payment for the decryption key.\n• **Malware** — Software designed to disrupt, damage, or gain unauthorized access to systems.\n• **Data Breaches** — Unauthorized access to sensitive databases, often sold on dark web marketplaces.\n• **Supply Chain Attacks** — Compromising a trusted vendor or software provider to reach downstream targets.\n• **Zero-Day Exploits** — Attacks targeting previously unknown vulnerabilities before patches are available.`,
        type: 'normal'
      },
      {
        title: "💡 Pro Tip: The CIA Triad",
        body: `All security objectives can be mapped to the CIA Triad:\n\n**Confidentiality** — Ensuring information is accessible only to authorized parties.\n**Integrity** — Ensuring information is accurate and has not been tampered with.\n**Availability** — Ensuring systems and data are accessible when needed by authorized users.\n\nWhen evaluating any security practice or control, ask: does this protect confidentiality, integrity, or availability? Good cyber hygiene addresses all three.`,
        type: 'tip'
      },
      {
        title: "Personal Responsibility in Cybersecurity",
        body: `Cybersecurity is a shared responsibility. Technology alone cannot protect you — the most sophisticated firewall can be bypassed by a single employee clicking a phishing link.\n\nPersonal responsibility means:\n1. Staying informed about current threats and best practices.\n2. Applying security measures consistently, not just when reminded.\n3. Reporting suspicious activity promptly to security teams.\n4. Understanding that your digital actions affect not only you but your colleagues, organization, and community.\n\nThe "human firewall" concept acknowledges that people are both the greatest vulnerability and the strongest potential defense in any organization's security posture.`,
        type: 'normal'
      }
    ],
    videos: [
      { id: 'ch1-v1', title: 'What is Cybersecurity? (Introduction)', youtubeId: 'inWWhr5tnEA', level: 'Beginner', duration: '8:42' },
      { id: 'ch1-v2', title: 'Cyber Hygiene Best Practices', youtubeId: 'aO858HyFbKI', level: 'Beginner', duration: '12:15' },
      { id: 'ch1-v3', title: 'The Threat Landscape Explained', youtubeId: 'Dk-ZqQ-bfy4', level: 'Expert', duration: '18:30' },
      { id: 'ch1-v4', title: 'OSINT: How Attackers Research You', youtubeId: 'qwA6MmbeGNo', level: 'Expert', duration: '22:10' },
      { id: 'ch1-v5', title: 'Building a Security-First Mindset', youtubeId: 'hJHOuGD7gy0', level: 'Practical', duration: '15:45' },
    ],
    comicPanels: [
      { id: 'p1', title: 'The New Employee', description: 'Alex joins CyberCorp and gets a tour of the security policies.' },
      { id: 'p2', title: 'The Suspicious Email', description: 'Alex receives an urgent email claiming to be from IT asking for credentials.' },
      { id: 'p3', title: 'The Costly Mistake', description: 'Without thinking, Alex clicks the link and enters their password.' },
      { id: 'p4', title: 'The Breach', description: 'The attacker now has access to the entire CyberCorp network.' },
      { id: 'p5', title: 'The Lesson', description: 'The CISO explains: one click, one mistake — the entire human firewall failed.' },
    ],
    comicQuiz: [
      { id: 'cq1-1', question: "What was Alex's critical mistake in the comic?", options: ['Using a weak password', 'Clicking a suspicious link without verification', 'Sharing the email with colleagues', 'Logging into a public Wi-Fi network'], correctIndex: 1, explanation: "Alex clicked a suspicious link without verifying its legitimacy — the classic phishing vector that leads to credential theft." },
      { id: 'cq1-2', question: "What is a 'human firewall' in cybersecurity?", options: ['A physical security guard', 'Security-aware employees who actively prevent breaches', 'A firewall system managed by humans', 'A new type of intrusion detection system'], correctIndex: 1, explanation: "The 'human firewall' concept describes security-aware people who act as a defence layer against social engineering and human-error attacks." },
      { id: 'cq1-3', question: "What social engineering technique was used in the comic?", options: ['Vishing', 'Smishing', 'Phishing', 'Baiting'], correctIndex: 2, explanation: "Phishing involves sending deceptive emails that impersonate trusted entities to trick victims into revealing credentials or clicking malicious links." },
      { id: 'cq1-4', question: "Which step should Alex have taken before clicking the link?", options: ['Call the IT department to verify the email', 'Forward the email to all colleagues', 'Change the password immediately', 'Ignore the email'], correctIndex: 0, explanation: "Always verify suspicious requests through a separate, known-good communication channel — call IT directly using a published number, never the one in the suspicious email." },
      { id: 'cq1-5', question: "What does 'attack surface' mean?", options: ['The physical area of an office under attack', 'All points where an attacker could try to enter a system', 'The type of malware used in an attack', 'The financial damage caused by an attack'], correctIndex: 1, explanation: "Attack surface refers to all the points (software, hardware, networks, and human interfaces) where an unauthorized user can try to enter or extract data." },
    ],
    chapterQuiz: [
      { id: 'q1-1', question: "Which of the following BEST describes cyber hygiene?", options: ['One-time security setup for new computers', 'Routine practices maintaining digital health and security', 'Antivirus software installation only', 'Government cybersecurity regulations'], correctIndex: 1, explanation: "Cyber hygiene is an ongoing discipline of routine security practices — not a one-time action." },
      { id: 'q1-2', question: "What percentage of cyberattacks begin with a human action?", options: ['Less than 30%', 'Around 50%', 'Over 90%', 'Exactly 70%'], correctIndex: 2, explanation: "Over 90% of successful cyberattacks begin with a human action such as clicking a phishing link or using a weak password." },
      { id: 'q1-3', question: "What is a 'passive digital footprint'?", options: ['Data you deliberately share online', 'Data collected without your direct action', 'Your cybersecurity certificate', 'Deleted browser history'], correctIndex: 1, explanation: "A passive footprint is data collected without your direct action — cookies, IP logs, location data, and behavioral profiles." },
      { id: 'q1-4', question: "The CIA Triad stands for:", options: ['Cybersecurity, Intelligence, Auditing', 'Confidentiality, Integrity, Availability', 'Compliance, Investigation, Authentication', 'Central Intelligence Agency'], correctIndex: 1, explanation: "CIA Triad: Confidentiality (authorized access only), Integrity (accurate, unmodified data), Availability (accessible when needed)." },
      { id: 'q1-5', question: "OSINT in the context of cyberattacks refers to:", options: ['A type of malware', 'Open-Source Intelligence used by attackers to research targets', 'Online Security Intelligence Tools', 'An encryption standard'], correctIndex: 1, explanation: "OSINT (Open-Source Intelligence) is the collection of information from publicly available sources — attackers use it to build profiles before launching targeted attacks." },
      { id: 'q1-6', question: "Which attack compromised 18,000 organizations via a software update?", options: ['WannaCry', 'NotPetya', 'SolarWinds', 'Log4Shell'], correctIndex: 2, explanation: "The 2020 SolarWinds supply chain attack injected malicious code into a widely used IT management software update, compromising thousands of organizations." },
      { id: 'q1-7', question: "What is a Zero-Day exploit?", options: ['An attack that takes zero seconds', 'An attack on new systems on day zero', 'An attack targeting an unknown vulnerability before a patch exists', 'A failed cyberattack'], correctIndex: 2, explanation: "Zero-Day exploits target previously unknown vulnerabilities for which no patch exists — extremely dangerous because defenders have zero days to prepare." },
      { id: 'q1-8', question: "Which is an example of ransomware behavior?", options: ['Stealing usernames and selling them', 'Encrypting victim files and demanding payment', 'Sending spam emails automatically', 'Slowing down network speeds'], correctIndex: 1, explanation: "Ransomware encrypts the victim's files and demands a ransom payment (usually in cryptocurrency) for the decryption key." },
      { id: 'q1-9', question: "An 'active digital footprint' includes:", options: ['IP addresses logged automatically', 'Browser cookies set by websites', 'Social media posts you publish', 'Location data harvested by apps'], correctIndex: 2, explanation: "Active footprint is data you deliberately share — posts, form submissions, purchases. Passive footprint is collected without your direct action." },
      { id: 'q1-10', question: "Personal responsibility in cybersecurity means:", options: ['Only IT departments handle security', 'Applying security measures consistently and reporting threats', 'Using the most expensive security tools', 'Avoiding the internet entirely'], correctIndex: 1, explanation: "Every individual bears responsibility for consistent security practices — the human element is both the greatest vulnerability and strongest defence." },
      { id: 'q1-11', question: "Which principle states information should be accessible only to authorized parties?", options: ['Integrity', 'Availability', 'Confidentiality', 'Non-repudiation'], correctIndex: 2, explanation: "Confidentiality ensures information is accessible only to those authorized to access it — protecting against unauthorized disclosure." },
      { id: 'q1-12', question: "What is a supply chain attack?", options: ['Attacking physical supply warehouses', 'Compromising a vendor to reach downstream targets', 'Stealing goods during delivery', 'A DDoS attack on e-commerce sites'], correctIndex: 1, explanation: "Supply chain attacks compromise trusted vendors or software providers to gain access to their customers and partners." },
      { id: 'q1-13', question: "Global cybercrime costs are projected to reach how much annually by 2025?", options: ['$1 trillion', '$5 trillion', '$10.5 trillion', '$50 billion'], correctIndex: 2, explanation: "Cybersecurity Ventures projects global cybercrime costs will reach $10.5 trillion annually by 2025 — making it the world's third largest economy." },
      { id: 'q1-14', question: "Which of these is NOT a category in the modern threat landscape?", options: ['Ransomware', 'Social Engineering', 'Typewriter Attacks', 'Zero-Day Exploits'], correctIndex: 2, explanation: "Typewriter attacks are not a real cybersecurity category. The others — ransomware, social engineering, and zero-day exploits — are all genuine modern threats." },
      { id: 'q1-15', question: "Why is cyber hygiene compared to physical hygiene?", options: ['Both require expensive equipment', 'Both involve daily consistent habits for prevention', 'Both are regulated by government agencies', 'Both are only for professionals'], correctIndex: 1, explanation: "Like physical hygiene prevents illness through consistent daily habits, cyber hygiene prevents digital infections through routine security practices." },
    ],
    activities: {
      dragAndDrop: {
        title: "Sort the Threats",
        description: "Drag each item into the correct threat category.",
        items: ["Clicking a phishing link", "Unpatched software", "Weak passwords", "USB dropped in parking lot", "Fake IT support call", "SQL injection"],
        categories: ["Social Engineering", "Technical Vulnerability", "Physical Attack"]
      },
      matchFollowing: {
        title: "Match the Security Terms",
        pairs: [
          { term: "Confidentiality", definition: "Ensuring information is accessible only to authorized parties" },
          { term: "Integrity", definition: "Ensuring data is accurate and unmodified" },
          { term: "Availability", definition: "Ensuring systems are accessible when needed" },
          { term: "Zero-Day", definition: "Exploit targeting an unknown vulnerability" },
          { term: "OSINT", definition: "Intelligence gathered from public sources" },
        ]
      },
      scenario: {
        title: "The Suspicious Email",
        situation: "You receive an email from 'IT Support' saying your account will be suspended in 24 hours unless you click a link and verify your credentials. The email has the company logo but the sender address is support@ithelp-corp.net. What do you do?",
        choices: [
          { text: "Click the link immediately to avoid account suspension", isCorrect: false, feedback: "Wrong! This is a classic phishing attempt using urgency as a pressure tactic. The domain 'ithelp-corp.net' is not your company's domain." },
          { text: "Call IT directly using the official company number to verify", isCorrect: true, feedback: "Correct! Always verify suspicious requests through a known-good, separate communication channel. Never use contact info from the suspicious email." },
          { text: "Forward the email to all colleagues to warn them", isCorrect: false, feedback: "Forwarding suspicious emails can spread malware if they contain malicious attachments. Report it to IT security instead." },
          { text: "Reply to the email asking if it is legitimate", isCorrect: false, feedback: "Replying confirms your email is active to attackers and gives them another opportunity to manipulate you." },
        ]
      }
    },
    puzzleWords: ["HYGIENE", "PHISHING", "MALWARE", "FIREWALL", "BREACH", "OSINT", "TRIAD", "FOOTPRINT"],
    newsTips: [
      { headline: "Phishing Attacks Surge 61% in 2023", summary: "SlashNext's State of Phishing report reveals a 61% increase in phishing attacks, with AI-generated lures becoming harder to detect.", source: "SlashNext Security", severity: 'high' },
      { headline: "Human Error Responsible for 74% of Breaches", summary: "Verizon's Data Breach Investigations Report confirms social engineering and human mistake remain the top breach vectors globally.", source: "Verizon DBIR 2023", severity: 'high' },
      { headline: "Building a Security Culture: What Works", summary: "Organizations that run monthly security awareness training reduce successful phishing click rates by up to 87% within 12 months.", source: "KnowBe4 Research", severity: 'low' },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 2: Password Security
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 2,
    title: "Password Security",
    subtitle: "Your First Line of Digital Defence",
    description: "Master the principles of strong password creation, password management, Multi-Factor Authentication, and defence against credential attacks.",
    estimatedTime: "40 min",
    icon: "🔑",
    color: "blue",
    xpReward: 220,
    content: [
      {
        title: "The Password Problem",
        body: `Passwords remain the primary authentication mechanism for most digital systems, yet they are consistently the weakest link. According to Verizon's 2023 DBIR, 86% of web application attacks involved stolen credentials. The root cause is predictable human behaviour: people choose passwords that are easy to remember, reuse them across accounts, and resist changing them.\n\nThe average person has over 100 online accounts but typically uses only 5 unique passwords across all of them. This reuse means a single data breach can cascade into dozens of compromised accounts — a technique attackers exploit through credential stuffing attacks.`,
        type: 'normal'
      },
      {
        title: "Anatomy of a Strong Password",
        body: `Password strength is mathematically determined by entropy — the measure of unpredictability. A brute-force attack must try every possible combination; higher entropy means exponentially more guesses required.\n\n**Length:** The single most important factor. Every additional character multiplies the search space. A 12-character password is exponentially stronger than an 8-character one.\n\n**Character diversity:** Including uppercase, lowercase, numbers, and symbols increases the character set from 26 to 94+, dramatically expanding possible combinations.\n\n**Randomness:** Pattern-based passwords (Password1!, P@ssw0rd) are the first guesses in dictionary attacks. True randomness — not human-invented patterns — is required.\n\n**Example:** "J7#mK2$xQ9@vL" (13 chars, all character types) would take hundreds of millions of years to brute force with current computing power.`,
        type: 'normal'
      },
      {
        title: "💡 Use Passphrases",
        body: `A passphrase — a sequence of 4+ random words — is both highly secure and memorable. "correct-horse-battery-staple" has more entropy than a typical 8-character complex password while being far easier to remember.\n\nNIST SP 800-63B (the gold standard for authentication guidelines) now recommends length over complexity, supporting passphrase-based approaches.`,
        type: 'tip'
      },
      {
        title: "Password Managers: The Solution",
        body: `A password manager is software that generates, stores, and fills passwords securely, encrypted with a master password only you know. Using one solves the fundamental problem: you no longer need to remember dozens of passwords, so every account can have a unique, randomly generated, maximum-length password.\n\n**Reputable options:** Bitwarden (open-source, free tier excellent), 1Password, Dashlane, KeePassXC (local only).\n\n**Security model:** Most managers use AES-256 encryption with zero-knowledge architecture — the provider cannot see your passwords even if subpoenaed.\n\n**Critical practice:** Your master password must be unique, strong, and never stored digitally. Consider a secure physical backup.`,
        type: 'normal'
      },
      {
        title: "Multi-Factor Authentication (MFA)",
        body: `MFA requires verification from two or more independent factor categories:\n\n1. **Something you know** — Password or PIN\n2. **Something you have** — Hardware token (YubiKey), smartphone OTP app\n3. **Something you are** — Biometrics (fingerprint, face recognition)\n\nEven if an attacker obtains your password, MFA prevents access without the second factor. Microsoft reports that MFA blocks 99.9% of automated account attacks.\n\n**MFA hierarchy (best to weakest):**\n- Hardware security keys (FIDO2/WebAuthn) — phishing-resistant\n- Authenticator apps (TOTP: Google Authenticator, Authy) — excellent\n- Push notifications — good but vulnerable to MFA fatigue attacks\n- SMS OTP — better than nothing, but SIM-swappable\n- Email OTP — vulnerable to email account compromise`,
        type: 'normal'
      },
      {
        title: "⚠️ Common Credential Attacks",
        body: `**Brute Force:** Systematically trying every possible combination. Mitigated by account lockouts and strong passwords.\n\n**Dictionary Attack:** Trying common passwords and words from dictionaries. Mitigated by avoiding real words and common substitutions (3→e, @→a).\n\n**Credential Stuffing:** Using leaked username/password pairs from one breach to attack other services. Mitigated entirely by unique passwords per service.\n\n**Password Spraying:** Trying one common password against many accounts to avoid lockout triggers. Mitigated by MFA and strong password policies.\n\n**Phishing:** Tricking users into entering credentials on fake sites. Mitigated by hardware security keys (cryptographically bound to legitimate domain).`,
        type: 'warning'
      }
    ],
    videos: [
      { id: 'ch2-v1', title: 'Password Security Fundamentals', youtubeId: 'aEmXHzHXsJU', level: 'Beginner', duration: '10:22' },
      { id: 'ch2-v2', title: 'How Password Managers Work', youtubeId: 'w68BBPDAWr8', level: 'Beginner', duration: '8:15' },
      { id: 'ch2-v3', title: 'Multi-Factor Authentication Deep Dive', youtubeId: 'iXSyxm9jmmo', level: 'Expert', duration: '20:40' },
      { id: 'ch2-v4', title: 'How Attackers Crack Passwords', youtubeId: 'Hbeis5PBjio', level: 'Expert', duration: '25:10' },
      { id: 'ch2-v5', title: 'Setting Up 2FA on Every Account', youtubeId: 'GHT7GOwFMfU', level: 'Practical', duration: '14:30' },
    ],
    comicPanels: [
      { id: 'p1', title: 'The Password Diary', description: 'Sam uses the same password "Sam1234!" for all 47 online accounts.' },
      { id: 'p2', title: 'The Data Breach', description: 'A gaming forum Sam uses gets breached and the credentials are posted online.' },
      { id: 'p3', title: 'The Credential Stuffing Attack', description: 'An automated bot tries Sam\'s credentials on 500 different websites.' },
      { id: 'p4', title: 'The Cascade', description: 'The attacker accesses Sam\'s email, bank, and work account within hours.' },
      { id: 'p5', title: 'The Recovery', description: 'Sam learns about password managers and MFA — and sets them up for all accounts.' },
    ],
    comicQuiz: [
      { id: 'cq2-1', question: "Why was Sam's password strategy dangerous?", options: ['The password was too long', 'The same password was reused across many accounts', 'The password contained numbers', 'Sam stored it in a diary'], correctIndex: 1, explanation: "Password reuse means a single breach compromises all accounts sharing that password — the foundation of credential stuffing attacks." },
      { id: 'cq2-2', question: "What type of attack used Sam's leaked credentials on multiple sites?", options: ['Brute force attack', 'SQL injection', 'Credential stuffing', 'Dictionary attack'], correctIndex: 2, explanation: "Credential stuffing uses username/password pairs from known breaches to attempt access on other services, exploiting password reuse." },
      { id: 'cq2-3', question: "Which tool would have prevented the cascade attack?", options: ['Stronger password for gaming site only', 'Unique passwords for every account (via password manager)', 'Changing password monthly', 'Using a VPN'], correctIndex: 1, explanation: "Unique passwords per service mean a breach of one site cannot compromise others. A password manager makes this practical." },
      { id: 'cq2-4', question: "MFA would have helped Sam because:", options: ['It would have blocked the gaming site breach', 'Even with the correct password, the attacker could not access accounts without the second factor', 'It encrypts all passwords automatically', 'It prevents data breaches at service providers'], correctIndex: 1, explanation: "MFA requires a second factor (like a phone-based OTP) that the attacker would not have, even with a stolen password." },
      { id: 'cq2-5', question: "Which MFA method is the MOST phishing-resistant?", options: ['SMS OTP', 'Email verification code', 'Hardware security key (FIDO2)', 'Push notification approval'], correctIndex: 2, explanation: "Hardware security keys (FIDO2/WebAuthn) are cryptographically bound to the legitimate domain, making them immune to phishing attacks that redirect to fake sites." },
    ],
    chapterQuiz: [
      { id: 'q2-1', question: "What percentage of web application attacks involved stolen credentials?", options: ['40%', '62%', '86%', '99%'], correctIndex: 2, explanation: "Verizon's 2023 DBIR found 86% of web application attacks involved stolen credentials — the dominant attack vector." },
      { id: 'q2-2', question: "Password entropy is primarily increased by:", options: ['Using your birthdate', 'Length and character diversity', 'Changing passwords frequently', 'Using the same password everywhere'], correctIndex: 1, explanation: "Entropy — the measure of unpredictability — is most effectively increased by longer passwords with diverse character sets." },
      { id: 'q2-3', question: "Which NIST guideline recommends length over complexity?", options: ['NIST SP 800-53', 'NIST SP 800-63B', 'NIST SP 800-171', 'NIST CSF 2.0'], correctIndex: 1, explanation: "NIST SP 800-63B (Digital Identity Guidelines) now recommends password length over complex character requirements, supporting passphrase approaches." },
      { id: 'q2-4', question: "What is a passphrase?", options: ['A single complex word with substitutions', 'A sequence of 4+ random words forming a memorable password', 'A phrase from a famous book', 'A password written as a phrase'], correctIndex: 1, explanation: "A passphrase is 4+ random words concatenated — providing high entropy while remaining memorable. Example: 'correct-horse-battery-staple'" },
      { id: 'q2-5', question: "Password managers use which encryption standard?", options: ['MD5', 'DES', 'AES-256', 'RC4'], correctIndex: 2, explanation: "Reputable password managers use AES-256 encryption with zero-knowledge architecture — the provider cannot access your passwords." },
      { id: 'q2-6', question: "Which MFA factor category is a fingerprint?", options: ['Something you know', 'Something you have', 'Something you are', 'Something you do'], correctIndex: 2, explanation: "Biometrics (fingerprint, face recognition) fall under 'something you are' — the inherence factor in multi-factor authentication." },
      { id: 'q2-7', question: "MFA blocks what percentage of automated account attacks?", options: ['50%', '75%', '90%', '99.9%'], correctIndex: 3, explanation: "Microsoft reports that MFA blocks 99.9% of automated account compromise attacks, making it one of the most impactful security controls." },
      { id: 'q2-8', question: "SMS OTP is considered the weakest MFA method because:", options: ['It is too slow', 'Phone numbers can be SIM-swapped', 'It requires internet connection', 'It expires too quickly'], correctIndex: 1, explanation: "SIM swapping attacks allow attackers to transfer your phone number to their SIM card, intercepting SMS OTPs sent to your number." },
      { id: 'q2-9', question: "Password spraying differs from brute force because:", options: ['It targets only one account', 'It tries many common passwords against one account', 'It tries one common password against many accounts', 'It only works on admin accounts'], correctIndex: 2, explanation: "Password spraying tries one or few common passwords against many accounts — avoiding lockout policies that trigger after multiple failed attempts on a single account." },
      { id: 'q2-10', question: "Which is the BEST free open-source password manager?", options: ['LastPass', 'Bitwarden', 'iCloud Keychain', 'Firefox Sync'], correctIndex: 1, explanation: "Bitwarden is widely regarded as the best free, open-source password manager — its code is publicly auditable and it offers a comprehensive free tier." },
      { id: 'q2-11', question: "Credential stuffing requires:", options: ['Advanced malware', 'Previously leaked username/password combinations', 'Physical access to the target', 'SQL injection skills'], correctIndex: 1, explanation: "Credential stuffing uses username/password pairs from known data breaches, testing them across other services to find where victims reuse passwords." },
      { id: 'q2-12', question: "Zero-knowledge architecture in password managers means:", options: ['The manager has zero security features', 'The provider cannot access your stored passwords', 'Passwords are stored in plain text', 'Only you know the app exists'], correctIndex: 1, explanation: "Zero-knowledge means encryption and decryption happen locally on your device — the provider's servers only see encrypted data they cannot decrypt." },
      { id: 'q2-13', question: "Which attack tries every possible password combination?", options: ['Dictionary attack', 'Rainbow table attack', 'Brute force attack', 'Phishing attack'], correctIndex: 2, explanation: "Brute force attacks systematically try every possible combination of characters — effective against short passwords but computationally infeasible against long ones." },
      { id: 'q2-14', question: "FIDO2/WebAuthn hardware keys prevent phishing because:", options: ['They are physically uncloneable', 'They are cryptographically bound to the legitimate domain URL', 'They block all network connections', 'They require biometric verification'], correctIndex: 1, explanation: "FIDO2 keys only respond to authentication requests from the exact legitimate domain they were registered with — a fake phishing site cannot trigger a valid response." },
      { id: 'q2-15', question: "What is the average number of online accounts per person?", options: ['20', '50', '100+', '10'], correctIndex: 2, explanation: "Research shows the average person has over 100 online accounts — making password manager use essential for maintaining unique passwords for each." },
    ],
    activities: {
      dragAndDrop: {
        title: "Strong vs Weak Passwords",
        description: "Classify each password as Strong or Weak based on security principles.",
        items: ["Password1!", "j7#mK2$xQ9@vL5!", "qwerty123", "correct-horse-battery-staple", "abc123", "Xp9!zR2#mN7$wQ"],
        categories: ["Strong", "Weak"]
      },
      matchFollowing: {
        title: "Match Attack to Defence",
        pairs: [
          { term: "Credential Stuffing", definition: "Use unique passwords per service" },
          { term: "Brute Force", definition: "Use long, complex passwords" },
          { term: "Phishing for credentials", definition: "Use FIDO2 hardware keys" },
          { term: "Password spraying", definition: "Enable account lockout policies" },
          { term: "SIM swap attack", definition: "Use authenticator app instead of SMS" },
        ]
      },
      scenario: {
        title: "The Forgotten Password",
        situation: "Your colleague asks you for your password to access a shared file while you are on vacation. Your company has a shared file storage system. What should you do?",
        choices: [
          { text: "Share your password — it's just for one time", isCorrect: false, feedback: "Never share your password, even with trusted colleagues. This violates security policies and eliminates individual accountability." },
          { text: "Suggest using the file sharing feature to grant them specific access", isCorrect: true, feedback: "Correct! Grant specific, time-limited access through the system's built-in sharing features. This maintains individual accountability and the principle of least privilege." },
          { text: "Email your password to them", isCorrect: false, feedback: "Email is insecure and creates a permanent record of your credentials. Never transmit passwords via email." },
          { text: "Change your password to a temporary one for them", isCorrect: false, feedback: "This still violates the principle that passwords are personal credentials. Use proper access control features instead." },
        ]
      }
    },
    puzzleWords: ["PASSWORD", "ENTROPY", "CREDENTIAL", "PHISHING", "BITWARDEN", "MULTIFACTOR", "PASSPHRASE", "YUBIKEY"],
    newsTips: [
      { headline: "RockYou2024: 10 Billion Passwords Leaked", summary: "The largest password compilation ever, 'RockYou2024', was posted online containing nearly 10 billion unique passwords from multiple past breaches.", source: "CyberNews", severity: 'high' },
      { headline: "Microsoft: MFA Would Have Prevented 99.9% of Account Attacks", summary: "Analysis of millions of compromised accounts shows that virtually all could have been protected by enabling multi-factor authentication.", source: "Microsoft Security Blog", severity: 'medium' },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 3: Safe Internet Browsing
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "Safe Internet Browsing",
    subtitle: "Navigating the Web Without Getting Caught",
    description: "Learn to identify secure connections, manage browser security settings, avoid malicious downloads, and protect yourself from web-based threats.",
    estimatedTime: "35 min",
    icon: "🌐",
    color: "green",
    xpReward: 220,
    content: [
      {
        title: "HTTPS and Secure Connections",
        body: `HTTPS (Hypertext Transfer Protocol Secure) encrypts data transmitted between your browser and a website using TLS (Transport Layer Security). The padlock icon in your browser address bar indicates an HTTPS connection.\n\n**What HTTPS protects:** Data in transit from eavesdropping. Your password sent to a login form, for example, is encrypted and cannot be read by anyone intercepting the network traffic.\n\n**What HTTPS does NOT guarantee:** That the website itself is legitimate or trustworthy. Phishing sites routinely use HTTPS and display the padlock. Always verify the domain name carefully — not just the padlock.`,
        type: 'normal'
      },
      {
        title: "⚠️ Reading URLs Correctly",
        body: `URL anatomy is critical for identifying phishing and spoofed sites:\n\nhttps://accounts.google.com/login — LEGITIMATE (google.com is the registrable domain)\nhttps://google.com.accounts-login.net/login — PHISHING (accounts-login.net is the actual domain)\nhttps://paypa1.com — PHISHING (uses the digit 1 instead of the letter l)\n\nAlways read the domain immediately before the first single slash. The legitimate domain is the last two segments before the TLD (.com, .org, .net).`,
        type: 'warning'
      },
      {
        title: "Browser Security Settings",
        body: `Modern browsers have powerful security features that should be enabled:\n\n**Safe Browsing:** Google Safe Browsing (Chrome/Firefox/Safari) checks URLs against databases of known phishing and malware sites. Keep it enabled.\n\n**Pop-up Blocker:** Block unsolicited pop-up windows — a common vector for drive-by downloads.\n\n**Do Not Track & Privacy Settings:** While not a security control per se, limiting tracking reduces your attack surface from data brokers.\n\n**Security Updates:** Keep your browser updated. Chrome and Firefox push security patches frequently; unpatched browsers are primary targets for exploit kits.\n\n**Site Isolation:** Chrome's Site Isolation separates websites into separate processes, preventing cross-site attacks like Spectre.`,
        type: 'normal'
      },
      {
        title: "Safe Downloads",
        body: `Drive-by downloads occur when visiting a malicious site triggers an automatic download without user interaction. Malvertising embeds malicious code in legitimate ad networks.\n\n**Safe download practices:**\n• Only download software from official websites or verified app stores\n• Verify checksums (SHA-256 hash) for important software downloads\n• Be suspicious of executable downloads prompted by websites (.exe, .msi, .dmg)\n• Scan downloaded files with antivirus before opening\n• Avoid downloading pirated software — it is a primary malware distribution vector`,
        type: 'normal'
      },
      {
        title: "Browser Extensions: The Hidden Risk",
        body: `Browser extensions have extensive access to your browsing data — some have permission to read and modify all content on all websites you visit. Malicious or compromised extensions have caused significant data breaches.\n\n**Extension security practices:**\n• Install only from official stores (Chrome Web Store, Firefox Add-ons)\n• Review permissions before installation — be suspicious of broad "read all site data" permissions\n• Remove unused extensions regularly\n• Watch for extensions that are acquired by new companies — ownership changes sometimes introduce malware\n• Prefer extensions with many users and recent updates`,
        type: 'warning'
      },
      {
        title: "💡 Privacy-First Browsing",
        body: `Consider using privacy-focused browsers or configurations:\n\n**Browsers:** Firefox with privacy settings, Brave (Chromium-based with built-in blocking), Tor Browser for maximum anonymity.\n\n**Extensions:** uBlock Origin (ad/tracker blocking), Privacy Badger, HTTPS Everywhere.\n\n**Search Engines:** DuckDuckGo, Brave Search, or Startpage avoid building search history profiles.\n\nRemember: even with privacy tools, your ISP, employer network, and the websites you visit can still collect data about your activity.`,
        type: 'tip'
      }
    ],
    videos: [
      { id: 'ch3-v1', title: 'How HTTPS Works - TLS Explained', youtubeId: '-enHfpHMBo4', level: 'Beginner', duration: '9:30' },
      { id: 'ch3-v2', title: 'Browser Security Settings Guide', youtubeId: 'Hbeis5PBjio', level: 'Beginner', duration: '11:15' },
      { id: 'ch3-v3', title: 'How Malicious Websites Attack You', youtubeId: 'qwA6MmbeGNo', level: 'Expert', duration: '19:45' },
      { id: 'ch3-v4', title: 'VPNs and Privacy: The Complete Guide', youtubeId: 'gUI7eEUYKvk', level: 'Expert', duration: '23:00' },
      { id: 'ch3-v5', title: 'Setting Up a Secure Browser', youtubeId: 'ZMFBLJrMUqI', level: 'Practical', duration: '16:20' },
    ],
    comicPanels: [
      { id: 'p1', title: 'The Free Software', description: 'Jordan finds a free version of expensive software on an unfamiliar website.' },
      { id: 'p2', title: 'The Download', description: 'Despite warnings from the browser, Jordan downloads and installs the executable.' },
      { id: 'p3', title: 'The Trojan', description: 'The software installs correctly, but a keylogger silently runs in the background.' },
      { id: 'p4', title: 'The Breach', description: 'Jordan\'s banking credentials are captured and the account is drained overnight.' },
      { id: 'p5', title: 'The Check', description: 'The lesson: always download from official sources and verify checksums.' },
    ],
    comicQuiz: [
      { id: 'cq3-1', question: "What was the main risk in Jordan's story?", options: ['Using an outdated browser', 'Downloading software from an unofficial source', 'Using public Wi-Fi', 'Having a weak password'], correctIndex: 1, explanation: "Downloading software from unofficial or unverified sources is a primary vector for trojan horse malware distribution." },
      { id: 'cq3-2', question: "A padlock icon in your browser means:", options: ['The website is completely safe and legitimate', 'The connection between you and the site is encrypted', 'The site has been verified by Google', 'Your data cannot be stolen'], correctIndex: 1, explanation: "HTTPS/padlock only means the connection is encrypted in transit. Phishing sites also use HTTPS — the padlock does NOT guarantee legitimacy." },
      { id: 'cq3-3', question: "Which URL is likely a phishing attempt?", options: ['https://google.com/login', 'https://accounts.google.com', 'https://google.com.secure-login.net', 'https://mail.google.com'], correctIndex: 2, explanation: "The actual domain is 'secure-login.net' — 'google.com' is just a subdomain of it. Always read the domain immediately before the first single slash." },
      { id: 'cq3-4', question: "What is a drive-by download?", options: ['Downloading while driving', 'Downloading a file you intended to get', 'Automatic malware download triggered by visiting a malicious site', 'Downloading via Bluetooth'], correctIndex: 2, explanation: "Drive-by downloads occur automatically when visiting a malicious or compromised website, often without any user interaction or consent." },
      { id: 'cq3-5', question: "Browser extensions should be treated with caution because:", options: ['They slow down the browser', 'They can have extensive access to all websites you visit', 'They are difficult to install', 'They are not available on mobile'], correctIndex: 1, explanation: "Many extensions request 'read and modify all data on all websites' — malicious or compromised extensions can steal credentials and browsing data." },
    ],
    chapterQuiz: [
      { id: 'q3-1', question: "TLS in HTTPS stands for:", options: ['Trusted Link Security', 'Transport Layer Security', 'Terminal Lock System', 'Transfer Link Standard'], correctIndex: 1, explanation: "TLS (Transport Layer Security) is the cryptographic protocol that provides encryption for HTTPS connections." },
      { id: 'q3-2', question: "In the URL 'https://paypal.com.verify-now.net/login', the actual domain is:", options: ['paypal.com', 'verify-now.net', 'paypal.com.verify-now.net', 'https'], correctIndex: 1, explanation: "The actual registerable domain is 'verify-now.net' — paypal.com is just a subdomain prefix used to deceive victims." },
      { id: 'q3-3', question: "Safe Browsing in Chrome protects against:", options: ['Slow internet connections', 'Known phishing and malware sites', 'Outdated browser versions', 'Weak passwords'], correctIndex: 1, explanation: "Google Safe Browsing maintains databases of known malicious URLs and warns users before visiting phishing or malware-hosting sites." },
      { id: 'q3-4', question: "What does verifying a file checksum (SHA-256) confirm?", options: ['The file is virus-free', 'The file has not been tampered with during download', 'The software is free to use', 'The file is compatible with your system'], correctIndex: 1, explanation: "SHA-256 checksums verify file integrity — if even one bit changed during download (or by malicious modification), the hash will be completely different." },
      { id: 'q3-5', question: "Which browser extension category poses the HIGHEST risk?", options: ['Ad blockers', 'Password managers', 'Extensions with broad "read all site data" permissions', 'Dark mode extensions'], correctIndex: 2, explanation: "Extensions with broad permissions to read and modify all website content are highest risk — they can capture form data, passwords, and all browsing activity." },
      { id: 'q3-6', question: "Malvertising distributes malware through:", options: ['Phishing emails', 'Legitimate advertising networks compromised with malicious code', 'USB drives', 'Fake antivirus software'], correctIndex: 1, explanation: "Malvertising injects malicious code into legitimate advertising networks, exposing users of reputable websites to malware without any interaction required." },
      { id: 'q3-7', question: "Which browser is known for built-in ad and tracker blocking?", options: ['Internet Explorer', 'Chrome', 'Brave', 'Safari'], correctIndex: 2, explanation: "Brave is a Chromium-based browser with built-in ad blocking, tracker blocking, and privacy features enabled by default." },
      { id: 'q3-8', question: "HTTPS does NOT protect against:", options: ['Eavesdropping on network traffic', 'Credentials being stolen by the site owner', 'Man-in-the-middle interception', 'Packet sniffing on public Wi-Fi'], correctIndex: 1, explanation: "HTTPS only protects data in transit. If the legitimate site (or a phishing site) collects your credentials, HTTPS provides no protection." },
      { id: 'q3-9', question: "Pop-up blockers help prevent:", options: ['Phishing emails', 'Drive-by downloads and malvertising pop-ups', 'Browser extensions from running', 'Cookies from being set'], correctIndex: 1, explanation: "Pop-ups are commonly used for drive-by download prompts and malicious redirect chains — blocking them eliminates this attack vector." },
      { id: 'q3-10', question: "What is Chrome's Site Isolation feature?", options: ['Puts websites in airplane mode', 'Separates websites into different processes to prevent cross-site attacks', 'Blocks all third-party cookies', 'Prevents JavaScript from running'], correctIndex: 1, explanation: "Site Isolation runs each website in a separate process, preventing cross-site attacks like Spectre that could read data from other tabs." },
      { id: 'q3-11', question: "pirated software is a primary malware vector because:", options: ['It is always slower than legitimate software', 'Distributors bundle malware with the software', 'It uses more system resources', 'It bypasses Windows activation'], correctIndex: 1, explanation: "Pirated software is a primary malware distribution vector — cracks and keygens commonly contain trojans, ransomware, or cryptominers." },
      { id: 'q3-12', question: "Which is the safest place to download browser extensions?", options: ['Any website offering them', 'The official browser extension store (Chrome Web Store, Firefox Add-ons)', 'GitHub repositories', 'Email attachments from developers'], correctIndex: 1, explanation: "Official extension stores provide review processes and require developers to meet standards — they are significantly safer than third-party sources." },
      { id: 'q3-13', question: "A typosquatting attack would register which domain?", options: ['google.com', 'gogle.com', 'search.google.com', 'google.support'], correctIndex: 1, explanation: "Typosquatting registers common misspellings of legitimate domains (gogle.com, facbook.com) to capture users who make typing errors." },
      { id: 'q3-14', question: "DuckDuckGo is preferred by privacy-conscious users because:", options: ['It is faster than Google', 'It does not track search history or build user profiles', 'It has better search results', 'It is government-approved'], correctIndex: 1, explanation: "DuckDuckGo does not store search history, build user profiles, or sell data to advertisers — unlike Google which monetizes search behavior." },
      { id: 'q3-15', question: "Browser updates should be:", options: ['Applied only yearly', 'Delayed until thoroughly tested by IT', 'Applied promptly as they often contain security patches', 'Skipped if current version is working'], correctIndex: 2, explanation: "Browser security patches address vulnerabilities actively exploited by attackers — delays in updating leave you exposed to known attacks." },
    ],
    activities: {
      dragAndDrop: {
        title: "Safe or Unsafe?",
        description: "Categorize each browsing behaviour.",
        items: ["Downloading software from official website", "Clicking email link to login page", "Checking SHA-256 hash of download", "Installing extension with full-site access", "Using HTTPS on public Wi-Fi", "Ignoring browser security warnings"],
        categories: ["Safe Practice", "Unsafe Practice"]
      },
      matchFollowing: {
        title: "Browser Security Features",
        pairs: [
          { term: "Safe Browsing", definition: "Warns about known phishing and malware sites" },
          { term: "Site Isolation", definition: "Separates sites into different processes" },
          { term: "HTTPS", definition: "Encrypts data between browser and server" },
          { term: "Pop-up Blocker", definition: "Prevents unsolicited windows from opening" },
          { term: "uBlock Origin", definition: "Blocks ads and malicious trackers" },
        ]
      },
      scenario: {
        title: "The Urgent Plugin Request",
        situation: "You visit a streaming website and a popup says: 'Your Flash Player is outdated. Click here to update to watch this content.' The download button is prominent and urgent-looking. What do you do?",
        choices: [
          { text: "Click the update button — you need to watch the content", isCorrect: false, feedback: "This is a classic drive-by download trap. Adobe Flash is discontinued. Legitimate sites do not prompt Flash updates — this is fake and contains malware." },
          { text: "Close the popup and find the content on an official streaming platform", isCorrect: true, feedback: "Correct! Fake plugin update prompts are a common social engineering technique to deliver malware. Go to legitimate sources instead." },
          { text: "Download and scan the file before opening", isCorrect: false, feedback: "Some malware evades static antivirus scanning. More importantly, you should not even download from unverified sources." },
          { text: "Update Flash from the Adobe official website", isCorrect: false, feedback: "Adobe discontinued Flash in 2020 — there are no legitimate Flash updates. Any Flash update prompt in 2024 is a social engineering attack." },
        ]
      }
    },
    puzzleWords: ["HTTPS", "PHISHING", "EXTENSION", "CHECKSUM", "MALWARE", "DOWNLOAD", "PRIVACY", "BROWSER"],
    newsTips: [
      { headline: "Fake Browser Update Campaigns Surging", summary: "Security researchers document significant increase in 'FakeUpdates' campaigns using fake browser update prompts to deliver malware payloads.", source: "Malwarebytes Labs", severity: 'high' },
      { headline: "Chrome Extension Compromised — 400K Users Affected", summary: "A popular productivity Chrome extension was silently updated by its new owners to include session-stealing malware targeting banking sites.", source: "Bleeping Computer", severity: 'high' },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 4: Email Security
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 4,
    title: "Email Security",
    subtitle: "Defending the Most Targeted Attack Vector",
    description: "Master identification and defence against phishing, spear phishing, BEC attacks, and learn safe email handling practices.",
    estimatedTime: "40 min",
    icon: "📧",
    color: "yellow",
    xpReward: 220,
    content: [
      { title: "Why Email Is the Primary Attack Vector", body: "Email is the most common entry point for cyberattacks — over 90% of malware is delivered via email. The Verizon DBIR consistently identifies phishing as the top threat action pattern. Despite decades of warnings, email attacks remain devastatingly effective because they exploit human psychology: urgency, authority, curiosity, and fear.\n\nThe average business email user receives 121 emails per day. Volume combined with habitual clicking creates the ideal environment for attackers to succeed.", type: 'normal' },
      { title: "Phishing Anatomy", body: "A phishing email typically contains:\n\n**Sender spoofing:** The display name shows a trusted organization but the actual sending domain is different.\n**Urgency cues:** 'Your account will be suspended in 24 hours', 'Immediate action required'\n**Malicious links:** URLs that appear legitimate but redirect to phishing infrastructure\n**Credential harvesting forms:** Fake login pages that capture entered credentials\n**Malicious attachments:** Documents (PDF, Office files) with embedded macros or exploits\n\nAlways check the actual sender domain, not just the display name.", type: 'normal' },
      { title: "Spear Phishing — Targeted Attacks", body: "Spear phishing is a targeted phishing attack personalized to the victim. Attackers research their targets using OSINT (LinkedIn, company websites, social media) to craft convincing, contextually relevant messages.\n\nExample: An employee receives an email 'from' their CEO mentioning a real project by name, asking them to transfer funds urgently. This is called Business Email Compromise (BEC).\n\nBEC is the most financially damaging cybercrime category — FBI IC3 reports over $2.7 billion in losses in 2022 alone.", type: 'warning' },
      { title: "Business Email Compromise (BEC)", body: "BEC attacks impersonate executives or trusted business partners to initiate fraudulent wire transfers or data exfiltration. Methods include:\n\n**CEO fraud:** Attacker impersonates the CEO, urgently requesting a wire transfer\n**Vendor impersonation:** Attacker poses as a trusted supplier requesting payment to a new bank account\n**Account compromise:** Attacker gains access to a real email account and uses it for attacks\n\n**Prevention:** Verbal verification for financial requests, dual-approval policies for large transfers, and email authentication protocols (DMARC, DKIM, SPF).", type: 'normal' },
      { title: "Email Authentication Protocols", body: "**SPF (Sender Policy Framework):** Specifies which mail servers are authorized to send email for a domain. Receiving servers check incoming mail against SPF records.\n\n**DKIM (DomainKeys Identified Mail):** Adds a cryptographic signature to outgoing emails, allowing receivers to verify the message was not modified in transit.\n\n**DMARC (Domain-based Message Authentication, Reporting & Conformance):** Builds on SPF and DKIM, allowing domain owners to specify how receivers should handle authentication failures — reject, quarantine, or none.\n\nOrganizations with DMARC 'reject' policies dramatically reduce email spoofing against their domain.", type: 'normal' },
      { title: "💡 Safe Attachment Handling", body: "**Never open attachments you were not expecting**, even from known senders — their account may be compromised.\n\n**File types to be especially cautious with:**\n• Office files (.docx, .xlsx, .pptx) — can contain macros\n• Archive files (.zip, .rar) — often contain malicious executables\n• PDFs — can contain JavaScript exploits\n• Executable files (.exe, .bat, .vbs) — should almost never be emailed legitimately\n\nWhen in doubt: contact the sender via phone or a separate email to verify before opening.", type: 'tip' }
    ],
    videos: [
      { id: 'ch4-v1', title: 'Phishing Explained for Beginners', youtubeId: 'XBkzBrXlle0', level: 'Beginner', duration: '8:30' },
      { id: 'ch4-v2', title: 'How to Spot a Phishing Email', youtubeId: 'BktmJJJzwQU', level: 'Beginner', duration: '11:00' },
      { id: 'ch4-v3', title: 'Business Email Compromise Deep Dive', youtubeId: 'wxHtVPbz_-k', level: 'Expert', duration: '21:30' },
      { id: 'ch4-v4', title: 'DMARC, DKIM, SPF Explained', youtubeId: 'jc0DdMZBbxM', level: 'Expert', duration: '17:45' },
      { id: 'ch4-v5', title: 'Email Security Best Practices', youtubeId: 'Ht2KJoECCj0', level: 'Practical', duration: '13:20' },
    ],
    comicPanels: [
      { id: 'p1', title: 'The CEO Request', description: 'Finance manager Emma receives an urgent email from the "CEO" asking for a wire transfer.' },
      { id: 'p2', title: 'The Pressure', description: 'The email says: "This is confidential and time-sensitive. Do not tell anyone. Transfer immediately."' },
      { id: 'p3', title: 'The Red Flag', description: 'Emma notices the CEO\'s email address is subtly different from the official one.' },
      { id: 'p4', title: 'The Verification', description: 'Emma calls the CEO directly — who has no idea what Emma is talking about.' },
      { id: 'p5', title: 'The Prevention', description: 'Emma reports the BEC attempt. IT security traces it and blocks the attacker\'s infrastructure.' },
    ],
    comicQuiz: [
      { id: 'cq4-1', question: "What type of attack did Emma encounter?", options: ['Phishing', 'Business Email Compromise (BEC)', 'Ransomware', 'SQL injection'], correctIndex: 1, explanation: "Business Email Compromise (BEC) involves impersonating executives or business partners to trick employees into making fraudulent wire transfers." },
      { id: 'cq4-2', question: "Which red flag did Emma correctly notice?", options: ['The email had a logo', 'The email address was slightly different from the official one', 'The email requested money', 'The email was urgent'], correctIndex: 1, explanation: "A subtly different email address (e.g., ceo@company-corp.com vs ceo@company.com) is a key red flag of domain spoofing in BEC attacks." },
      { id: 'cq4-3', question: "What made Emma's response correct?", options: ['She replied to the email asking for confirmation', 'She transferred a smaller amount instead', 'She called the CEO directly to verify', 'She ignored the email'], correctIndex: 2, explanation: "Out-of-band verification — calling the requester directly using a known number — is the critical defence against BEC and social engineering." },
      { id: 'cq4-4', question: "Why do BEC emails often request secrecy?", options: ['To maintain privacy', 'To prevent the target from seeking verification from others', 'For legal reasons', 'To speed up the process'], correctIndex: 1, explanation: "Demanding secrecy isolates the victim and prevents them from getting a second opinion — a classic social engineering manipulation technique." },
      { id: 'cq4-5', question: "FBI IC3 reports BEC losses of over how much in 2022?", options: ['$500 million', '$1.2 billion', '$2.7 billion', '$10 billion'], correctIndex: 2, explanation: "BEC is the most financially damaging cybercrime category — the FBI IC3 2022 report documented over $2.7 billion in losses." },
    ],
    chapterQuiz: [
      { id: 'q4-1', question: "What percentage of malware is delivered via email?", options: ['25%', '50%', 'Over 90%', '75%'], correctIndex: 2, explanation: "Email is the primary malware delivery vector — over 90% of malware reaches victims through email attachments or malicious links." },
      { id: 'q4-2', question: "Spear phishing differs from regular phishing because:", options: ['It only targets fish', 'It is personalized and targeted to specific individuals', 'It uses different malware', 'It only targets executives'], correctIndex: 1, explanation: "Spear phishing is highly targeted and personalized — attackers research victims using OSINT to craft convincing, contextually relevant attacks." },
      { id: 'q4-3', question: "SPF (Sender Policy Framework) specifies:", options: ['Encryption standards for email', 'Which servers are authorized to send email for a domain', 'How email is archived', 'User authentication requirements'], correctIndex: 1, explanation: "SPF records specify which mail servers are authorized to send email on behalf of a domain, helping receivers identify spoofed emails." },
      { id: 'q4-4', question: "DKIM provides email security by:", options: ['Encrypting the email content', 'Adding a cryptographic signature to verify the email has not been modified', 'Filtering spam', 'Authenticating the recipient'], correctIndex: 1, explanation: "DKIM adds a cryptographic signature that allows receivers to verify the email has not been modified in transit and came from the claimed domain." },
      { id: 'q4-5', question: "A DMARC policy of 'reject' means:", options: ['All emails are rejected', 'Emails failing SPF/DKIM checks are rejected by the receiving server', 'The sender rejects incoming mail', 'Emails are rejected after 24 hours'], correctIndex: 1, explanation: "DMARC 'reject' policy instructs receiving servers to discard emails that fail SPF and DKIM authentication — preventing spoofed emails from reaching inboxes." },
      { id: 'q4-6', question: "Which file type attached to emails should be treated with HIGHEST suspicion?", options: ['.txt files', '.jpg images', '.exe executable files', '.html files'], correctIndex: 2, explanation: "Executable files (.exe, .bat, .vbs) can run code directly on your system — they should almost never be legitimately delivered via email." },
      { id: 'q4-7', question: "What is the correct response to a suspicious financial request via email from your CEO?", options: ['Transfer the amount as requested', 'Reply asking for confirmation', 'Call the CEO directly to verify', 'Escalate via email to finance team'], correctIndex: 2, explanation: "Out-of-band verification via phone using a known number is the only reliable way to verify high-value requests — BEC attacks specifically target email-only verification." },
      { id: 'q4-8', question: "Office document macro attacks work by:", options: ['Corrupting the document file', 'Running embedded code when the user enables macros', 'Spreading through network shares', 'Overwriting system files directly'], correctIndex: 1, explanation: "Office files can contain macros — small programs that run when the user enables them. Attackers embed malware in macros and socially engineer victims to enable them." },
      { id: 'q4-9', question: "What does 'sender spoofing' mean?", options: ['The email was sent twice', 'The display name shows a trusted source but the actual sender domain is different', 'The email was modified in transit', 'The sender is anonymous'], correctIndex: 1, explanation: "Sender spoofing manipulates the display name field to show a trusted organization while the actual sending email address belongs to the attacker." },
      { id: 'q4-10', question: "Average daily business emails received per user:", options: ['30', '50', '121', '200'], correctIndex: 2, explanation: "The average business user receives 121 emails per day — high volume creates habitual clicking behaviour that phishers exploit." },
      { id: 'q4-11', question: "Which scenario is the primary target of BEC attacks?", options: ['Stealing personal photos', 'Initiating fraudulent wire transfers', 'Installing ransomware', 'Stealing intellectual property'], correctIndex: 1, explanation: "BEC attacks primarily target financial operations — tricking finance teams into initiating fraudulent wire transfers to attacker-controlled accounts." },
      { id: 'q4-12', question: "Before opening an attachment from a known contact, you should:", options: ['Open it immediately if they are trusted', 'Verify they intentionally sent it via a separate channel', 'Only open it during business hours', 'Forward to IT before opening'], correctIndex: 1, explanation: "Known contacts' accounts may be compromised. Always verify via phone or separate message before opening unexpected attachments." },
      { id: 'q4-13', question: "Vendor impersonation BEC attacks involve:", options: ['Hacking into vendor systems', 'Posing as a trusted supplier requesting payment to a new account', 'Sending malware via vendor software updates', 'Calling pretending to be a vendor'], correctIndex: 1, explanation: "Vendor impersonation BEC poses as a known supplier, often saying 'our bank details have changed' to redirect legitimate payments to the attacker." },
      { id: 'q4-14', question: "Which defence MOST effectively prevents CEO fraud wire transfers?", options: ['Email spam filters', 'Verbal verification policy for financial requests over a threshold', 'Strong email passwords', 'Email encryption'], correctIndex: 1, explanation: "Mandatory verbal verification — calling the requester directly using a published number for all financial requests over a threshold — is the most effective BEC defence." },
      { id: 'q4-15', question: "ZIP file attachments are used in phishing campaigns because:", options: ['They are smaller files', 'They can contain malicious executables and bypass some email filters', 'They are universally compatible', 'They cannot be opened on mobile'], correctIndex: 1, explanation: "ZIP archives can contain malicious executables (.exe, .js, .vbs) and sometimes bypass email attachment filters that scan file types individually." },
    ],
    activities: {
      dragAndDrop: {
        title: "Phishing Red Flags",
        description: "Identify which elements are red flags in an email.",
        items: ["Urgent deadline pressure", "Official company logo", "Misspelled domain", "Request for MFA code", "Unexpected attachment", "Personalized greeting with your name"],
        categories: ["Red Flag (Suspicious)", "Neutral (Not suspicious alone)"]
      },
      matchFollowing: {
        title: "Email Security Protocols",
        pairs: [
          { term: "SPF", definition: "Authorizes sending servers for a domain" },
          { term: "DKIM", definition: "Cryptographic signature verifying email integrity" },
          { term: "DMARC", definition: "Policy for handling SPF/DKIM failures" },
          { term: "BEC", definition: "Business Email Compromise — executive impersonation fraud" },
          { term: "Spear Phishing", definition: "Personalized targeted phishing using OSINT" },
        ]
      },
      scenario: {
        title: "The Invoice Email",
        situation: "You receive an email from a supplier you work with regularly. The email says their banking details have changed and provides a new account number for the next invoice payment. The email looks exactly like their normal emails.",
        choices: [
          { text: "Update the bank details and pay the next invoice to the new account", isCorrect: false, feedback: "NEVER update financial details based solely on an email request. This is the classic vendor impersonation BEC scenario — billions have been lost this way." },
          { text: "Call the supplier using their official number (from your records, not the email) to verify", isCorrect: true, feedback: "Correct! Always verify bank detail changes by calling the supplier using a previously known, verified number — not any number provided in the suspicious email." },
          { text: "Reply to the email asking them to confirm it's genuine", isCorrect: false, feedback: "If the email is fraudulent, the attacker will simply confirm it is genuine. Only out-of-band verification (phone call to a known number) is reliable." },
          { text: "Check if the email passed SPF and DKIM before acting", isCorrect: false, feedback: "While SPF/DKIM are helpful, compromised email accounts can send with valid authentication. Verbal verification is required for financial transactions." },
        ]
      }
    },
    puzzleWords: ["PHISHING", "DMARC", "SPOOFING", "ATTACHMENT", "SPEARPHISH", "BEC", "DOMAIN", "MACRO"],
    newsTips: [
      { headline: "BEC Losses Exceed $2.7 Billion in 2022", summary: "FBI Internet Crime Report shows BEC remains the costliest cybercrime category, with losses continuing to climb despite increased awareness.", source: "FBI IC3 2022 Report", severity: 'high' },
      { headline: "AI-Generated Phishing Emails Harder to Detect", summary: "LLM-generated phishing emails are grammatically perfect and contextually tailored, reducing the effectiveness of traditional phishing detection methods.", source: "IBM Security", severity: 'high' },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 5: Device Security
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Device Security",
    subtitle: "Protecting Your Endpoints From All Angles",
    description: "Implement comprehensive device security through patch management, antivirus, firewalls, endpoint protection, and mobile security.",
    estimatedTime: "38 min",
    icon: "💻",
    color: "purple",
    xpReward: 220,
    content: [
      { title: "Why Device Security Is Foundational", body: "Devices — laptops, desktops, smartphones, tablets, and IoT devices — are the physical endpoints where users interact with data. Securing them is foundational because a compromised device gives attackers a persistent foothold within your network, from which they can move laterally to higher-value targets.\n\nEndpoint security has three core objectives: prevent malware from executing, detect anomalous behavior, and enable rapid response to confirmed incidents.", type: 'normal' },
      { title: "Patch Management", body: "Software vulnerabilities are discovered constantly. When vendors release patches addressing security flaws, the window of exposure between patch release and user installation is actively exploited by attackers. The 2017 WannaCry ransomware attack infected 300,000+ systems across 150 countries — exploiting a Windows vulnerability (EternalBlue) for which a patch had been available for two months.\n\n**Patch management best practices:**\n• Enable automatic updates for OS and critical software\n• Establish a patch cadence: critical patches within 72 hours, high within 7 days\n• Maintain an asset inventory to know what needs patching\n• Test patches in staging environments before mass deployment in organizations", type: 'normal' },
      { title: "Antivirus and EDR", body: "Traditional antivirus (AV) uses signature databases to detect known malware. While still useful, modern threats use polymorphism and obfuscation to evade signatures.\n\n**Endpoint Detection and Response (EDR)** is the modern evolution: instead of signature matching, EDR uses behavioral analysis — monitoring process execution, network connections, file system changes, and registry modifications to detect anomalous activity patterns indicative of attack techniques.\n\nLeading EDR solutions: CrowdStrike Falcon, SentinelOne, Microsoft Defender for Endpoint, Carbon Black.\n\nFor individuals: Microsoft Defender (built-in to Windows) is now a highly capable free AV solution.", type: 'normal' },
      { title: "Host Firewalls", body: "A host-based firewall controls inbound and outbound network connections at the device level. Unlike network firewalls, host firewalls protect the device regardless of what network it is connected to — critical for laptops that travel between corporate networks, home networks, and public Wi-Fi.\n\n**Configuration principles:**\n• Block all inbound connections by default; allow only what is explicitly needed\n• Review and restrict outbound connections from sensitive applications\n• Enable logging for connection attempts to support forensic investigation\n• Windows Defender Firewall and macOS firewall are competent built-in solutions", type: 'normal' },
      { title: "Mobile Device Security", body: "Smartphones contain highly sensitive data — contacts, location history, banking apps, emails, and increasingly, corporate access. Mobile security requires:\n\n**Screen lock:** Use biometric or strong PIN, not pattern or swipe\n**App sources:** Install only from official stores (App Store, Google Play) — avoid sideloading\n**App permissions:** Review and revoke unnecessary permissions (location, contacts, microphone)\n**OS updates:** Apply mobile OS patches promptly — they are often targeting actively exploited vulnerabilities\n**Remote wipe:** Enable remote lock and wipe capability (Find My iPhone, Android Device Manager)\n**Encryption:** Modern smartphones encrypt storage by default — never root or jailbreak a device used for sensitive purposes", type: 'normal' },
      { title: "💡 Full Disk Encryption", body: "Full disk encryption (FDE) protects data on devices that are physically stolen or lost. Without FDE, an attacker can remove the storage drive and read all data directly, bypassing the login password.\n\n**Windows:** BitLocker (built-in on Pro/Enterprise editions)\n**macOS:** FileVault (built-in)\n**Linux:** LUKS encryption\n\nFDE renders stolen device data completely inaccessible without the encryption key — a critical protection for laptops that travel with sensitive data.", type: 'tip' }
    ],
    videos: [
      { id: 'ch5-v1', title: 'Endpoint Security Fundamentals', youtubeId: 'Dk-ZqQ-bfy4', level: 'Beginner', duration: '10:15' },
      { id: 'ch5-v2', title: 'How Antivirus and EDR Work', youtubeId: 'r3uBtOlPdMQ', level: 'Beginner', duration: '12:30' },
      { id: 'ch5-v3', title: 'WannaCry: How Patch Management Could Have Stopped It', youtubeId: 'SiGMCPBKVhg', level: 'Expert', duration: '19:00' },
      { id: 'ch5-v4', title: 'BitLocker Encryption Setup', youtubeId: '0Vy_WCCqfLI', level: 'Practical', duration: '14:45' },
      { id: 'ch5-v5', title: 'Mobile Security Best Practices', youtubeId: 'dUL9JL3LWFA', level: 'Practical', duration: '16:00' },
    ],
    comicPanels: [
      { id: 'p1', title: 'The Notification', description: 'Marcus gets a Windows update notification but clicks "Remind me later" for the third week.' },
      { id: 'p2', title: 'The Attack', description: 'Ransomware exploiting the unpatched vulnerability encrypts Marcus\'s entire drive.' },
      { id: 'p3', title: 'The Demand', description: 'A message demands 2 Bitcoin ($80,000) for the decryption key.' },
      { id: 'p4', title: 'The Investigation', description: 'IT discovers the exact vulnerability exploited — patched months ago in the update Marcus skipped.' },
      { id: 'p5', title: 'The Policy', description: 'Organization implements mandatory automatic patching within 72 hours for critical vulnerabilities.' },
    ],
    comicQuiz: [
      { id: 'cq5-1', question: "What was Marcus's critical mistake?", options: ['Using a weak password', 'Not having antivirus', 'Repeatedly postponing critical security updates', 'Using an old computer'], correctIndex: 2, explanation: "Delaying security patches leaves systems vulnerable to known exploits — the vulnerability exploited had a patch available months before the attack." },
      { id: 'cq5-2', question: "WannaCry (referenced in the comic) affected how many systems?", options: ['10,000', '50,000', '300,000+', '1 million+'], correctIndex: 2, explanation: "WannaCry infected over 300,000 systems across 150 countries by exploiting a Windows vulnerability that had been patched 2 months earlier." },
      { id: 'cq5-3', question: "What type of malware encrypted Marcus's drive?", options: ['Spyware', 'Adware', 'Ransomware', 'Rootkit'], correctIndex: 2, explanation: "Ransomware encrypts victim files and demands payment for the decryption key — one of the most financially impactful forms of malware." },
      { id: 'cq5-4', question: "What policy correctly addresses the patch problem?", options: ['Apply patches yearly during maintenance windows', 'Apply critical patches within 72 hours', 'Test patches for 6 months before deploying', 'Only patch when attacks are reported'], correctIndex: 1, explanation: "Critical vulnerability patches should be applied within 72 hours — this minimizes the exposure window before attackers can develop and deploy exploits." },
      { id: 'cq5-5', question: "Full disk encryption would have helped Marcus in which scenario?", options: ['Preventing the ransomware attack', 'Protecting data if the physical device was stolen', 'Speeding up encryption for backups', 'Preventing brute force on his login'], correctIndex: 1, explanation: "Full disk encryption protects data if a device is physically stolen — it would not prevent ransomware from encrypting data on an unlocked, running system." },
    ],
    chapterQuiz: [
      { id: 'q5-1', question: "EDR differs from traditional antivirus by:", options: ['Being more expensive', 'Using behavioral analysis instead of only signature matching', 'Only running on servers', 'Requiring internet connection to function'], correctIndex: 1, explanation: "EDR uses behavioral analysis — monitoring process behavior, network connections, and system changes — enabling detection of zero-day and fileless malware that evades signatures." },
      { id: 'q5-2', question: "The EternalBlue exploit was used in which major attack?", options: ['NotPetya only', 'WannaCry', 'SolarWinds', 'Heartbleed'], correctIndex: 1, explanation: "WannaCry ransomware (2017) used the EternalBlue exploit developed by the NSA — a vulnerability in Windows SMB protocol. A patch had been available for 2 months." },
      { id: 'q5-3', question: "BitLocker provides:", options: ['Firewall protection', 'Full disk encryption for Windows', 'Antivirus scanning', 'Network encryption'], correctIndex: 1, explanation: "BitLocker is Microsoft's built-in full disk encryption solution for Windows Pro and Enterprise editions." },
      { id: 'q5-4', question: "What does 'sideloading' apps mean and why is it risky?", options: ['Loading apps while using mobile data', 'Installing apps from sources outside official stores', 'Synchronizing apps between devices', 'Downloading large apps overnight'], correctIndex: 1, explanation: "Sideloading installs apps from unofficial sources, bypassing store security reviews — a primary vector for mobile malware distribution." },
      { id: 'q5-5', question: "Critical patches should ideally be applied within:", options: ['24 hours', '72 hours', '7 days', '30 days'], correctIndex: 1, explanation: "Security frameworks recommend critical patch deployment within 72 hours — the window before publicly disclosed vulnerabilities are weaponized into exploits." },
      { id: 'q5-6', question: "Remote wipe on mobile devices protects against:", options: ['Malware installed on the phone', 'Data exposure when a device is lost or stolen', 'Unauthorized app installations', 'Phishing attacks via SMS'], correctIndex: 1, explanation: "Remote wipe allows you to erase all data from a lost or stolen device remotely, preventing unauthorized access to sensitive information." },
      { id: 'q5-7', question: "FileVault is macOS's built-in:", options: ['Password manager', 'Firewall', 'Full disk encryption', 'Backup solution'], correctIndex: 2, explanation: "FileVault is Apple's built-in full disk encryption solution for macOS — essential for protecting data on MacBooks that travel or could be stolen." },
      { id: 'q5-8', question: "Host firewalls protect laptops by:", options: ['Only securing corporate network connections', 'Controlling connections regardless of the current network', 'Preventing all internet access', 'Replacing the need for antivirus'], correctIndex: 1, explanation: "Host firewalls protect the device itself — unlike network firewalls, they work regardless of whether the device is on a corporate network, home network, or public Wi-Fi." },
      { id: 'q5-9', question: "Which mobile screen lock method is LEAST secure?", options: ['Strong PIN (6+ digits)', 'Fingerprint biometric', 'Face recognition', 'Pattern swipe'], correctIndex: 3, explanation: "Pattern swipe locks are the weakest — patterns leave smudge marks on screen that can reveal the pattern, and they generally have lower complexity than PINs." },
      { id: 'q5-10', question: "Polymorphic malware evades traditional AV by:", options: ['Deleting itself after installation', 'Constantly changing its code signature', 'Only running in memory', 'Encrypting the hard drive'], correctIndex: 1, explanation: "Polymorphic malware continuously mutates its code to change its signature — each instance looks different to signature-based detection, evading traditional AV." },
      { id: 'q5-11', question: "Asset inventory is important for patch management because:", options: ['It tracks device costs', 'You cannot patch what you do not know exists', 'It speeds up patching', 'It replaces the need for antivirus'], correctIndex: 1, explanation: "You cannot secure or patch assets you are unaware of — shadow IT (unknown devices on the network) represents a significant security gap." },
      { id: 'q5-12', question: "What happens to data protected by FDE if the storage drive is removed from a laptop?", options: ['The data is deleted automatically', 'The data is readable normally', 'The data is encrypted and unreadable without the key', 'The drive becomes damaged'], correctIndex: 2, explanation: "FDE encrypts all data on the drive — removing it physically and reading it in another system yields only encrypted data that is unreadable without the encryption key." },
      { id: 'q5-13', question: "Microsoft Defender is:", options: ['A paid enterprise security solution only', 'A free, built-in capable AV solution for Windows', 'Available only for business users', 'Replaced by Windows Security Center'], correctIndex: 1, explanation: "Microsoft Defender is a built-in, free, and increasingly capable antivirus and security solution that comes with all Windows 10/11 installations." },
      { id: 'q5-14', question: "Jailbreaking or rooting a smartphone:", options: ['Improves security by removing restrictions', 'Removes OS security restrictions, increasing attack surface significantly', 'Is supported by Apple and Google', 'Improves device performance safely'], correctIndex: 1, explanation: "Rooting/jailbreaking removes OS security restrictions — bypassing app sandboxing, disabling security features, and significantly increasing the attack surface." },
      { id: 'q5-15', question: "App permissions on mobile devices should be:", options: ['Always allowed to ensure full functionality', 'Reviewed and revoked if not needed for the app\'s core function', 'Granted only to paid apps', 'Set once and never changed'], correctIndex: 1, explanation: "App permissions should follow least privilege — grant only what the app genuinely needs. A flashlight app does not need access to contacts or location." },
    ],
    activities: {
      dragAndDrop: {
        title: "Security Controls to Threats",
        description: "Match each security control to the threat it primarily addresses.",
        items: ["Antivirus/EDR", "Patch Management", "Full Disk Encryption", "Host Firewall", "Remote Wipe", "App Store Only Policy"],
        categories: ["Data in Transit Protection", "Known Malware", "Physical Device Theft", "Sideloaded Malware"]
      },
      matchFollowing: {
        title: "Device Security Terms",
        pairs: [
          { term: "EDR", definition: "Endpoint Detection and Response — behavioral threat monitoring" },
          { term: "BitLocker", definition: "Windows built-in full disk encryption" },
          { term: "EternalBlue", definition: "NSA exploit used in WannaCry ransomware" },
          { term: "Sideloading", definition: "Installing apps outside official app stores" },
          { term: "Polymorphic malware", definition: "Malware that changes its code to evade signatures" },
        ]
      },
      scenario: {
        title: "The Update Reminder",
        situation: "Your laptop shows a notification: 'Critical Security Update Available — Restart required. This update addresses 3 actively exploited vulnerabilities.' You are in the middle of an important project with 2 hours left. What do you do?",
        choices: [
          { text: "Click 'Remind me in 7 days' to avoid interruption", isCorrect: false, feedback: "Delaying critical patches is dangerous — 'actively exploited' means attackers are already using this vulnerability against real systems right now." },
          { text: "Save your work and apply the update immediately", isCorrect: true, feedback: "Correct! 'Actively exploited vulnerabilities' require immediate patching. Save your work, apply the update, and restart — your project can resume quickly." },
          { text: "Disconnect from the internet while working, then update later", isCorrect: false, feedback: "While disconnecting reduces some risk, it is not a substitute for patching. Other attack vectors (USB, files) remain active, and you will reconnect eventually." },
          { text: "Ask IT to exempt you from this update", isCorrect: false, feedback: "Actively exploited vulnerability exemptions are extremely rare and require documented business justification with compensating controls — not a valid general response." },
        ]
      }
    },
    puzzleWords: ["ENDPOINT", "RANSOMWARE", "FIREWALL", "ENCRYPTION", "PATCHING", "MOBILE", "DEFENDER", "WANNACRY"],
    newsTips: [
      { headline: "MOVEit Vulnerability Exploited Within Days of Disclosure", summary: "The Cl0p ransomware gang exploited the MOVEit file transfer vulnerability within 24 hours of disclosure, affecting hundreds of organizations.", source: "Bleeping Computer", severity: 'high' },
      { headline: "Apple Releases Emergency Zero-Day Patches", summary: "Apple issues emergency security updates addressing three zero-day vulnerabilities actively exploited against iPhone and Mac users — update immediately.", source: "Apple Security", severity: 'high' },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 6: Network Security
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 6,
    title: "Network Security",
    subtitle: "Securing Your Digital Highway",
    description: "Understand Wi-Fi security protocols, VPN usage, risks of public networks, and how to configure secure network environments.",
    estimatedTime: "35 min",
    icon: "📡",
    color: "orange",
    xpReward: 220,
    content: [
      { title: "Wi-Fi Security Protocols", body: "Wi-Fi encryption protocols protect wireless communications from eavesdropping:\n\n**WEP (Wired Equivalent Privacy):** Completely broken. Crackable in seconds with freely available tools. Never use.\n**WPA (Wi-Fi Protected Access):** Significantly better than WEP but has known vulnerabilities.\n**WPA2:** Standard for years; vulnerable to KRACK attack when improperly implemented.\n**WPA3:** Current gold standard. Provides stronger encryption (192-bit for enterprise), protection against offline dictionary attacks, and perfect forward secrecy.\n\nFor home networks: use WPA3 if your router supports it, or WPA2-AES as minimum.", type: 'normal' },
      { title: "VPN: Virtual Private Networks", body: "A VPN creates an encrypted tunnel between your device and a VPN server, masking your traffic from your ISP and anyone on the local network. \n\n**What VPNs protect against:**\n• Eavesdropping on public or shared networks\n• ISP monitoring of your browsing activity\n• Exposing your real IP address to websites\n\n**What VPNs do NOT protect against:**\n• Malware on your device\n• Phishing attacks\n• Websites you choose to log into (they still see your activity)\n\n**Protocol choice:** WireGuard is the modern standard — faster and more secure than older OpenVPN and L2TP/IPSec. Avoid PPTP entirely.", type: 'normal' },
      { title: "⚠️ Public Network Dangers", body: "Public Wi-Fi networks (airports, hotels, cafes) are fundamentally untrusted environments:\n\n**Evil Twin attacks:** Attackers create a fake access point with the same SSID as the legitimate network (e.g., 'Airport_WiFi'). Devices auto-connect, routing all traffic through the attacker.\n\n**Passive sniffing:** On unencrypted networks, all traffic is visible to anyone with a wireless adapter in monitor mode.\n\n**Man-in-the-Middle (MitM):** Attacker positions between you and the access point, intercepting and potentially modifying traffic.\n\n**Rule:** Never access sensitive services (banking, work) on public Wi-Fi without a VPN.", type: 'warning' },
      { title: "Secure Network Configuration", body: "Home and small office network security:\n\n**Change default credentials:** Router admin accounts often use admin/admin or admin/password — change immediately on setup.\n**Guest network:** Create a separate guest Wi-Fi network for visitors and IoT devices, isolated from your main network.\n**DNS:** Use encrypted DNS (DNS-over-HTTPS or DNS-over-TLS) with reputable providers (1.1.1.1, 9.9.9.9) to prevent DNS poisoning.\n**Firmware updates:** Router firmware contains security patches — update regularly.\n**Disable WPS:** Wi-Fi Protected Setup (WPS) has a known brute-force vulnerability — disable it.\n**MAC filtering:** A minor additional control — adds slight friction but not a reliable security measure alone.", type: 'normal' },
      { title: "DNS Security and Poisoning", body: "DNS (Domain Name System) translates domain names to IP addresses. DNS poisoning (cache poisoning) corrupts DNS records to redirect users to malicious servers even when they type the correct URL.\n\n**DNSSEC** cryptographically signs DNS records, allowing resolvers to verify their authenticity. **DNS-over-HTTPS (DoH)** encrypts DNS queries, preventing eavesdropping on what websites you visit.\n\nUsing Cloudflare (1.1.1.1) or Quad9 (9.9.9.9) as DNS resolvers provides better privacy and malicious domain blocking.", type: 'normal' },
      { title: "💡 Network Segmentation", body: "Network segmentation divides a network into separate zones, limiting lateral movement if one zone is compromised.\n\nIn a home network: put IoT devices (smart TVs, cameras, thermostats) on a separate VLAN or guest network, isolated from computers containing sensitive data.\n\nIn organizations: the principle applies more rigorously — finance systems, HR databases, and production servers should reside in separately controlled network zones.", type: 'tip' }
    ],
    videos: [
      { id: 'ch6-v1', title: 'Wi-Fi Security Protocols Explained', youtubeId: 'sNhhvQGsMEc', level: 'Beginner', duration: '9:20' },
      { id: 'ch6-v2', title: 'How VPNs Work', youtubeId: 'gUI7eEUYKvk', level: 'Beginner', duration: '12:00' },
      { id: 'ch6-v3', title: 'Public Wi-Fi Hacking Demonstration', youtubeId: 'e1BHDMcauPM', level: 'Expert', duration: '22:15' },
      { id: 'ch6-v4', title: 'Home Network Security Setup', youtubeId: '6uHVKSe6KoA', level: 'Practical', duration: '17:30' },
      { id: 'ch6-v5', title: 'WireGuard VPN Setup Tutorial', youtubeId: '2hZwYoJdaWQ', level: 'Practical', duration: '19:45' },
    ],
    comicPanels: [
      { id: 'p1', title: 'The Coffee Shop', description: 'Priya connects to "CafeNet" Wi-Fi and logs into work email and banking.' },
      { id: 'p2', title: 'The Evil Twin', description: 'A nearby attacker has created a fake "CafeNet" — Priya\'s device connected to the malicious one.' },
      { id: 'p3', title: 'The Capture', description: 'The attacker intercepts all of Priya\'s traffic, including session cookies and credentials.' },
      { id: 'p4', title: 'The Aftermath', description: 'The attacker uses the stolen session tokens to access Priya\'s accounts without needing her password.' },
      { id: 'p5', title: 'The Solution', description: 'With a VPN, all traffic is encrypted — even on the evil twin, the attacker sees only encrypted data.' },
    ],
    comicQuiz: [
      { id: 'cq6-1', question: "What type of attack did Priya fall victim to?", options: ['DNS poisoning', 'Evil twin Wi-Fi attack', 'Brute force attack', 'SQL injection'], correctIndex: 1, explanation: "An evil twin attack creates a fake access point mimicking a legitimate one — devices auto-connect, routing all traffic through the attacker." },
      { id: 'cq6-2', question: "How did the attacker access Priya's accounts without her password?", options: ['By resetting her password', 'By using stolen session cookies', 'By brute forcing the password', 'By intercepting the MFA code'], correctIndex: 1, explanation: "Session cookies authenticate the browser session — stealing them allows an attacker to replay the session, bypassing password authentication entirely." },
      { id: 'cq6-3', question: "What would have protected Priya from the attack?", options: ['Using a stronger Wi-Fi password', 'Using a VPN on public Wi-Fi', 'Clearing browser cookies', 'Using HTTPS websites'], correctIndex: 1, explanation: "A VPN encrypts all traffic — even if intercepted by an evil twin, the attacker sees only encrypted data they cannot read." },
      { id: 'cq6-4', question: "Evil twin attacks are effective because:", options: ['They crack Wi-Fi passwords', 'Devices auto-connect to SSIDs matching previously connected networks', 'They disable the legitimate access point', 'They require physical access to routers'], correctIndex: 1, explanation: "Devices have 'trusted network' lists and auto-connect to any access point broadcasting a known SSID — attackers exploit this by cloning legitimate network names." },
      { id: 'cq6-5', question: "Which modern VPN protocol is the recommended choice?", options: ['PPTP', 'L2TP/IPSec', 'OpenVPN', 'WireGuard'], correctIndex: 3, explanation: "WireGuard is the modern VPN protocol standard — faster, more secure cryptography, and simpler codebase (reducing attack surface) than older alternatives." },
    ],
    chapterQuiz: [
      { id: 'q6-1', question: "WEP Wi-Fi security should:", options: ['Be used for home networks only', 'Be used as a backup to WPA3', 'Never be used — it is completely broken', 'Be used for IoT devices'], correctIndex: 2, explanation: "WEP (Wired Equivalent Privacy) is completely broken — it can be cracked in seconds using freely available tools. Never use it." },
      { id: 'q6-2', question: "WPA3 improves over WPA2 by providing:", options: ['Slower but more secure connections', '192-bit encryption for enterprise and protection against offline dictionary attacks', 'Compatibility with older devices', 'Simpler password requirements'], correctIndex: 1, explanation: "WPA3 provides 192-bit encryption in enterprise mode, protection against offline brute force attacks via SAE (Simultaneous Authentication of Equals), and perfect forward secrecy." },
      { id: 'q6-3', question: "A VPN does NOT protect against:", options: ['ISP monitoring', 'Eavesdropping on local network', 'Malware on your device', 'Evil twin attacks'], correctIndex: 2, explanation: "VPNs protect traffic in transit — they cannot protect against malware already installed on your device, which can capture data before it enters the encrypted tunnel." },
      { id: 'q6-4', question: "DNS-over-HTTPS (DoH) provides:", options: ['Faster DNS resolution', 'Encrypted DNS queries preventing eavesdropping on browsing destinations', 'Automatic malware blocking', 'VPN functionality'], correctIndex: 1, explanation: "DoH encrypts DNS queries — without it, your ISP and anyone on the network can see every domain you resolve (i.e., every website you visit)." },
      { id: 'q6-5', question: "Why should IoT devices be on a separate network segment?", options: ['They consume too much bandwidth', 'They often have weak security — isolation prevents them from being a path to sensitive systems', 'They are incompatible with security tools', 'To improve their performance'], correctIndex: 1, explanation: "IoT devices (smart TVs, cameras) frequently have poor security. Isolating them on a separate segment prevents a compromised IoT device from being used to attack computers with sensitive data." },
      { id: 'q6-6', question: "WPS (Wi-Fi Protected Setup) should be disabled because:", options: ['It slows down connections', 'It has a known brute-force vulnerability in the PIN authentication method', 'It is incompatible with WPA3', 'It uses too much power'], correctIndex: 1, explanation: "WPS PIN authentication has a design flaw that allows an 8-digit PIN to be brute-forced with only ~11,000 attempts — significantly reducing the security of WPS-enabled routers." },
      { id: 'q6-7', question: "Changing default router admin credentials is important because:", options: ['Default credentials are weak passwords', 'Default credentials are publicly known and used in automated attacks', 'They expire after 30 days', 'Router manufacturers require it'], correctIndex: 1, explanation: "Default router credentials (admin/admin, admin/password) are publicly documented for every router model — automated bots scan for them constantly." },
      { id: 'q6-8', question: "Session cookie theft allows attackers to:", options: ['Change your password', 'Access accounts without needing the password', 'Install malware remotely', 'Intercept future communications'], correctIndex: 1, explanation: "Session cookies authenticate browser sessions — an attacker who steals them can replay the session token in their own browser, accessing the account without knowing the password." },
      { id: 'q6-9', question: "PPTP VPN protocol should be:", options: ['Used for maximum speed', 'Used for home networks only', 'Avoided — it has known vulnerabilities', 'Used as the default VPN protocol'], correctIndex: 2, explanation: "PPTP (Point-to-Point Tunneling Protocol) uses outdated encryption (MS-CHAPv2) that has been compromised — it should never be used for security-sensitive purposes." },
      { id: 'q6-10', question: "Quad9 (9.9.9.9) provides what additional security benefit beyond regular DNS?", options: ['Faster resolution only', 'Blocks resolution of known malicious domains', 'Provides VPN functionality', 'Encrypts all traffic'], correctIndex: 1, explanation: "Quad9 blocks DNS resolution for known malicious domains — preventing connections to phishing sites, malware C2 servers, and other threats even if you accidentally click a malicious link." },
      { id: 'q6-11', question: "Man-in-the-Middle (MitM) attacks on Wi-Fi involve:", options: ['Breaking encryption directly', 'Positioning between the user and access point to intercept traffic', 'Installing malware on the router', 'Sending fake deauthentication packets'], correctIndex: 1, explanation: "MitM attacks position the attacker as an invisible intermediary between the victim and the network, allowing interception, reading, and potential modification of traffic." },
      { id: 'q6-12', question: "A guest Wi-Fi network provides:", options: ['Faster speeds for guests', 'Isolation from the main network, protecting internal devices', 'Better range for guest devices', 'Free internet without data limits'], correctIndex: 1, explanation: "Guest networks are isolated from the main network — visitors (or compromised IoT devices) on the guest network cannot reach internal devices, services, or NAS storage." },
      { id: 'q6-13', question: "MAC address filtering as a security control is:", options: ['Highly effective and recommended as primary defence', 'A minor additional friction, not reliable alone', 'Impossible to bypass', 'Standard requirement for WPA3'], correctIndex: 1, explanation: "MAC addresses are trivially spoofed — an attacker can monitor legitimate MAC addresses and change their adapter's MAC to match. MAC filtering adds minor friction, not real security." },
      { id: 'q6-14', question: "DNSSEC protects against DNS cache poisoning by:", options: ['Encrypting DNS queries', 'Cryptographically signing DNS records to verify authenticity', 'Filtering malicious domains', 'Using alternative DNS servers'], correctIndex: 1, explanation: "DNSSEC cryptographically signs DNS records — resolvers can verify the signature to ensure records have not been tampered with or poisoned." },
      { id: 'q6-15', question: "Network segmentation primarily helps defend against:", options: ['Initial compromise', 'Lateral movement after initial compromise', 'Encrypted communications', 'Password attacks'], correctIndex: 1, explanation: "Network segmentation limits the blast radius of a compromise — an attacker who gains access to one segment cannot freely move laterally to other network zones." },
    ],
    activities: {
      dragAndDrop: {
        title: "Wi-Fi Security Protocol Ranking",
        description: "Order these Wi-Fi protocols from most secure to least secure.",
        items: ["WPA3", "WPA2-AES", "WPA-TKIP", "WEP"],
        categories: ["Most Secure", "Less Secure"]
      },
      matchFollowing: {
        title: "Network Security Terms",
        pairs: [
          { term: "Evil Twin", definition: "Fake access point mimicking a legitimate network" },
          { term: "WireGuard", definition: "Modern, secure VPN protocol" },
          { term: "DNS poisoning", definition: "Corrupting DNS records to redirect to malicious servers" },
          { term: "Network segmentation", definition: "Dividing a network to limit lateral movement" },
          { term: "DNSSEC", definition: "Cryptographic signing of DNS records" },
        ]
      },
      scenario: {
        title: "Hotel Wi-Fi Decision",
        situation: "You are traveling for business and staying at a hotel. You need to review confidential financial reports and send them to your manager tonight. The hotel provides free Wi-Fi. What is the correct approach?",
        choices: [
          { text: "Connect to hotel Wi-Fi and work normally — hotels are secure environments", isCorrect: false, feedback: "Hotel networks are shared, public networks. You have no control over who is on the network or whether the access point is legitimate." },
          { text: "Connect to hotel Wi-Fi only through your company VPN", isCorrect: true, feedback: "Correct! A VPN encrypts all traffic — even if the hotel network is compromised or you connect to an evil twin, your confidential data remains encrypted and unreadable." },
          { text: "Use your hotel room's ethernet port instead — wired is safer", isCorrect: false, feedback: "Hotel ethernet is still an untrusted network you do not control. A VPN is required regardless of whether you use Wi-Fi or ethernet in a hotel." },
          { text: "Wait until you return to the office", isCorrect: false, feedback: "While the safest theoretical option, a company VPN makes remote work from untrusted networks safe — waiting until office return is unnecessarily restrictive if VPN is available." },
        ]
      }
    },
    puzzleWords: ["WIREGUARD", "FIREWALL", "SEGMENT", "PROTOCOL", "ENCRYPTION", "DNSOVER", "VPNTUNNEL", "EVILTWN"],
    newsTips: [
      { headline: "Hotel Wi-Fi Hacking Campaign Targets Business Travelers", summary: "APT group DarkHotel documented conducting targeted attacks against hotel Wi-Fi networks to compromise business executives during travel.", source: "Kaspersky Threat Intelligence", severity: 'high' },
      { headline: "WPA2 KRACK Vulnerability Affects Billions of Devices", summary: "The KRACK attack demonstrates a fundamental flaw in the WPA2 handshake process — update device firmware and use WPA3 where available.", source: "CERT/CC", severity: 'medium' },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 7: Data Protection
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 7,
    title: "Data Protection",
    subtitle: "Safeguarding What Matters Most",
    description: "Learn encryption, backup strategies, cloud security, data privacy principles, and secure data sharing practices.",
    estimatedTime: "42 min",
    icon: "🗄️",
    color: "teal",
    xpReward: 220,
    content: [
      { title: "Why Data Protection Is Critical", body: "Data is the primary target of most cyberattacks — whether for financial gain (selling PII on dark markets), competitive advantage (IP theft), or leverage (ransomware). Data breaches have immediate and long-term consequences: regulatory fines (GDPR up to 4% of annual global turnover), legal liability, reputational damage, and operational disruption.\n\nData protection requires addressing three states of data: data at rest (stored), data in transit (transmitted), and data in use (processed).", type: 'normal' },
      { title: "Encryption Fundamentals", body: "Encryption transforms readable data (plaintext) into unreadable ciphertext using a cryptographic algorithm and key. Only those with the correct key can decrypt it.\n\n**Symmetric encryption:** The same key encrypts and decrypts. AES-256 is the gold standard for data at rest (fast, secure).\n**Asymmetric encryption:** A public key encrypts; only the corresponding private key decrypts. RSA and ECC are common — used for key exchange and digital signatures.\n**End-to-end encryption (E2EE):** Only communicating users can read messages — the service provider has no access. Signal protocol is the benchmark.\n\n**Encryption in practice:** HTTPS (TLS), full disk encryption, encrypted backups, encrypted email (S/MIME, PGP).", type: 'normal' },
      { title: "Backup Strategy: The 3-2-1-1-0 Rule", body: "The classic 3-2-1 backup rule (3 copies, 2 different media types, 1 offsite) has been enhanced:\n\n**3-2-1-1-0:** 3 copies, 2 different media, 1 offsite, 1 air-gapped/offline (disconnected from network), 0 errors (verified backups).\n\nThe air-gapped copy is specifically designed to survive ransomware attacks — ransomware often targets connected backup solutions. An offline backup physically cannot be encrypted remotely.\n\nBackup verification is as critical as creating backups: regularly test restoration from backups. Unverified backups that fail during a real incident are worthless.", type: 'normal' },
      { title: "Cloud Security", body: "Cloud storage (Google Drive, OneDrive, Dropbox, AWS S3) introduces shared responsibility: the provider secures the infrastructure; you are responsible for access control, data classification, and sharing settings.\n\n**Common cloud security failures:**\n• S3 buckets left publicly accessible (a recurring breach pattern)\n• Sharing links with 'anyone with the link' for sensitive documents\n• Not enabling MFA on cloud accounts\n• Third-party app integrations with excessive permissions\n\n**Best practices:** Review sharing permissions quarterly, use MFA on all cloud accounts, encrypt sensitive files before uploading (client-side encryption), and understand your cloud provider's retention and deletion policies.", type: 'normal' },
      { title: "Data Privacy Regulations", body: "Key regulations governing data protection globally:\n\n**GDPR (EU):** Strict requirements for processing personal data of EU residents. Right to erasure, data minimization, breach notification within 72 hours. Fines up to €20M or 4% global turnover.\n\n**CCPA (California):** Consumer rights to know, delete, and opt-out of data sale.\n\n**HIPAA (US Healthcare):** Strict requirements for Protected Health Information (PHI) security and privacy.\n\n**ISO 27001:** International standard for information security management systems (ISMS).\n\nOrganizations must understand which regulations apply to them and implement appropriate controls.", type: 'normal' },
      { title: "💡 Secure Data Sharing", body: "Best practices for sharing sensitive data:\n\n• Use end-to-end encrypted channels for sensitive communications (Signal, ProtonMail)\n• Apply time-limited sharing links that expire automatically\n• Use password-protected archives for sensitive file transfers\n• Verify recipient identity before sharing sensitive data\n• Follow the principle of data minimization: share only what the recipient genuinely needs\n• Audit who has access to shared resources and revoke stale permissions", type: 'tip' }
    ],
    videos: [
      { id: 'ch7-v1', title: 'Encryption Explained Simply', youtubeId: 'AQDCe585Lnc', level: 'Beginner', duration: '10:45' },
      { id: 'ch7-v2', title: 'Backup Strategies Every Person Needs', youtubeId: '0Vy_WCCqfLI', level: 'Beginner', duration: '13:20' },
      { id: 'ch7-v3', title: 'AWS S3 Security and Data Leaks', youtubeId: 'SiGMCPBKVhg', level: 'Expert', duration: '20:10' },
      { id: 'ch7-v4', title: 'GDPR Explained for Non-Lawyers', youtubeId: 'j6yNHB4ENUI', level: 'Expert', duration: '17:00' },
      { id: 'ch7-v5', title: 'Encrypting Files Before Cloud Upload', youtubeId: 'ZMFBLJrMUqI', level: 'Practical', duration: '15:30' },
    ],
    comicPanels: [
      { id: 'p1', title: 'The Cloud Upload', description: 'Dev accidentally sets an S3 bucket with confidential customer data to "Public" while testing.' },
      { id: 'p2', title: 'The Scanner', description: 'An automated tool scanning the internet for open S3 buckets finds it within 3 hours.' },
      { id: 'p3', title: 'The Download', description: 'The attacker downloads the entire database of 50,000 customer records.' },
      { id: 'p4', title: 'The Notification', description: 'Dev receives a notification: "Your S3 bucket has public access." It is too late.' },
      { id: 'p5', title: 'The Lesson', description: 'Default-deny access, quarterly permission audits, and alerts for public access prevent this.' },
    ],
    comicQuiz: [
      { id: 'cq7-1', question: "What misconfiguration caused the data breach in the comic?", options: ['Weak password on the S3 bucket', 'S3 bucket set to publicly accessible', 'Unencrypted files in the bucket', 'No MFA on the AWS account'], correctIndex: 1, explanation: "Public S3 bucket misconfigurations are one of the most common cloud security failures — automated scanners find them within hours of exposure." },
      { id: 'cq7-2', question: "How quickly did the attacker find the exposed bucket?", options: ['Immediately', 'Within 3 hours', 'Within 24 hours', 'Within a week'], correctIndex: 1, explanation: "Automated scanning tools continuously probe the internet for misconfigurations — an exposed S3 bucket can be found and accessed within hours." },
      { id: 'cq7-3', question: "Which control would have BEST prevented this breach?", options: ['Strong encryption of files', 'Default-deny access policy and no public access enabled', 'Antivirus on the server', 'VPN for accessing the bucket'], correctIndex: 1, explanation: "A default-deny access policy ensures S3 buckets are private by default — public access would require explicit, deliberate configuration." },
      { id: 'cq7-4', question: "Under GDPR, a 50,000 customer record breach must be reported within:", options: ['24 hours', '48 hours', '72 hours', '7 days'], correctIndex: 2, explanation: "GDPR requires notification to the supervisory authority within 72 hours of discovering a personal data breach — affecting individuals must also be notified without undue delay." },
      { id: 'cq7-5', question: "Client-side encryption before uploading to cloud means:", options: ['The cloud provider encrypts files automatically', 'Files are encrypted on your device before transfer — provider cannot read them', 'Encryption only applies during upload', 'Files are encrypted after upload by a third party'], correctIndex: 1, explanation: "Client-side encryption encrypts data before it leaves your device — the cloud provider stores only ciphertext they cannot decrypt, protecting data even if their systems are compromised." },
    ],
    chapterQuiz: [
      { id: 'q7-1', question: "AES-256 is primarily used for:", options: ['Key exchange', 'Data at rest encryption', 'Authentication', 'Digital signatures'], correctIndex: 1, explanation: "AES-256 (Advanced Encryption Standard, 256-bit key) is the gold standard symmetric encryption algorithm for data at rest — used in full disk encryption, database encryption, and secure archives." },
      { id: 'q7-2', question: "The '0' in the 3-2-1-1-0 backup rule means:", options: ['Zero cost backups', 'Zero errors — all backups verified through tested restoration', 'Zero internet-connected backups', 'Zero gaps in backup schedule'], correctIndex: 1, explanation: "The '0' represents zero errors — backups are only valuable if they work. Regular restoration testing verifies backup integrity and the recovery process." },
      { id: 'q7-3', question: "End-to-end encryption means:", options: ['Encryption between ISPs', 'Only communicating users can read messages — providers have no access', 'Encryption of all internet traffic', 'Military-grade encryption'], correctIndex: 1, explanation: "E2EE encrypts data on the sender's device and can only be decrypted by the intended recipient — service providers, governments, and attackers cannot access the content." },
      { id: 'q7-4', question: "An air-gapped backup is specifically designed to survive:", options: ['Physical disasters', 'Ransomware attacks', 'Insider threats', 'All types of data corruption'], correctIndex: 1, explanation: "Air-gapped backups are physically disconnected from networks — ransomware (which targets connected backup solutions) cannot remotely encrypt them." },
      { id: 'q7-5', question: "GDPR fines can reach up to:", options: ['$1 million', '€10 million or 2% of global turnover', '€20 million or 4% of annual global turnover', '€5 million flat rate'], correctIndex: 2, explanation: "GDPR maximum fines for serious infringements are €20 million or 4% of annual global turnover — whichever is higher. Lower tier fines are €10M or 2% for less serious violations." },
      { id: 'q7-6', question: "Data minimization in privacy contexts means:", options: ['Compressing data files', 'Collecting and retaining only the minimum data necessary for the stated purpose', 'Deleting all data after 30 days', 'Encrypting all collected data'], correctIndex: 1, explanation: "Data minimization is a GDPR principle: only collect data that is genuinely necessary, retain it only as long as needed, and delete it when the purpose is fulfilled." },
      { id: 'q7-7', question: "Asymmetric encryption uses:", options: ['The same key for encryption and decryption', 'A public key to encrypt, private key to decrypt', 'A password as the key', 'Two identical private keys'], correctIndex: 1, explanation: "Asymmetric (public-key) cryptography uses a key pair: the public key encrypts data that only the corresponding private key can decrypt — enabling secure key exchange without pre-sharing secrets." },
      { id: 'q7-8', question: "S3 buckets should default to:", options: ['Public access for collaboration', 'Private access — publicly accessible only when explicitly required', 'Encrypted public access', 'Access controlled by department heads'], correctIndex: 1, explanation: "Cloud storage should follow least-privilege defaults — everything private unless there is a specific, documented need for public access." },
      { id: 'q7-9', question: "HIPAA primarily protects:", options: ['Financial data', 'Protected Health Information (PHI)', 'Personal financial information', 'Government classified data'], correctIndex: 1, explanation: "HIPAA (Health Insurance Portability and Accountability Act) establishes security and privacy requirements for Protected Health Information (PHI) in the US healthcare sector." },
      { id: 'q7-10', question: "The right to erasure under GDPR means:", options: ['Organizations can delete all data freely', 'Individuals can request their personal data be deleted under certain conditions', 'All data must be erased after 1 year', 'Government can order data erasure'], correctIndex: 1, explanation: "GDPR Article 17 provides the 'right to be forgotten' — individuals can request deletion of their personal data when it is no longer necessary or consent is withdrawn." },
      { id: 'q7-11', question: "Time-limited sharing links help by:", options: ['Improving download speeds', 'Automatically expiring access after a set period, reducing stale permission risk', 'Encrypting shared files', 'Limiting file size'], correctIndex: 1, explanation: "Time-limited links automatically expire — preventing indefinite access to shared content and reducing the risk from forgotten sharing links." },
      { id: 'q7-12', question: "ISO 27001 is:", options: ['A US government mandate', 'An international standard for information security management systems', 'A cloud security certification', 'A payment card security standard'], correctIndex: 1, explanation: "ISO 27001 is the international standard for Information Security Management Systems (ISMS) — providing a framework for establishing, implementing, and improving information security." },
      { id: 'q7-13', question: "Data in transit is protected by:", options: ['AES-256 at rest encryption', 'TLS/HTTPS encryption', 'Database access controls', 'Data classification policies'], correctIndex: 1, explanation: "Data in transit (moving between systems) is protected by TLS (the protocol behind HTTPS) — encrypting data against eavesdropping during network transmission." },
      { id: 'q7-14', question: "Backup verification should include:", options: ['Checking the file size', 'Testing actual restoration from backup', 'Checking that files exist in the backup location', 'Comparing backup dates'], correctIndex: 1, explanation: "Only successful restoration tests verify that backups are actually usable. File existence and size checks cannot detect corruption, encryption, or application-level data integrity issues." },
      { id: 'q7-15', question: "Which messaging app is considered the gold standard for E2EE communications?", options: ['WhatsApp', 'Telegram', 'Signal', 'Facebook Messenger'], correctIndex: 2, explanation: "Signal uses the Signal Protocol — considered the cryptographic gold standard for E2EE messaging. Its open-source protocol is now used by WhatsApp and others, though Signal itself remains the most privacy-preserving implementation." },
    ],
    activities: {
      dragAndDrop: {
        title: "Data States and Protections",
        description: "Match each protection to the correct data state.",
        items: ["TLS/HTTPS", "AES-256 disk encryption", "Secure messaging (Signal)", "Database column encryption", "VPN tunnel", "File encryption before cloud upload"],
        categories: ["Data in Transit", "Data at Rest", "Data in Use"]
      },
      matchFollowing: {
        title: "Privacy Regulations",
        pairs: [
          { term: "GDPR", definition: "EU regulation, 72-hour breach notification, 4% turnover fines" },
          { term: "HIPAA", definition: "US healthcare data protection standard" },
          { term: "CCPA", definition: "California consumer privacy rights" },
          { term: "ISO 27001", definition: "International ISMS standard" },
          { term: "Data minimization", definition: "Collect only what is necessary for the stated purpose" },
        ]
      },
      scenario: {
        title: "The Backup Decision",
        situation: "Your organization asks you to design a backup strategy for critical customer data. A ransomware attack is the primary concern. You have cloud storage, an external hard drive, and a separate office location available. Which strategy do you recommend?",
        choices: [
          { text: "3 cloud backups on different cloud providers — more copies is better", isCorrect: false, feedback: "All cloud backups remain connected to the internet and can be targeted by ransomware that gains cloud credentials. An air-gapped, offline copy is essential." },
          { text: "Daily cloud backup + weekly external drive (stored disconnected) = 3-2-1-1-0", isCorrect: true, feedback: "Correct! Cloud backup covers offsite protection, the disconnected external drive is the air-gapped copy ransomware cannot reach, and regular restoration tests ensure 0 errors." },
          { text: "Continuous backup to cloud only — real-time protection is best", isCorrect: false, feedback: "Continuous cloud-only backup means ransomware encrypts your local files and then the backup system syncs the encrypted (useless) files to cloud, overwriting good backups." },
          { text: "Only local backups — cloud security is not trustworthy", isCorrect: false, feedback: "Local-only backups are vulnerable to physical disasters (fire, flood) and ransomware attacking the local network. An offsite/cloud copy is a critical part of a resilient strategy." },
        ]
      }
    },
    puzzleWords: ["ENCRYPTION", "BACKUP", "GDPR", "PRIVACY", "CLOUD", "AIRGAP", "RESTORE", "INTEGRITY"],
    newsTips: [
      { headline: "Toyota Data Breach: 2.15 Million Customers Affected by Misconfigured Cloud", summary: "Toyota disclosed that a cloud environment misconfiguration exposed location data of 2.15 million customers for a decade due to a publicly accessible database.", source: "Toyota Security Notice", severity: 'high' },
      { headline: "Ransomware Attackers Now Target Cloud Backups First", summary: "Analysis of ransomware incidents shows attackers now prioritize deleting or encrypting connected cloud backups before deploying ransomware — underscoring the need for air-gapped copies.", source: "Sophos Threat Report", severity: 'high' },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 8: Cyber Hygiene in Organizations
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 8,
    title: "Cyber Hygiene in Organizations",
    subtitle: "Building an Enterprise Security Culture",
    description: "Implement organizational security through policies, employee awareness, asset management, incident reporting, risk assessment, compliance, and governance.",
    estimatedTime: "50 min",
    icon: "🏢",
    color: "red",
    xpReward: 220,
    content: [
      { title: "Security Policies as the Foundation", body: "Security policies are the formal, written statements that define an organization's security requirements, responsibilities, and procedures. Without clear policies, security becomes inconsistent and difficult to enforce.\n\n**Essential policies every organization needs:**\n• Acceptable Use Policy (AUP) — defines permitted uses of organizational systems\n• Password Policy — enforces minimum length, complexity, rotation requirements\n• Remote Work Policy — defines security requirements for remote employees\n• Incident Response Policy — defines escalation procedures and communication protocols\n• Data Classification Policy — categorizes data by sensitivity and prescribes handling requirements\n• BYOD Policy (if applicable) — defines security requirements for personal devices accessing corporate resources", type: 'normal' },
      { title: "Employee Security Awareness", body: "The most sophisticated technical controls can be undermined by a single untrained employee. Security awareness programs transform employees from the weakest link into an active defense layer.\n\n**Effective program components:**\n• Mandatory annual security training with role-specific modules\n• Monthly phishing simulation campaigns with immediate feedback\n• Security awareness communications (newsletters, posters, threat advisories)\n• Clear and easy incident reporting channels\n• Positive reinforcement culture — reward reporting, do not punish mistakes\n\n**Measurable outcomes:** Track phishing click rates over time. Organizations that run consistent simulation programs typically reduce click rates by 60-87% within 12 months.", type: 'normal' },
      { title: "Asset Management", body: "You cannot protect what you do not know you have. Asset management is the foundation of effective security — maintaining an accurate inventory of all hardware, software, and data assets.\n\n**Asset inventory should include:**\n• All endpoints (laptops, desktops, servers, mobile devices)\n• Network devices (routers, switches, access points, firewalls)\n• Software and licenses (including cloud services and SaaS subscriptions)\n• Data assets and their classification\n• Third-party systems with access to organizational data\n\n**Shadow IT** (unauthorized hardware or software used by employees) represents significant risk — it is unmanaged, often unpatched, and outside security controls.", type: 'normal' },
      { title: "Incident Response and Reporting", body: "An incident response plan (IRP) defines the procedures for detecting, containing, analyzing, and recovering from security incidents. Without a plan, organizations improvise under pressure — leading to poor decisions that worsen outcomes.\n\n**The NIST Incident Response Lifecycle:**\n1. **Preparation** — Training, tools, procedures in place before incidents occur\n2. **Detection & Analysis** — Identifying and classifying the incident scope\n3. **Containment** — Isolating affected systems to prevent spread\n4. **Eradication** — Removing the threat (malware, unauthorized access)\n5. **Recovery** — Restoring systems to normal operation\n6. **Post-Incident Activity** — Lessons learned, policy updates\n\nClear, anonymous incident reporting channels are essential — employees must feel safe reporting mistakes without fear of blame.", type: 'normal' },
      { title: "Risk Assessment and Management", body: "Risk assessment systematically identifies threats, assesses their likelihood and potential impact, and prioritizes security controls accordingly.\n\n**Risk = Threat × Vulnerability × Impact**\n\n**Risk treatment options:**\n• **Mitigate:** Apply controls to reduce the risk\n• **Transfer:** Purchase cyber insurance or contractually transfer responsibility\n• **Accept:** Document and accept residual risk within defined tolerance\n• **Avoid:** Stop the risky activity entirely\n\nSecurity resources are finite — risk assessment ensures the highest-impact controls receive priority investment. A basic risk register documents identified risks, current controls, and residual risk levels.", type: 'normal' },
      { title: "Compliance and Governance Frameworks", body: "Security governance establishes the decision-making structure, accountability, and oversight for organizational security.\n\n**Key frameworks:**\n• **NIST CSF 2.0:** Govern, Identify, Protect, Detect, Respond, Recover — practical and flexible\n• **ISO 27001:** Comprehensive ISMS with certification process\n• **CIS Controls v8:** Prioritized security controls for implementation\n• **SOC 2:** Trust service criteria for service organizations\n\nGovernance includes defining security roles (CISO, security team, all employees), establishing a security committee with executive sponsorship, and integrating security into business decision-making.", type: 'normal' }
    ],
    videos: [
      { id: 'ch8-v1', title: 'Building a Security Policy Framework', youtubeId: 'Hbeis5PBjio', level: 'Beginner', duration: '11:20' },
      { id: 'ch8-v2', title: 'Security Awareness Training That Works', youtubeId: 'aO858HyFbKI', level: 'Beginner', duration: '14:00' },
      { id: 'ch8-v3', title: 'NIST Cybersecurity Framework 2.0 Deep Dive', youtubeId: '86VqD75g4hE', level: 'Expert', duration: '26:30' },
      { id: 'ch8-v4', title: 'Incident Response Planning and Execution', youtubeId: 'wxHtVPbz_-k', level: 'Expert', duration: '22:00' },
      { id: 'ch8-v5', title: 'Building a Risk Register from Scratch', youtubeId: 'j6yNHB4ENUI', level: 'Practical', duration: '18:15' },
    ],
    comicPanels: [
      { id: 'p1', title: 'The Unknown Device', description: 'An employee connects a personal Raspberry Pi to the office network without telling IT.' },
      { id: 'p2', title: 'The Open Port', description: 'The device runs an unpatched service with a known vulnerability, visible on the network.' },
      { id: 'p3', title: 'The Compromise', description: 'An attacker scanning the network finds and exploits the vulnerability to gain initial access.' },
      { id: 'p4', title: 'The Lateral Movement', description: 'Using the Raspberry Pi as a foothold, the attacker moves laterally to the domain controller.' },
      { id: 'p5', title: 'The Asset Inventory', description: 'Post-incident, IT implements network discovery tools and enforces the asset management policy.' },
    ],
    comicQuiz: [
      { id: 'cq8-1', question: "The Raspberry Pi in the comic is an example of:", options: ['An authorized security testing device', 'Shadow IT — unauthorized hardware on the corporate network', 'An IoT device properly segmented', 'A backup device'], correctIndex: 1, explanation: "Shadow IT refers to hardware or software used without IT authorization — it operates outside security controls, unmanaged, and often unpatched." },
      { id: 'cq8-2', question: "Asset management would have prevented this incident by:", options: ['Automatically patching all devices', 'Knowing all devices on the network and identifying the unauthorized one', 'Blocking all external internet access', 'Encrypting network traffic'], correctIndex: 1, explanation: "A complete asset inventory, combined with network scanning for unknown devices, would have identified the unauthorized Raspberry Pi before it could be exploited." },
      { id: 'cq8-3', question: "What stage of the NIST Incident Response lifecycle is 'isolating affected systems'?", options: ['Preparation', 'Detection', 'Containment', 'Recovery'], correctIndex: 2, explanation: "Containment involves isolating affected systems from the network to prevent the attacker from moving further laterally or exfiltrating more data." },
      { id: 'cq8-4', question: "The attacker's movement from the Raspberry Pi to the domain controller is called:", options: ['Privilege escalation', 'Lateral movement', 'Command and control', 'Persistence'], correctIndex: 1, explanation: "Lateral movement is the technique attackers use to progressively move through a network, from initial compromise toward higher-value targets like domain controllers." },
      { id: 'cq8-5', question: "A BYOD policy defines:", options: ['Backup procedures for company devices', 'Security requirements for personal devices accessing corporate resources', 'Rules for bringing food to the office', 'Internet usage policies for employees'], correctIndex: 1, explanation: "BYOD (Bring Your Own Device) policy defines the security requirements (MDM enrollment, encryption, approved apps) personal devices must meet before accessing corporate systems." },
    ],
    chapterQuiz: [
      { id: 'q8-1', question: "An Acceptable Use Policy (AUP) defines:", options: ['Encryption standards', 'Permitted uses of organizational systems and resources', 'Incident response procedures', 'Data backup requirements'], correctIndex: 1, explanation: "An AUP formally defines what employees may and may not do with organizational technology resources — establishing behavioral expectations and disciplinary consequences." },
      { id: 'q8-2', question: "Phishing simulation programs typically reduce click rates by:", options: ['10-20% in 12 months', '30-40% in 12 months', '60-87% in 12 months', '95%+ immediately'], correctIndex: 2, explanation: "Consistent phishing simulation programs with immediate feedback reduce employee click rates by 60-87% within 12 months — significantly improving the human defense layer." },
      { id: 'q8-3', question: "Shadow IT represents security risk because:", options: ['It uses too much bandwidth', 'It operates outside security controls, unmanaged and often unpatched', 'It is more expensive than corporate solutions', 'It violates software licensing'], correctIndex: 1, explanation: "Shadow IT (unauthorized hardware/software) is invisible to security teams — unpatched, unmonitored, and outside incident response capabilities." },
      { id: 'q8-4', question: "The NIST Incident Response lifecycle starts with:", options: ['Detection', 'Preparation', 'Containment', 'Recovery'], correctIndex: 1, explanation: "Preparation is the foundation of incident response — establishing plans, procedures, tools, and training before an incident occurs, enabling faster and more effective response." },
      { id: 'q8-5', question: "Risk = Threat × Vulnerability × what?", options: ['Likelihood', 'Cost', 'Impact', 'Time'], correctIndex: 2, explanation: "The classic risk formula: Risk = Threat × Vulnerability × Impact — all three components must be assessed to prioritize risk treatment effectively." },
      { id: 'q8-6', question: "Transferring risk means:", options: ['Moving risk to another department', 'Purchasing cyber insurance or contractually shifting responsibility', 'Avoiding the risky activity', 'Accepting the risk formally'], correctIndex: 1, explanation: "Risk transfer shifts the financial consequences to a third party (cyber insurance) or to another organization (contractual indemnification) rather than bearing it internally." },
      { id: 'q8-7', question: "NIST CSF 2.0 added which new function to the original 5?", options: ['Audit', 'Govern', 'Comply', 'Train'], correctIndex: 1, explanation: "NIST CSF 2.0 added 'Govern' as a 6th function alongside Identify, Protect, Detect, Respond, and Recover — recognizing that governance is foundational to all other security functions." },
      { id: 'q8-8', question: "Post-incident activity in IR primarily involves:", options: ['Rebuilding compromised systems', 'Lessons learned and policy updates to prevent recurrence', 'Notifying affected users', 'Filing insurance claims'], correctIndex: 1, explanation: "Post-incident activity captures lessons learned — analyzing what failed and why, then updating policies, procedures, and controls to prevent similar incidents." },
      { id: 'q8-9', question: "Data classification policies define:", options: ['Who owns organizational data', 'Data sensitivity categories and corresponding handling requirements', 'Backup schedules for data', 'Encryption standards for all data'], correctIndex: 1, explanation: "Data classification (e.g., Public, Internal, Confidential, Restricted) defines sensitivity levels and the security controls required for each — guiding encryption, access control, and sharing decisions." },
      { id: 'q8-10', question: "A security committee with executive sponsorship ensures:", options: ['Technical security controls are implemented correctly', 'Security has organizational visibility, funding, and authority', 'All employees are security professionals', 'Compliance with all global regulations'], correctIndex: 1, explanation: "Executive sponsorship gives security the organizational authority and budget needed to implement controls — without it, security remains an underfunded IT concern rather than a business priority." },
      { id: 'q8-11', question: "CIS Controls v8 provides:", options: ['Certification for cloud providers', 'Prioritized, actionable security controls ranked by effectiveness', 'Legal compliance framework', 'Encryption standards only'], correctIndex: 1, explanation: "CIS Controls v8 provides 18 prioritized control groups with specific implementation guidance — practical and accessible, especially for smaller organizations." },
      { id: 'q8-12', question: "Why should incident reporting channels be anonymous?", options: ['To protect IT teams from complaints', 'Employees are more likely to report mistakes without fear of punishment', 'For legal reasons only', 'To prevent duplicate reporting'], correctIndex: 1, explanation: "A 'blame-free' reporting culture is critical — if employees fear punishment for reporting mistakes, they hide them, allowing incidents to escalate undetected." },
      { id: 'q8-13', question: "SOC 2 is primarily relevant for:", options: ['Healthcare organizations', 'Financial institutions', 'Service organizations (SaaS, cloud providers) demonstrating security to customers', 'Government agencies'], correctIndex: 2, explanation: "SOC 2 (System and Organization Controls) reports verify that service organizations (cloud providers, SaaS companies) maintain adequate security, availability, and confidentiality controls." },
      { id: 'q8-14', question: "A risk register documents:", options: ['Security incidents only', 'Identified risks, current controls, and residual risk levels', 'Asset inventory', 'Employee training records'], correctIndex: 1, explanation: "A risk register is the central document for risk management — tracking identified risks, their likelihood and impact, existing controls, risk owners, and residual risk after controls are applied." },
      { id: 'q8-15', question: "Remote work policies must address:", options: ['Office furniture standards', 'Security requirements for working outside corporate premises', 'Meeting room booking procedures', 'Expense claim processes'], correctIndex: 1, explanation: "Remote work policies define security requirements for employees working from home or public locations: VPN usage, device encryption, network requirements, and handling of sensitive data." },
    ],
    activities: {
      dragAndDrop: {
        title: "Policy to Scenario",
        description: "Match each security scenario to the policy that governs it.",
        items: ["Employee using personal phone for work email", "Reporting a suspected ransomware infection", "Installing unauthorized software", "Sharing customer data with a vendor", "Password complexity requirements", "Working from a coffee shop"],
        categories: ["Acceptable Use Policy", "Incident Response Policy", "BYOD Policy", "Remote Work Policy"]
      },
      matchFollowing: {
        title: "NIST IR Lifecycle Stages",
        pairs: [
          { term: "Preparation", definition: "Plans, procedures, and tools ready before incidents" },
          { term: "Detection & Analysis", definition: "Identifying and classifying the incident" },
          { term: "Containment", definition: "Isolating affected systems to prevent spread" },
          { term: "Eradication", definition: "Removing the threat from systems" },
          { term: "Recovery", definition: "Restoring systems to normal operation" },
        ]
      },
      scenario: {
        title: "The Suspicious Activity",
        situation: "You notice your colleague's computer is behaving strangely — running very slowly, with unusual network activity shown in the task manager. Your colleague is on leave. You suspect it may be infected with malware. What do you do?",
        choices: [
          { text: "Run an antivirus scan on the computer yourself", isCorrect: false, feedback: "While well-intentioned, this could interfere with forensic evidence collection and might not remove all components of advanced malware. Follow the IR process." },
          { text: "Immediately notify IT security and disconnect the computer from the network if instructed", isCorrect: true, feedback: "Correct! Report to IT security immediately — they are trained to handle incidents properly. They may ask you to isolate the device (disconnect network cable / disable Wi-Fi) to prevent spread." },
          { text: "Restart the computer to see if it fixes itself", isCorrect: false, feedback: "Restarting may destroy volatile evidence (running processes, network connections in memory) and could trigger malware to spread or activate additional payloads." },
          { text: "Wait for your colleague to return and tell them", isCorrect: false, feedback: "Waiting allows the malware to continue operating — spreading laterally, exfiltrating data, or causing further damage. Report immediately; your colleague can be informed later." },
        ]
      }
    },
    puzzleWords: ["POLICY", "GOVERNANCE", "INCIDENT", "RISK", "AWARENESS", "COMPLIANCE", "ASSETMGMT", "SHADOWIT"],
    newsTips: [
      { headline: "Only 36% of Employees Know Their Organization's Cybersecurity Policy", summary: "Research reveals most employees are unaware of security policies — highlighting the importance of regular training and communication over annual checkbox exercises.", source: "Proofpoint State of Phish", severity: 'medium' },
      { headline: "Average Cost of Security Incident Without IR Plan: $4.86M", summary: "IBM Cost of Data Breach Report shows organizations with a tested incident response plan save an average of $1.49M compared to those without one.", source: "IBM Cost of Data Breach 2023", severity: 'high' },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 9: Cyber Hygiene Methodologies
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: "Cyber Hygiene Methodologies",
    subtitle: "Advanced Frameworks for Systemic Security",
    description: "Master advanced security methodologies including Zero Trust, Defense in Depth, Least Privilege, Continuous Monitoring, Patch Management, IAM, and Business Continuity.",
    estimatedTime: "55 min",
    icon: "⚙️",
    color: "violet",
    xpReward: 220,
    content: [
      { title: "Security Awareness Programs at Scale", body: "Enterprise security awareness programs go beyond annual compliance training. Effective programs use a layered approach: continuous micro-learning (short, focused modules), role-based training (developers receive secure coding training, executives receive BEC-specific training), gamification, and behavioral analytics to identify high-risk individuals requiring additional support.\n\nThe human risk score concept quantifies individual risk based on phishing simulation performance, policy acknowledgment history, and role-based risk factors — enabling targeted interventions.", type: 'normal' },
      { title: "Zero Trust Architecture", body: "Zero Trust is a security philosophy built on 'never trust, always verify.' Unlike traditional perimeter-based security that assumes everything inside the network is safe, Zero Trust assumes breach and verifies every access request regardless of origin.\n\n**Core Zero Trust principles:**\n• Verify explicitly — always authenticate and authorize based on all available data points\n• Use least-privilege access — limit user access rights to the minimum necessary\n• Assume breach — minimize blast radius, segment access, encrypt everything\n\n**Implementation pillars:** Identity verification (strong MFA), device health (EDR status), network segmentation (micro-segmentation), application access (ZTNA), and data classification.\n\nMicrosoft's Zero Trust framework and NIST SP 800-207 provide detailed implementation guidance.", type: 'normal' },
      { title: "Principle of Least Privilege", body: "Least privilege means every user, process, and system has only the minimum access rights necessary to perform its function — nothing more.\n\n**Practical implementation:**\n• No standing administrator access — use just-in-time (JIT) privilege elevation when elevated access is needed\n• Regular access reviews to remove stale permissions\n• Service accounts with minimal permissions scoped to specific tasks\n• Privileged Access Workstations (PAWs) for high-privilege operations\n\n**Why it matters:** Attackers who compromise a low-privilege account have limited damage potential. If the same account has domain admin rights, the entire organization is at risk.", type: 'normal' },
      { title: "Defense in Depth", body: "Defense in Depth layers multiple independent security controls so that if one fails, others continue to provide protection. No single control is assumed to be perfect.\n\n**Layered model:**\n1. Physical security — locked server rooms, badge access\n2. Network security — firewalls, IDS/IPS, network segmentation\n3. Endpoint security — EDR, disk encryption, host firewall\n4. Application security — secure coding, WAF, input validation\n5. Data security — encryption, DLP, access controls\n6. User security — awareness training, MFA, least privilege\n\nEach layer compensates for weaknesses in others — attackers must defeat all layers to succeed.", type: 'normal' },
      { title: "Continuous Monitoring and SIEM", body: "Continuous monitoring uses automated tools to collect, analyze, and alert on security events across the entire environment 24/7.\n\n**SIEM (Security Information and Event Management):** Aggregates logs from all sources (endpoints, network devices, cloud platforms, applications), applies correlation rules and ML-based anomaly detection, and generates alerts for security teams.\n\n**Key metrics (KPIs):** Mean Time to Detect (MTTD) — how quickly threats are identified. Mean Time to Respond (MTTR) — how quickly threats are contained. Organizations with mature monitoring programs achieve MTTD of hours vs. the industry average of 204 days.\n\nLog retention for forensic purposes typically requires 12-24 months of security event logs.", type: 'normal' },
      { title: "Identity and Access Management (IAM)", body: "IAM manages digital identities and controls who can access what resources under what conditions.\n\n**IAM components:**\n• **Authentication:** Verifying identity (MFA, passwordless, biometrics)\n• **Authorization:** What the verified identity is permitted to do (RBAC, ABAC)\n• **Privileged Access Management (PAM):** Controlling, monitoring, and recording privileged sessions\n• **Identity Governance and Administration (IGA):** Access reviews, certification campaigns, lifecycle management\n\n**Privileged accounts** (domain admins, root accounts, service accounts) require heightened controls — dedicated PAM solutions (CyberArk, BeyondTrust, Delinea) vault credentials and record sessions for audit.", type: 'normal' },
      { title: "Business Continuity and Resilience", body: "Business Continuity Planning (BCP) ensures an organization can continue critical operations during and after a cybersecurity incident or other disruption.\n\n**Key concepts:**\n• **RTO (Recovery Time Objective):** Maximum acceptable downtime — how quickly systems must be restored\n• **RPO (Recovery Point Objective):** Maximum acceptable data loss — how much data can be lost\n• **BCP:** Plans for maintaining critical business operations during disruption\n• **Disaster Recovery (DR):** Technical plans for restoring IT systems after a major incident\n• **Tabletop exercises:** Scenario-based discussions testing the response plan without real system impact\n\nOrganizations that regularly test their BCP/DR plans demonstrate 50% lower recovery times compared to those with untested plans.", type: 'tip' }
    ],
    videos: [
      { id: 'ch9-v1', title: 'Zero Trust Architecture Explained', youtubeId: 'OGRnhH_T7WA', level: 'Beginner', duration: '11:30' },
      { id: 'ch9-v2', title: 'Defense in Depth Explained', youtubeId: 'dUL9JL3LWFA', level: 'Beginner', duration: '9:45' },
      { id: 'ch9-v3', title: 'SIEM and Continuous Monitoring Deep Dive', youtubeId: 'r3uBtOlPdMQ', level: 'Expert', duration: '24:10' },
      { id: 'ch9-v4', title: 'Identity and Access Management (IAM) Complete Guide', youtubeId: 'bCDqUCxkMkI', level: 'Expert', duration: '28:30' },
      { id: 'ch9-v5', title: 'Building a Business Continuity Plan', youtubeId: 'P3KrVLTAKpk', level: 'Practical', duration: '20:00' },
    ],
    comicPanels: [
      { id: 'p1', title: 'The Admin Shortcut', description: 'A developer works with permanent admin rights "to save time" — a common but dangerous practice.' },
      { id: 'p2', title: 'The Compromise', description: 'The developer\'s machine gets infected with malware that inherits their admin privileges.' },
      { id: 'p3', title: 'The Takeover', description: 'With admin rights, the malware modifies security settings, disables logging, and moves laterally.' },
      { id: 'p4', title: 'The Zero Trust Response', description: 'A Zero Trust architecture detects the anomalous behavior despite valid credentials being used.' },
      { id: 'p5', title: 'JIT Privilege', description: 'Just-in-time privilege: admin rights are granted for a specific task and automatically revoked after.' },
    ],
    comicQuiz: [
      { id: 'cq9-1', question: "What dangerous security practice did the developer use?", options: ['Using a weak password', 'Working with permanent standing admin rights', 'Not using MFA', 'Using an outdated OS'], correctIndex: 1, explanation: "Standing/permanent admin rights violate least privilege — if the account is compromised, the attacker immediately has maximum access without needing to escalate privileges." },
      { id: 'cq9-2', question: "How did malware gain admin privileges in the comic?", options: ['By cracking the admin password', 'By inheriting the privileges of the compromised user account', 'By exploiting a kernel vulnerability', 'By intercepting admin credentials'], correctIndex: 1, explanation: "Malware running in the context of a privileged user account automatically inherits those privileges — this is why least privilege is critical to limit potential damage." },
      { id: 'cq9-3', question: "Zero Trust architecture detected the attack by:", options: ['Recognizing the malware signature', 'Detecting anomalous behavior even with valid credentials', 'Blocking the admin account automatically', 'Scanning all running processes'], correctIndex: 1, explanation: "Zero Trust verifies context and behavior, not just credentials — anomalous access patterns (unusual time, location, access scope) trigger additional verification or alerts." },
      { id: 'cq9-4', question: "JIT (Just-in-Time) privilege means:", options: ['Admin rights assigned permanently for efficiency', 'Elevated rights granted for a specific task and automatically revoked afterward', 'Rights approved just before incident response', 'Temporary rights for contractors only'], correctIndex: 1, explanation: "JIT privilege grants elevated access only when needed for a specific task and automatically revokes it afterward — eliminating standing privileges that attackers can exploit." },
      { id: 'cq9-5', question: "Defense in Depth responded to the developer's compromise by:", options: ['Preventing the initial infection', 'Providing multiple layers that continued to detect despite one layer failing', 'Automatically backing up all affected files', 'Restoring admin rights from backup'], correctIndex: 1, explanation: "Defense in Depth means multiple layers — even when the endpoint was compromised (one layer failed), behavioral analytics and Zero Trust (other layers) still detected the attack." },
    ],
    chapterQuiz: [
      { id: 'q9-1', question: "Zero Trust's core principle is:", options: ['Trust but verify', 'Assume all internal traffic is safe', 'Never trust, always verify', 'Block everything external'], correctIndex: 2, explanation: "Zero Trust: never trust, always verify — every access request is authenticated and authorized regardless of whether it comes from inside or outside the network perimeter." },
      { id: 'q9-2', question: "NIST SP 800-207 provides guidance on:", options: ['Password policies', 'Zero Trust Architecture', 'Incident response', 'Cryptographic standards'], correctIndex: 1, explanation: "NIST SP 800-207 is the authoritative NIST publication on Zero Trust Architecture — providing definitions, principles, and implementation considerations." },
      { id: 'q9-3', question: "MTTD stands for:", options: ['Managed Threat Testing Database', 'Mean Time to Detect', 'Maximum Threat Tolerance Duration', 'Multi-Tenant Threat Defense'], correctIndex: 1, explanation: "Mean Time to Detect (MTTD) measures the average time between a threat occurring and its detection — a key security operations KPI. Industry average is 204 days." },
      { id: 'q9-4', question: "The industry average MTTD (breach detection time) is:", options: ['24 hours', '7 days', '204 days', '30 days'], correctIndex: 2, explanation: "IBM's Cost of Data Breach Report consistently shows the industry average time to identify a breach is around 204 days — highlighting the importance of continuous monitoring." },
      { id: 'q9-5', question: "Least privilege in service accounts means:", options: ['Service accounts should have no access', 'Service accounts have permissions scoped only to what they specifically need', 'Service accounts use shared credentials', 'Service accounts are automatically admin'], correctIndex: 1, explanation: "Service accounts should have precisely the permissions needed for their function — nothing broader. Over-permissioned service accounts are a common lateral movement pathway for attackers." },
      { id: 'q9-6', question: "A Privileged Access Workstation (PAW) is:", options: ['Any computer with admin software installed', 'A hardened, isolated device used exclusively for privileged operations', 'A workstation accessible to all privileged users', 'A virtual machine for sensitive operations'], correctIndex: 1, explanation: "PAWs are hardened devices — no browsing, no email, dedicated to privileged operations — ensuring that admin credentials are entered only on secure, controlled devices." },
      { id: 'q9-7', question: "RTO (Recovery Time Objective) defines:", options: ['Maximum acceptable data loss', 'Maximum acceptable downtime for systems to be restored', 'Backup retention period', 'Security audit frequency'], correctIndex: 1, explanation: "RTO is the maximum time a system can be down after a disruption before the business impact becomes unacceptable — it drives design decisions for recovery infrastructure." },
      { id: 'q9-8', question: "RPO (Recovery Point Objective) defines:", options: ['Maximum acceptable downtime', 'Maximum acceptable data loss measured in time', 'Recovery testing frequency', 'Number of backup copies required'], correctIndex: 1, explanation: "RPO defines how much data loss is acceptable — measured in time. An RPO of 4 hours means the organization can accept losing at most 4 hours of data." },
      { id: 'q9-9', question: "SIEM stands for:", options: ['Security Incident Emergency Management', 'Security Information and Event Management', 'System Integration and Event Monitoring', 'Secure Infrastructure Event Management'], correctIndex: 1, explanation: "SIEM (Security Information and Event Management) aggregates security logs from across the environment, applying correlation rules and analytics to detect threats." },
      { id: 'q9-10', question: "Defense in Depth addresses the assumption that:", options: ['All security controls are perfect', 'No single control is perfect — layers compensate for each other\'s weaknesses', 'Physical security is the most important layer', 'Perimeter security is sufficient'], correctIndex: 1, explanation: "Defense in Depth acknowledges no control is infallible — layering independent controls means attackers must defeat multiple layers, and failure of one does not equal total compromise." },
      { id: 'q9-11', question: "A tabletop exercise is:", options: ['A physical security drill', 'A scenario-based discussion testing IR plans without real system impact', 'A penetration testing technique', 'A compliance audit methodology'], correctIndex: 1, explanation: "Tabletop exercises walk through hypothetical incident scenarios — testing team decisions, communication, and plan completeness without disrupting real systems." },
      { id: 'q9-12', question: "IAM's Authorization component controls:", options: ['Who you are (identity verification)', 'What a verified identity is permitted to do', 'When users can access systems', 'Where users can access from'], correctIndex: 1, explanation: "Authorization (what you can do) is distinct from Authentication (who you are) — IAM manages both, ensuring verified identities only access what they are permitted to." },
      { id: 'q9-13', question: "Log retention for security forensics typically requires:", options: ['30 days', '90 days', '12-24 months', '5 years'], correctIndex: 2, explanation: "Security events must be retained 12-24 months for forensic investigation — breaches are often discovered months after initial compromise, requiring historical logs to reconstruct attack timelines." },
      { id: 'q9-14', question: "RBAC (Role-Based Access Control) grants access based on:", options: ['Individual user requests', 'The user\'s organizational role and associated permissions', 'Time of access request', 'Network location of the user'], correctIndex: 1, explanation: "RBAC assigns permissions to roles (e.g., HR Manager, Developer, Finance Analyst) rather than individuals — users inherit permissions based on their role assignment." },
      { id: 'q9-15', question: "Organizations with tested BCP/DR plans demonstrate:", options: ['100% prevention of incidents', '50% lower recovery times compared to untested plans', 'Zero data loss during incidents', 'Immunity from regulatory fines'], correctIndex: 1, explanation: "Research shows organizations that regularly test and practice their BC/DR plans recover 50% faster than those with undocumented or untested plans — testing surfaces gaps before real incidents do." },
    ],
    activities: {
      dragAndDrop: {
        title: "Zero Trust Pillars",
        description: "Assign each control to the Zero Trust pillar it primarily addresses.",
        items: ["MFA and passwordless auth", "EDR with behavioral detection", "Micro-segmentation", "CASB for SaaS access", "Data classification and DLP", "RBAC and least privilege"],
        categories: ["Identity", "Device", "Network", "Application", "Data"]
      },
      matchFollowing: {
        title: "Methodology Terms",
        pairs: [
          { term: "RTO", definition: "Maximum acceptable system downtime" },
          { term: "RPO", definition: "Maximum acceptable data loss in time" },
          { term: "PAM", definition: "Privileged Access Management — controlling high-privilege accounts" },
          { term: "MTTD", definition: "Mean Time to Detect — speed of threat identification" },
          { term: "JIT Privilege", definition: "Access granted for specific task, auto-revoked after" },
        ]
      },
      scenario: {
        title: "The Developer Request",
        situation: "A developer requests permanent local administrator rights on their workstation, saying it will make them more productive and save time requesting approval each time they need to install a development tool. What is the correct response?",
        choices: [
          { text: "Grant permanent admin rights — developer productivity is important", isCorrect: false, feedback: "Permanent admin rights violate least privilege and significantly increase risk if the developer's account is compromised — the malware or attacker inherits full admin access." },
          { text: "Implement JIT (Just-in-Time) privilege — temporary admin access for specific approved tasks", isCorrect: true, feedback: "Correct! JIT privilege balances developer productivity with security — temporary admin rights are granted when needed and automatically revoked, eliminating standing privilege risk." },
          { text: "Create a separate admin account they can switch to when needed", isCorrect: false, feedback: "Better than standing rights on the main account, but this is still standing privilege. JIT with approval workflow is more secure and provides an audit trail." },
          { text: "Deny all admin requests — developers should never have admin access", isCorrect: false, feedback: "Blanket denial is impractical and forces workarounds that may be worse from a security perspective. JIT with appropriate approval workflow provides security without blocking legitimate needs." },
        ]
      }
    },
    puzzleWords: ["ZEROTRUST", "LEASTPRIV", "DEFNSE", "CONTINUITY", "SIEM", "IDENTITY", "RECOVERY", "TABLETOP"],
    newsTips: [
      { headline: "Gartner: 10% of Large Enterprises Will Have Zero Trust by 2026", summary: "Zero Trust adoption is accelerating, driven by hybrid work, cloud migration, and the limitations of perimeter-based security exposed by recent breaches.", source: "Gartner Research", severity: 'low' },
      { headline: "Organizations With JIT Privilege See 80% Fewer Lateral Movement Incidents", summary: "Research by CyberArk demonstrates that removing standing privileged access dramatically reduces attacker dwell time and lateral movement success rates.", source: "CyberArk Global Advanced Threat Landscape Report", severity: 'medium' },
    ]
  },
]

export function getChapterById(id: number): Chapter | undefined {
  return chapters.find(c => c.id === id)
}

export function getTotalChapters(): number {
  return chapters.length
}

export const TOTAL_COURSE_XP = chapters.reduce((sum, c) => sum + c.xpReward, 0)

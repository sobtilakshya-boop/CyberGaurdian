export interface ContentBlock {
  type: 'text' | 'video' | 'comic' | 'quiz' | 'activity' | 'puzzle' | 'news';
  title?: string;
  content?: string;
  videoUrl?: string;
  imageSrc?: string;
  questions?: QuizQuestion[];
  items?: string[];
  newsItems?: NewsItem[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  date: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  locked: boolean;
  content: ContentBlock[];
  completionXp: number;
  estimatedTime: number; // in minutes
}

export const cyberHygieneChapters: Chapter[] = [
  {
    id: '1',
    title: 'Introduction to Cyber Hygiene',
    description: 'Learn the fundamentals of digital safety and why cyber hygiene matters',
    order: 1,
    locked: false,
    completionXp: 100,
    estimatedTime: 12,
    content: [
      {
        type: 'text',
        title: 'What is Cyber Hygiene?',
        content: `Cyber hygiene refers to the practice of maintaining your digital well-being and security. Just like personal hygiene helps prevent physical illness, cyber hygiene helps protect your digital life from threats and vulnerabilities.

Key principles of cyber hygiene include:
• Keeping software updated
• Using strong, unique passwords
• Being cautious of suspicious emails
• Regular backups of important data
• Safe browsing habits`,
      },
      {
        type: 'video',
        title: 'The Importance of Cyber Hygiene',
        videoUrl: 'https://www.youtube.com/embed/jh-hMiSKdVc',
      },
      {
        type: 'text',
        title: 'Why It Matters',
        content: `Cyber attacks are becoming increasingly sophisticated. In 2024, businesses lose billions due to data breaches and cyber crimes. By practicing good cyber hygiene, you significantly reduce your risk of becoming a victim.

Statistics show that:
- 88% of data breaches are caused by human error
- A new phishing attack occurs every 4.5 seconds
- The average cost of a data breach is $4.45 million`,
      },
      {
        type: 'quiz',
        title: 'Chapter 1 Quiz',
        questions: [
          {
            id: 'q1',
            question: 'What is cyber hygiene primarily about?',
            options: [
              'Cleaning your computer physically',
              'Maintaining digital security and safety practices',
              'Using antivirus software only',
              'Having a strong password',
            ],
            correctAnswer: 1,
            explanation:
              'Cyber hygiene is about maintaining digital security and safety practices, not just physical cleaning or single solutions.',
          },
          {
            id: 'q2',
            question: 'According to the statistics mentioned, what percentage of data breaches are caused by human error?',
            options: ['78%', '88%', '95%', '68%'],
            correctAnswer: 1,
            explanation: '88% of data breaches are caused by human error, making it the most critical factor to address.',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Password Security Mastery',
    description: 'Master the art of creating and managing strong, secure passwords',
    order: 2,
    locked: true,
    completionXp: 150,
    estimatedTime: 15,
    content: [
      {
        type: 'text',
        title: 'Creating Strong Passwords',
        content: `A strong password is your first line of defense. A good password should:
• Be at least 12-16 characters long
• Include uppercase and lowercase letters
• Include numbers and special characters
• Not contain personal information
• Be unique for each account

Example of a strong password: 7mK$9vLp@2qR4x
Example of a weak password: password123`,
      },
      {
        type: 'activity',
        title: 'Interactive Password Strength Checker',
        items: [
          'Test your password strength with our analyzer',
          'Learn why certain passwords are weak',
          'Get recommendations for improvement',
          'Understand entropy and complexity',
        ],
      },
      {
        type: 'quiz',
        title: 'Password Security Quiz',
        questions: [
          {
            id: 'q1',
            question: 'What is the recommended minimum length for a strong password?',
            options: ['8 characters', '10 characters', '12-16 characters', '6 characters'],
            correctAnswer: 2,
            explanation: 'Security experts recommend passwords of at least 12-16 characters for strong protection.',
          },
          {
            id: 'q2',
            question: 'Which of these is the strongest password?',
            options: ['MyPassword123', 'Pass123!@#', 'aB3$cDeFgH7!mN', 'admin1234'],
            correctAnswer: 2,
            explanation:
              'aB3$cDeFgH7!mN is the strongest because it has length, mixed case, numbers, and special characters.',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Phishing & Social Engineering',
    description: 'Identify and defend against phishing attacks and social engineering tactics',
    order: 3,
    locked: true,
    completionXp: 150,
    estimatedTime: 18,
    content: [
      {
        type: 'text',
        title: 'Understanding Phishing',
        content: `Phishing is a social engineering attack where attackers try to trick you into revealing sensitive information or installing malware. Common phishing tactics include:

• Fake emails impersonating trusted companies
• Suspicious links that look legitimate
• Urgency or fear-based messaging
• Requests for personal or financial information
• Malicious attachments

Red flags to watch for:
✗ Sender's email address doesn't match the company
✗ Generic greetings like "Dear Customer"
✗ Urgent action required messages
✗ Suspicious links or attachments
✗ Spelling and grammar errors`,
      },
      {
        type: 'comic',
        title: 'The Phishing Tale',
        imageSrc: '/images/phishing-comic.png',
      },
      {
        type: 'puzzle',
        title: 'Spot the Phishing Email',
        items: [
          'Identify phishing emails in real-world scenarios',
          'Learn from common attack patterns',
          'Practice your phishing detection skills',
          'Unlock achievements for accuracy',
        ],
      },
      {
        type: 'quiz',
        title: 'Phishing Defense Quiz',
        questions: [
          {
            id: 'q1',
            question: 'What is a common red flag in phishing emails?',
            options: [
              'Formal language',
              'Urgent action required messages',
              'Company logos',
              'Professional formatting',
            ],
            correctAnswer: 1,
            explanation: 'Urgent action required is a common phishing tactic to make you act without thinking.',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Software Updates & Patching',
    description: 'Keep your systems secure by staying up-to-date with patches and updates',
    order: 4,
    locked: true,
    completionXp: 100,
    estimatedTime: 10,
    content: [
      {
        type: 'text',
        title: 'Why Updates Matter',
        content: `Software updates are critical security patches that fix vulnerabilities. Ignoring updates leaves your system exposed to known exploits.

Why you should update:
• Patches fix security vulnerabilities
• Prevents malware exploitation
• Improves system performance
• Ensures compatibility
• Protects your data

Update strategy:
1. Enable automatic updates when possible
2. Install updates promptly
3. Restart your device if required
4. Keep all software current (OS, browsers, apps)`,
      },
      {
        type: 'activity',
        title: 'Update Audit Checklist',
        items: [
          'Check your Windows/macOS version',
          'Review installed software versions',
          'Enable automatic updates',
          'Test after applying updates',
        ],
      },
      {
        type: 'quiz',
        title: 'Updates & Patches Quiz',
        questions: [
          {
            id: 'q1',
            question: 'What is the primary purpose of software security patches?',
            options: [
              'To add new features',
              'To fix security vulnerabilities',
              'To improve graphics',
              'To reduce file size',
            ],
            correctAnswer: 1,
            explanation: 'Security patches specifically target and fix known vulnerabilities in software.',
          },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'Two-Factor Authentication (2FA)',
    description: 'Add an extra layer of security to your accounts with 2FA',
    order: 5,
    locked: true,
    completionXp: 120,
    estimatedTime: 14,
    content: [
      {
        type: 'text',
        title: 'What is Two-Factor Authentication?',
        content: `Two-factor authentication (2FA) requires two forms of verification before granting access to your account. This significantly increases security even if your password is compromised.

Types of 2FA:
• SMS codes (text messages)
• Email verification
• Authenticator apps (Google Authenticator, Authy)
• Hardware security keys
• Biometric verification (fingerprint, face)

Why 2FA is effective:
✓ Adds a second verification barrier
✓ Even with a stolen password, accounts stay protected
✓ Significantly reduces unauthorized access
✓ Industry standard for sensitive accounts`,
      },
      {
        type: 'video',
        title: 'Setting Up 2FA',
        videoUrl: 'https://www.youtube.com/embed/0ZewQRqr-KQ',
      },
      {
        type: 'activity',
        title: 'Enable 2FA Challenge',
        items: [
          'Set up 2FA on your email account',
          'Configure authenticator app',
          'Save backup codes securely',
          'Test the 2FA process',
        ],
      },
      {
        type: 'quiz',
        title: '2FA Quiz',
        questions: [
          {
            id: 'q1',
            question: 'Which is NOT a common 2FA method?',
            options: [
              'SMS codes',
              'Authenticator apps',
              'Your birthday',
              'Hardware security keys',
            ],
            correctAnswer: 2,
            explanation: 'Your birthday is not a secure 2FA method because it can be easily discovered or guessed.',
          },
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'Public WiFi & VPNs',
    description: 'Stay secure when connecting to public networks using VPNs and best practices',
    order: 6,
    locked: true,
    completionXp: 130,
    estimatedTime: 16,
    content: [
      {
        type: 'text',
        title: 'The Risks of Public WiFi',
        content: `Public WiFi networks are convenient but risky. Attackers can easily intercept your data on unsecured networks.

Risks on public WiFi:
🔓 Man-in-the-middle attacks
🔓 Data interception
🔓 Malware distribution
🔓 Password theft
🔓 Session hijacking

Using a VPN (Virtual Private Network):
• Encrypts your internet traffic
• Hides your IP address
• Protects on public WiFi
• Secures sensitive transactions
• Enhances privacy`,
      },
      {
        type: 'activity',
        title: 'VPN Setup Guide',
        items: [
          'Choose a reputable VPN provider',
          'Download and install VPN software',
          'Configure VPN settings',
          'Test your VPN connection',
        ],
      },
      {
        type: 'puzzle',
        title: 'Network Security Scenarios',
        items: [
          'Identify safe network practices',
          'Choose appropriate security measures',
          'Evaluate network risks',
        ],
      },
      {
        type: 'quiz',
        title: 'Public WiFi Safety Quiz',
        questions: [
          {
            id: 'q1',
            question: 'What is the main advantage of using a VPN on public WiFi?',
            options: [
              'It makes internet faster',
              'It encrypts your traffic and hides your IP',
              'It provides unlimited bandwidth',
              'It blocks all advertisements',
            ],
            correctAnswer: 1,
            explanation: 'A VPN encrypts your traffic and masks your IP address, protecting your data on public networks.',
          },
        ],
      },
    ],
  },
  {
    id: '7',
    title: 'Backup & Data Protection',
    description: 'Protect your data with regular backups and recovery strategies',
    order: 7,
    locked: true,
    completionXp: 140,
    estimatedTime: 13,
    content: [
      {
        type: 'text',
        title: '3-2-1 Backup Strategy',
        content: `The 3-2-1 backup rule is an industry-standard approach to data protection:

3: Keep 3 copies of your data
   - Original + 2 backups minimum

2: Use 2 different storage types
   - e.g., external drive + cloud storage

1: Store 1 copy off-site
   - Protects against local disasters

Backup locations:
• Local external hard drive
• Cloud storage (Google Drive, OneDrive, iCloud)
• Network-attached storage (NAS)
• Multiple geographic locations

Backup frequency:
✓ Daily for critical data
✓ Weekly for important files
✓ Monthly for everything else`,
      },
      {
        type: 'activity',
        title: 'Create Your Backup Plan',
        items: [
          'Identify critical files to backup',
          'Choose backup storage solutions',
          'Set up automated backups',
          'Test backup restoration',
        ],
      },
      {
        type: 'quiz',
        title: 'Data Protection Quiz',
        questions: [
          {
            id: 'q1',
            question: 'What is the 3-2-1 backup rule?',
            options: [
              '3 backups daily, 2 weekly, 1 monthly',
              '3 copies, 2 storage types, 1 off-site',
              '3 weeks, 2 months, 1 year retention',
              '3 devices, 2 clouds, 1 password',
            ],
            correctAnswer: 1,
            explanation: 'The 3-2-1 rule means 3 copies, using 2 different storage types, with 1 copy stored off-site.',
          },
        ],
      },
    ],
  },
  {
    id: '8',
    title: 'Malware & Antivirus',
    description: 'Understand malware threats and how to protect your systems',
    order: 8,
    locked: true,
    completionXp: 150,
    estimatedTime: 17,
    content: [
      {
        type: 'text',
        title: 'Types of Malware',
        content: `Malware is any software designed to harm your computer or steal data. Understanding different types helps you recognize threats.

Common malware types:
🦠 Viruses - Replicate and spread
🦠 Trojans - Disguise as legitimate software
🦠 Ransomware - Encrypts your files for ransom
🦠 Spyware - Monitors your activity
🦠 Adware - Displays unwanted advertisements
🦠 Worms - Self-replicating and spreading
🦠 Rootkits - Hide in system layers

Prevention & Protection:
✓ Keep antivirus software updated
✓ Scan downloads before opening
✓ Avoid suspicious websites
✓ Don't download from untrusted sources
✓ Use reputable antivirus tools`,
      },
      {
        type: 'comic',
        title: 'The Malware Mystery',
        imageSrc: '/images/malware-comic.png',
      },
      {
        type: 'activity',
        title: 'Antivirus Setup Guide',
        items: [
          'Select and install antivirus software',
          'Configure real-time scanning',
          'Schedule regular full scans',
          'Review quarantine regularly',
        ],
      },
      {
        type: 'quiz',
        title: 'Malware Knowledge Quiz',
        questions: [
          {
            id: 'q1',
            question: 'What is the main difference between a virus and a worm?',
            options: [
              'Viruses are more dangerous',
              'Worms self-replicate and spread without user action',
              'Viruses spread faster',
              'There is no difference',
            ],
            correctAnswer: 1,
            explanation:
              'Worms can self-replicate and spread across networks without user intervention, while viruses require execution.',
          },
        ],
      },
    ],
  },
  {
    id: '9',
    title: 'Building a Security Culture',
    description: 'Create sustainable security habits and cultivate awareness in your community',
    order: 9,
    locked: true,
    completionXp: 160,
    estimatedTime: 20,
    content: [
      {
        type: 'text',
        title: 'Security as a Habit',
        content: `Cyber security isn't just about tools—it's about building habits and awareness that become second nature.

Key security habits:
1. Think before you click
2. Verify sender identities
3. Keep devices updated
4. Use strong, unique passwords
5. Enable 2FA everywhere
6. Back up important data
7. Stay informed about threats
8. Practice privacy settings

Creating lasting change:
📌 Start small with one habit
📌 Build gradually over time
📌 Celebrate successes
📌 Help others learn
📌 Stay curious and informed
📌 Review and adapt practices`,
      },
      {
        type: 'video',
        title: 'Security Culture in Organizations',
        videoUrl: 'https://www.youtube.com/embed/qkJ9keBmQAo',
      },
      {
        type: 'news',
        title: 'Latest Cyber Threats & News',
        newsItems: [
          {
            title: 'Zero-Day Vulnerability Discovered',
            summary: 'A critical zero-day vulnerability was discovered in a widely-used software framework.',
            date: '2024-01-15',
            severity: 'critical',
          },
          {
            title: 'AI-Powered Phishing Attacks Rise',
            summary: 'Attackers are using AI to create more convincing phishing emails.',
            date: '2024-01-14',
            severity: 'high',
          },
          {
            title: 'New Privacy Regulations',
            summary: 'Several countries announce new data protection regulations.',
            date: '2024-01-13',
            severity: 'medium',
          },
        ],
      },
      {
        type: 'quiz',
        title: 'Final Comprehensive Quiz',
        questions: [
          {
            id: 'q1',
            question: 'What is the most important aspect of building a security culture?',
            options: [
              'Buying expensive security tools',
              'Having strict rules only',
              'Building sustainable habits and awareness',
              'Hiring security professionals',
            ],
            correctAnswer: 2,
            explanation: 'Building lasting security habits and awareness is more effective than any single tool or policy.',
          },
          {
            id: 'q2',
            question: 'Which habit should you prioritize?',
            options: [
              'Thinking before clicking links',
              'Updating software regularly',
              'Using strong passwords',
              'All of the above',
            ],
            correctAnswer: 3,
            explanation: 'All of these habits are equally important for maintaining good cyber hygiene.',
          },
        ],
      },
    ],
  },
];

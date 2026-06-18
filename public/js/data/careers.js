var CAREERS = [{
                id: 'swe',
                title: 'Software Engineer',
                icon: '💻',
                stream: 'Technology',
                salary: '₹6–45 LPA',
                demand: 'Very High',
                dp: 95,
                time: '3–6 months',
                desc: 'Design, develop and maintain software applications for platforms worldwide.',
                skills: [{
                    n: 'Data Structures & Algorithms',
                    l: 'Core'
                }, {
                    n: 'Web/App Development',
                    l: 'Core'
                }, {
                    n: 'System Design',
                    l: 'Advanced'
                }, {
                    n: 'Version Control (Git)',
                    l: 'Essential'
                }, {
                    n: 'Database Management',
                    l: 'Important'
                }],
                roadmap: ['Learn Python or Java — build 2 small projects', 'Master DSA on LeetCode (medium level)', 'Build 3 portfolio projects with GitHub', 'Apply for software internships', 'Target product companies for placement'],
                bestFor: 'Logical problem-solvers who love building products',
                match: {
                    'Technology': 30,
                    'Mathematics & Sciences': 25,
                    'Computer Science & Tech': 40,
                    'Business': 5
                }
            },
            {
                id: 'ds',
                title: 'Data Scientist',
                icon: '📊',
                stream: 'Technology',
                salary: '₹8–40 LPA',
                demand: 'Very High',
                dp: 92,
                time: '4–8 months',
                desc: 'Extract actionable insights from complex datasets to drive business decisions.',
                skills: [{
                    n: 'Python / R Programming',
                    l: 'Core'
                }, {
                    n: 'Machine Learning',
                    l: 'Core'
                }, {
                    n: 'Statistics & Probability',
                    l: 'Core'
                }, {
                    n: 'SQL & Databases',
                    l: 'Important'
                }, {
                    n: 'Data Visualisation',
                    l: 'Important'
                }],
                roadmap: ['Master Python + NumPy + Pandas', 'Learn ML with Scikit-Learn', 'Practise on Kaggle competitions', 'Build 3 end-to-end projects', 'Get IBM/Google Data Science certification'],
                bestFor: 'Analytical minds who love patterns and statistics',
                match: {
                    'Technology': 25,
                    'Mathematics & Sciences': 40,
                    'Research': 20,
                    'Business': 15
                }
            },
            {
                id: 'aiml',
                title: 'AI/ML Engineer',
                icon: '🤖',
                stream: 'Technology',
                salary: '₹12–50 LPA',
                demand: 'Extremely High',
                dp: 97,
                time: '6–12 months',
                desc: 'Build and deploy artificial intelligence and machine learning models at scale.',
                skills: [{
                    n: 'Deep Learning (PyTorch/TF)',
                    l: 'Core'
                }, {
                    n: 'Mathematics (Linear Algebra)',
                    l: 'Core'
                }, {
                    n: 'MLOps & Deployment',
                    l: 'Advanced'
                }, {
                    n: 'Large Language Models',
                    l: 'Advanced'
                }, {
                    n: 'Cloud Platforms (AWS/GCP)',
                    l: 'Important'
                }],
                roadmap: ['Strong Python + Math foundation', 'Master deep learning frameworks', 'Build NLP/Computer Vision projects', 'Contribute to open-source AI projects', 'Target AI-first companies'],
                bestFor: 'Those fascinated by intelligence and automation',
                match: {
                    'Technology': 35,
                    'Mathematics & Sciences': 35,
                    'Research': 20,
                    'Computer Science & Tech': 10
                }
            },
            {
                id: 'pm',
                title: 'Product Manager',
                icon: '🎯',
                stream: 'Technology',
                salary: '₹12–60 LPA',
                demand: 'High',
                dp: 85,
                time: '2–3 years exp.',
                desc: 'Define product strategy and lead cross-functional teams to build user-loved products.',
                skills: [{
                    n: 'Product Strategy',
                    l: 'Core'
                }, {
                    n: 'User Research & UX',
                    l: 'Core'
                }, {
                    n: 'Data Analysis',
                    l: 'Important'
                }, {
                    n: 'Agile/Scrum',
                    l: 'Essential'
                }, {
                    n: 'Stakeholder Communication',
                    l: 'Core'
                }],
                roadmap: ['Build a technical foundation (coding basics)', 'Read PM books — Inspired, Continuous Discovery', 'Intern as Business Analyst or UX researcher', 'Get APM role at a startup', 'Build portfolio of product case studies'],
                bestFor: 'Strategic thinkers who love user problems',
                match: {
                    'Business': 30,
                    'Technology': 25,
                    'Design': 20,
                    'Law & Policy': 10,
                    'Healthcare': 15
                }
            },
            {
                id: 'cyber',
                title: 'Cybersecurity Analyst',
                icon: '🔒',
                stream: 'Technology',
                salary: '₹6–30 LPA',
                demand: 'High',
                dp: 88,
                time: '4–8 months',
                desc: 'Protect organisations from digital threats, vulnerabilities, and cyberattacks.',
                skills: [{
                    n: 'Network Security',
                    l: 'Core'
                }, {
                    n: 'Ethical Hacking',
                    l: 'Core'
                }, {
                    n: 'SIEM Tools',
                    l: 'Important'
                }, {
                    n: 'Python Scripting',
                    l: 'Important'
                }, {
                    n: 'Compliance Frameworks',
                    l: 'Advanced'
                }],
                roadmap: ['Learn networking fundamentals', 'Get CEH or CompTIA Security+', 'Practise on TryHackMe/HackTheBox', 'Build home lab for penetration testing', 'Apply for SOC Analyst roles'],
                bestFor: 'Detail-oriented people who think like attackers',
                match: {
                    'Technology': 40,
                    'Mathematics & Sciences': 20,
                    'Law & Policy': 15,
                    'Engineering': 25
                }
            },
            {
                id: 'cloud',
                title: 'Cloud Architect',
                icon: '☁',
                stream: 'Technology',
                salary: '₹15–70 LPA',
                demand: 'Very High',
                dp: 91,
                time: '1–2 years',
                desc: 'Design and manage scalable, secure cloud infrastructure for businesses.',
                skills: [{
                    n: 'AWS / Azure / GCP',
                    l: 'Core'
                }, {
                    n: 'Infrastructure as Code',
                    l: 'Core'
                }, {
                    n: 'Kubernetes & Docker',
                    l: 'Advanced'
                }, {
                    n: 'Networking & Security',
                    l: 'Important'
                }, {
                    n: 'Cost Optimisation',
                    l: 'Advanced'
                }],
                roadmap: ['Get AWS Cloud Practitioner cert', 'Master EC2, S3, Lambda, RDS', 'Learn Terraform and Kubernetes', 'Get AWS Solutions Architect cert', 'Target cloud engineering roles'],
                bestFor: 'Systems thinkers who love scalability problems',
                match: {
                    'Technology': 40,
                    'Engineering': 30,
                    'Mathematics & Sciences': 20,
                    'Business': 10
                }
            },
            {
                id: 'uxd',
                title: 'UI/UX Designer',
                icon: '🎨',
                stream: 'Creative',
                salary: '₹5–25 LPA',
                demand: 'High',
                dp: 83,
                time: '3–6 months',
                desc: 'Design intuitive, beautiful digital experiences that users love.',
                skills: [{
                    n: 'Figma / Adobe XD',
                    l: 'Core'
                }, {
                    n: 'User Research',
                    l: 'Core'
                }, {
                    n: 'Prototyping & Wireframing',
                    l: 'Core'
                }, {
                    n: 'Interaction Design',
                    l: 'Advanced'
                }, {
                    n: 'Usability Testing',
                    l: 'Important'
                }],
                roadmap: ['Learn Figma fundamentals', 'Study design principles (typography, colour)', 'Redesign 3 existing apps as case studies', 'Build Behance/Dribbble portfolio', 'Apply for junior UX roles'],
                bestFor: 'Empathetic creatives who think in systems',
                match: {
                    'Creative': 40,
                    'Technology': 25,
                    'Business': 20,
                    'Arts & Humanities': 15
                }
            },
            {
                id: 'mkt',
                title: 'Digital Marketer',
                icon: '📱',
                stream: 'Business',
                salary: '₹4–20 LPA',
                demand: 'High',
                dp: 80,
                time: '2–4 months',
                desc: 'Plan and execute digital campaigns to drive growth, leads, and brand awareness.',
                skills: [{
                    n: 'SEO & SEM',
                    l: 'Core'
                }, {
                    n: 'Social Media Strategy',
                    l: 'Core'
                }, {
                    n: 'Analytics (GA4)',
                    l: 'Important'
                }, {
                    n: 'Content Marketing',
                    l: 'Core'
                }, {
                    n: 'Paid Advertising',
                    l: 'Advanced'
                }],
                roadmap: ['Learn Google Analytics & SEO basics', 'Run campaigns on your own project', 'Get Google/HubSpot Marketing cert', 'Build case studies showing ROI', 'Join a digital agency or startup'],
                bestFor: 'Creative communicators who love data-driven results',
                match: {
                    'Business': 35,
                    'Creative': 30,
                    'Arts & Humanities': 20,
                    'Technology': 15
                }
            },
            {
                id: 'fa',
                title: 'Financial Analyst',
                icon: '📈',
                stream: 'Business',
                salary: '₹6–28 LPA',
                demand: 'High',
                dp: 82,
                time: '6–12 months',
                desc: 'Analyse financial data and guide investment and business decisions.',
                skills: [{
                    n: 'Financial Modelling',
                    l: 'Core'
                }, {
                    n: 'Excel & PowerBI',
                    l: 'Core'
                }, {
                    n: 'Accounting Principles',
                    l: 'Important'
                }, {
                    n: 'Valuation Techniques',
                    l: 'Advanced'
                }, {
                    n: 'Python for Finance',
                    l: 'Advanced'
                }],
                roadmap: ['Master financial statement analysis', 'Build Excel modelling skills', 'Get CFA Level 1 certification', 'Intern at a financial firm', 'Build portfolio of valuation projects'],
                bestFor: 'Numbers-focused people who love business strategy',
                match: {
                    'Business': 40,
                    'Mathematics & Sciences': 30,
                    'Commerce & Economics': 25,
                    'Law & Policy': 5
                }
            },
            {
                id: 'ca',
                title: 'Chartered Accountant',
                icon: '🧾',
                stream: 'Business',
                salary: '₹7–40 LPA',
                demand: 'Stable',
                dp: 75,
                time: '3–5 years',
                desc: 'Expert financial professional providing audit, tax, and advisory services.',
                skills: [{
                    n: 'Accounting Standards',
                    l: 'Core'
                }, {
                    n: 'Tax Law (GST/Income Tax)',
                    l: 'Core'
                }, {
                    n: 'Audit & Assurance',
                    l: 'Core'
                }, {
                    n: 'Financial Reporting',
                    l: 'Advanced'
                }, {
                    n: 'Corporate Law',
                    l: 'Important'
                }],
                roadmap: ['Clear CA Foundation exam', 'Complete CA Intermediate', '3-year articleship at CA firm', 'Clear CA Final exam', 'Build specialisation (Tax/Audit/Advisory)'],
                bestFor: 'Detail-oriented, disciplined individuals who value precision',
                match: {
                    'Business': 40,
                    'Commerce & Economics': 35,
                    'Law & Policy': 20,
                    'Mathematics & Sciences': 5
                }
            },
            {
                id: 'ib',
                title: 'Investment Banker',
                icon: '🏦',
                stream: 'Business',
                salary: '₹12–80 LPA',
                demand: 'High',
                dp: 78,
                time: '2–4 years',
                desc: 'Raise capital, execute mergers, and provide financial advisory to corporations.',
                skills: [{
                    n: 'Financial Modelling (DCF)',
                    l: 'Core'
                }, {
                    n: 'Valuation & M&A',
                    l: 'Core'
                }, {
                    n: 'Pitch Deck Creation',
                    l: 'Important'
                }, {
                    n: 'Market Research',
                    l: 'Advanced'
                }, {
                    n: 'Networking & Communication',
                    l: 'Core'
                }],
                roadmap: ['Top MBA or finance degree', 'Excel in financial modelling courses', 'Intern at a bulge-bracket bank', 'CFA Level 1 is a strong differentiator', 'Network actively on LinkedIn'],
                bestFor: 'Ambitious, high-energy individuals who thrive under pressure',
                match: {
                    'Business': 40,
                    'Commerce & Economics': 30,
                    'Law & Policy': 20,
                    'Mathematics & Sciences': 10
                }
            },
            {
                id: 'doc',
                title: 'Medical Doctor',
                icon: '🩺',
                stream: 'Healthcare',
                salary: '₹8–80 LPA',
                demand: 'High',
                dp: 88,
                time: '5.5+ years (MBBS)',
                desc: 'Diagnose and treat patients, improve health outcomes across communities.',
                skills: [{
                    n: 'Clinical Knowledge',
                    l: 'Core'
                }, {
                    n: 'Patient Communication',
                    l: 'Core'
                }, {
                    n: 'Diagnostic Skills',
                    l: 'Core'
                }, {
                    n: 'Emergency Medicine',
                    l: 'Advanced'
                }, {
                    n: 'Research & Evidence-Based Medicine',
                    l: 'Advanced'
                }],
                roadmap: ['Clear NEET for MBBS admission', 'Complete 5.5-year MBBS degree', '1-year mandatory internship', 'Clear PG entrance (NEET-PG)', 'Specialise in high-demand field'],
                bestFor: 'Empathetic, dedicated individuals with strong science base',
                match: {
                    'Healthcare': 40,
                    'Biology & Medicine': 40,
                    'Mathematics & Sciences': 15,
                    'Research': 5
                }
            },
            {
                id: 'bio',
                title: 'Biotech Researcher',
                icon: '🔬',
                stream: 'Healthcare',
                salary: '₹5–25 LPA',
                demand: 'Growing',
                dp: 72,
                time: '4–6 years',
                desc: 'Conduct research to develop drugs, vaccines, and biological solutions.',
                skills: [{
                    n: 'Molecular Biology',
                    l: 'Core'
                }, {
                    n: 'Biochemistry',
                    l: 'Core'
                }, {
                    n: 'Lab Techniques (PCR/ELISA)',
                    l: 'Core'
                }, {
                    n: 'Bioinformatics',
                    l: 'Advanced'
                }, {
                    n: 'Research Methodology',
                    l: 'Important'
                }],
                roadmap: ['BSc in Biotechnology/Life Sciences', 'Master specific lab skills', 'Publish research or assist in projects', 'MSc or PhD for research careers', 'Target pharma, CSIR, or biotech startups'],
                bestFor: 'Curious minds who want to solve biological problems',
                match: {
                    'Healthcare': 30,
                    'Biology & Medicine': 40,
                    'Research': 20,
                    'Mathematics & Sciences': 10
                }
            },
            {
                id: 'ce',
                title: 'Civil Engineer',
                icon: '🏗',
                stream: 'Engineering',
                salary: '₹4–25 LPA',
                demand: 'Stable',
                dp: 70,
                time: '4 years (B.Tech)',
                desc: 'Design and oversee construction of infrastructure — buildings, roads, bridges.',
                skills: [{
                    n: 'Structural Analysis',
                    l: 'Core'
                }, {
                    n: 'AutoCAD / Revit',
                    l: 'Core'
                }, {
                    n: 'Project Management',
                    l: 'Important'
                }, {
                    n: 'Construction Materials',
                    l: 'Core'
                }, {
                    n: 'Surveying',
                    l: 'Important'
                }],
                roadmap: ['B.Tech Civil Engineering', 'GATE for PSU jobs (optional)', 'Internship at construction company', 'Get licensed as Junior Engineer', 'Specialise in structural/geotechnical/env.'],
                bestFor: 'Practical builders who want visible, lasting impact',
                match: {
                    'Engineering': 40,
                    'Mathematics & Sciences': 30,
                    'Business': 15,
                    'Law & Policy': 15
                }
            },
            {
                id: 'me',
                title: 'Mechanical Engineer',
                icon: '⚙',
                stream: 'Engineering',
                salary: '₹4–22 LPA',
                demand: 'Stable',
                dp: 68,
                time: '4 years (B.Tech)',
                desc: 'Design, analyse and manufacture mechanical systems and machinery.',
                skills: [{
                    n: 'CAD/CAM (SolidWorks)',
                    l: 'Core'
                }, {
                    n: 'Thermodynamics',
                    l: 'Core'
                }, {
                    n: 'Manufacturing Processes',
                    l: 'Core'
                }, {
                    n: 'FEA Analysis (ANSYS)',
                    l: 'Advanced'
                }, {
                    n: 'Industrial Automation',
                    l: 'Growing'
                }],
                roadmap: ['Strong mechanics and maths foundation', 'Master SolidWorks/CATIA', 'Internship at manufacturing firm', 'GATE for PSU or M.Tech', 'Pivot to automation/robotics for growth'],
                bestFor: 'Hands-on problem-solvers who love machines',
                match: {
                    'Engineering': 45,
                    'Mathematics & Sciences': 30,
                    'Technology': 15,
                    'Business': 10
                }
            },
            {
                id: 'ee',
                title: 'Electrical Engineer',
                icon: '⚡',
                stream: 'Engineering',
                salary: '₹4–22 LPA',
                demand: 'Stable',
                dp: 72,
                time: '4 years (B.Tech)',
                desc: 'Design and develop electrical systems, circuits, power grids and electronics.',
                skills: [{
                    n: 'Circuit Design',
                    l: 'Core'
                }, {
                    n: 'Power Systems',
                    l: 'Core'
                }, {
                    n: 'MATLAB/Simulink',
                    l: 'Important'
                }, {
                    n: 'Embedded Systems',
                    l: 'Advanced'
                }, {
                    n: 'Renewable Energy',
                    l: 'Growing'
                }],
                roadmap: ['Strong physics and maths base', 'Master MATLAB and circuit simulators', 'GATE exam preparation', 'Internship at power company or startup', 'Pivot to IoT/EV/Renewables for high growth'],
                bestFor: 'Technical minds with passion for energy and electronics',
                match: {
                    'Engineering': 45,
                    'Mathematics & Sciences': 35,
                    'Technology': 15,
                    'Business': 5
                }
            },
            {
                id: 'law',
                title: 'Lawyer',
                icon: '⚖',
                stream: 'Law & Policy',
                salary: '₹4–50 LPA',
                demand: 'Stable',
                dp: 74,
                time: '5 years (LLB)',
                desc: 'Provide legal counsel, represent clients, and navigate the justice system.',
                skills: [{
                    n: 'Legal Research',
                    l: 'Core'
                }, {
                    n: 'Contract Law',
                    l: 'Core'
                }, {
                    n: 'Courtroom Advocacy',
                    l: 'Advanced'
                }, {
                    n: 'Corporate Law',
                    l: 'High Demand'
                }, {
                    n: 'Communication & Writing',
                    l: 'Core'
                }],
                roadmap: ['5-year BA LLB or 3-year LLB after graduation', 'Moot court and internship at law firm', 'Enroll with Bar Council', 'Specialise in Corporate/IP/Tech law (high demand)', 'Build reputation through consistent practice'],
                bestFor: 'Analytical communicators with a passion for justice',
                match: {
                    'Law & Policy': 40,
                    'Arts & Humanities': 25,
                    'Business': 20,
                    'Commerce & Economics': 15
                }
            },
            {
                id: 'hrm',
                title: 'HR Manager',
                icon: '🤝',
                stream: 'Business',
                salary: '₹4–20 LPA',
                demand: 'Stable',
                dp: 73,
                time: '2–3 years exp.',
                desc: 'Attract, develop and retain talent, and shape organisational culture.',
                skills: [{
                    n: 'Talent Acquisition',
                    l: 'Core'
                }, {
                    n: 'HRIS Systems',
                    l: 'Important'
                }, {
                    n: 'Employee Relations',
                    l: 'Core'
                }, {
                    n: 'Performance Management',
                    l: 'Advanced'
                }, {
                    n: 'Labour Law',
                    l: 'Important'
                }],
                roadmap: ['MBA HR or BBA + specialisation', 'Internship in HR department', 'Get SHRM or HRCI certification', 'Build expertise in HRBP or TA', 'Move into strategic HR or Head of People'],
                bestFor: 'People-oriented individuals who love building teams',
                match: {
                    'Business': 30,
                    'Arts & Humanities': 25,
                    'Law & Policy': 20,
                    'Psychology': 25
                }
            },
            {
                id: 'gd',
                title: 'Game Developer',
                icon: '🎮',
                stream: 'Technology',
                salary: '₹5–30 LPA',
                demand: 'Growing',
                dp: 78,
                time: '6–12 months',
                desc: 'Create interactive games for mobile, PC, and console platforms.',
                skills: [{
                    n: 'Unity / Unreal Engine',
                    l: 'Core'
                }, {
                    n: 'C# / C++',
                    l: 'Core'
                }, {
                    n: '3D Modelling Basics',
                    l: 'Useful'
                }, {
                    n: 'Physics & Collision Systems',
                    l: 'Advanced'
                }, {
                    n: 'Game Design Principles',
                    l: 'Important'
                }],
                roadmap: ['Learn Unity + C# fundamentals', 'Build 3 small game prototypes', 'Publish on itch.io or Play Store', 'Learn Unreal for AAA trajectory', 'Apply to indie studios or mobile game companies'],
                bestFor: 'Creative coders who grew up playing games',
                match: {
                    'Technology': 35,
                    'Creative': 35,
                    'Arts & Humanities': 15,
                    'Mathematics & Sciences': 15
                }
            },
            {
                id: 'da2',
                title: 'Data Analyst',
                icon: '🔍',
                stream: 'Technology',
                salary: '₹4–18 LPA',
                demand: 'Very High',
                dp: 87,
                time: '2–4 months',
                desc: 'Collect, process and interpret data to help businesses make informed decisions.',
                skills: [{
                    n: 'SQL',
                    l: 'Core'
                }, {
                    n: 'Excel / Google Sheets',
                    l: 'Core'
                }, {
                    n: 'Tableau / PowerBI',
                    l: 'Important'
                }, {
                    n: 'Python (Pandas)',
                    l: 'Important'
                }, {
                    n: 'Statistics Fundamentals',
                    l: 'Core'
                }],
                roadmap: ['Master SQL — solve 50+ queries', 'Learn Excel and PowerBI dashboards', 'Build 3 analysis projects with real datasets', 'Google Data Analytics cert (free)', 'Apply for junior analyst roles aggressively'],
                bestFor: 'Systematic thinkers who find answers in numbers',
                match: {
                    'Technology': 25,
                    'Mathematics & Sciences': 30,
                    'Business': 25,
                    'Commerce & Economics': 20
                }
            },
            {
                id: 'cc',
                title: 'Content Creator',
                icon: '🎬',
                stream: 'Creative',
                salary: '₹2–20 LPA',
                demand: 'High',
                dp: 80,
                time: '3–6 months',
                desc: 'Create engaging content across platforms — YouTube, Instagram, LinkedIn, blogs.',
                skills: [{
                    n: 'Video Editing (Premiere/CapCut)',
                    l: 'Core'
                }, {
                    n: 'Scriptwriting & Storytelling',
                    l: 'Core'
                }, {
                    n: 'SEO & Platform Algorithms',
                    l: 'Important'
                }, {
                    n: 'Graphic Design (Canva)',
                    l: 'Useful'
                }, {
                    n: 'Audience Analytics',
                    l: 'Advanced'
                }],
                roadmap: ['Pick one platform and one niche', 'Post consistently for 90 days', 'Learn video editing fundamentals', 'Monetise via brand deals + digital products', 'Build email list for owned audience'],
                bestFor: 'Creative communicators who love sharing knowledge',
                match: {
                    'Creative': 40,
                    'Arts & Humanities': 30,
                    'Business': 20,
                    'Technology': 10
                }
            },
            {
                id: 'devops',
                title: 'DevOps Engineer',
                icon: '🔧',
                stream: 'Technology',
                salary: '₹8–40 LPA',
                demand: 'Very High',
                dp: 89,
                time: '6–10 months',
                desc: 'Bridge development and operations — automate CI/CD pipelines and manage infrastructure.',
                skills: [{
                    n: 'Docker & Kubernetes',
                    l: 'Core'
                }, {
                    n: 'CI/CD Pipelines',
                    l: 'Core'
                }, {
                    n: 'Linux Administration',
                    l: 'Core'
                }, {
                    n: 'Terraform (IaC)',
                    l: 'Advanced'
                }, {
                    n: 'Monitoring (Grafana/Prometheus)',
                    l: 'Important'
                }],
                roadmap: ['Learn Linux + Bash scripting', 'Master Docker and Kubernetes', 'Set up a CI/CD pipeline project', 'Get AWS + Kubernetes (CKA) certs', 'Target DevOps/SRE roles at tech companies'],
                bestFor: 'Problem-solvers who love automation and reliability',
                match: {
                    'Technology': 45,
                    'Engineering': 30,
                    'Mathematics & Sciences': 15,
                    'Business': 10
                }
            },
            {
                id: 'ent',
                title: 'Entrepreneur',
                icon: '🚀',
                stream: 'Business',
                salary: 'Variable (₹0 to ∞)',
                demand: 'Always',
                dp: 100,
                time: 'Your own timeline',
                desc: 'Build products and companies that solve real problems and create value.',
                skills: [{
                    n: 'Problem Identification',
                    l: 'Core'
                }, {
                    n: 'Product Thinking',
                    l: 'Core'
                }, {
                    n: 'Financial Literacy',
                    l: 'Important'
                }, {
                    n: 'Sales & Marketing',
                    l: 'Core'
                }, {
                    n: 'Leadership & Resilience',
                    l: 'Essential'
                }],
                roadmap: ['Identify a painful problem you understand deeply', 'Validate with 10 real customer conversations', 'Build an MVP with minimum features', 'Find first 10 paying customers', 'Iterate based on feedback — repeat'],
                bestFor: 'Self-driven risk-takers who want to create, not just execute',
                match: {
                    'Business': 30,
                    'Technology': 20,
                    'Creative': 20,
                    'Arts & Humanities': 10,
                    'Law & Policy': 10,
                    'Engineering': 10
                }
            },
            {
                id: 'psy',
                title: 'Psychologist / Counsellor',
                icon: '🧠',
                stream: 'Healthcare',
                salary: '₹3–20 LPA',
                demand: 'Growing Fast',
                dp: 77,
                time: '5–6 years',
                desc: 'Support mental health and well-being through therapy, research, and counselling.',
                skills: [{
                    n: 'Psychological Assessment',
                    l: 'Core'
                }, {
                    n: 'Counselling Techniques (CBT)',
                    l: 'Core'
                }, {
                    n: 'Empathy & Active Listening',
                    l: 'Essential'
                }, {
                    n: 'Research Methodology',
                    l: 'Advanced'
                }, {
                    n: 'Ethics in Practice',
                    l: 'Core'
                }],
                roadmap: ['BA/BSc Psychology degree', 'MA/MSc Psychology (mandatory)', 'Internship at hospital or NGO', 'RCI registration for clinical practice', 'Specialise in corporate wellness or child psychology'],
                bestFor: 'Deeply empathetic people who want to help others heal',
                match: {
                    'Healthcare': 30,
                    'Arts & Humanities': 30,
                    'Law & Policy': 10,
                    'Business': 15,
                    'Research': 15
                }
            }
        ];
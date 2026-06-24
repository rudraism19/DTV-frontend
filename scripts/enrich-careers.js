const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../public/js/data/careers.js');
let content = fs.readFileSync(targetFile, 'utf8');

// Mock a browser environment to eval the careers.js safely
content = content.replace(/^var CAREERS\s*=\s*/g, 'global.CAREERS = ');
eval(content);
let CAREERS = global.CAREERS;

// Enrichment dictionaries
const enrichments = {
    swe: {
        growthRate: '🚀 22% YoY Growth', wlb: 'Flexible / Good', remote: 'High',
        companies: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Startups'],
        tools: ['VS Code', 'Git', 'Docker', 'Postman', 'Jira'],
        certs: ['AWS Certified Developer', 'Meta Frontend Professional', 'CKAD'],
        dayInLife: ['Write and test scalable code using modern frameworks', 'Review pull requests and optimize architecture', 'Collaborate with PMs to deliver new user features']
    },
    ds: {
        growthRate: '🚀 28% YoY Growth', wlb: 'Good', remote: 'High',
        companies: ['Meta', 'Netflix', 'Uber', 'Fractal Analytics', 'Mu Sigma'],
        tools: ['Jupyter', 'Python', 'SQL', 'Tableau', 'TensorFlow'],
        certs: ['Google Data Analytics', 'IBM Data Science', 'AWS Machine Learning'],
        dayInLife: ['Clean and analyze massive datasets for insights', 'Build predictive machine learning models', 'Present data-driven strategies to stakeholders']
    },
    aiml: {
        growthRate: '🚀 35% YoY Growth', wlb: 'Moderate', remote: 'High',
        companies: ['OpenAI', 'Google DeepMind', 'NVIDIA', 'Tesla', 'Anthropic'],
        tools: ['PyTorch', 'CUDA', 'HuggingFace', 'Docker', 'AWS'],
        certs: ['DeepLearning.AI Spec.', 'AWS ML Specialty', 'TensorFlow Developer'],
        dayInLife: ['Train and fine-tune Large Language Models', 'Optimize models for deployment inference', 'Read latest AI research papers and implement algorithms']
    },
    pm: {
        growthRate: '🚀 18% YoY Growth', wlb: 'Demanding', remote: 'Medium',
        companies: ['Stripe', 'Airbnb', 'Flipkart', 'Zomato', 'Atlassian'],
        tools: ['Jira', 'Figma', 'Amplitude', 'Notion', 'Mixpanel'],
        certs: ['CSPO (Scrum Product Owner)', 'Reforge Product Strategy', 'Google Project Management'],
        dayInLife: ['Define product roadmap and prioritize feature backlog', 'Conduct user interviews and gather feedback', 'Align engineering, design, and marketing teams']
    },
    cyber: {
        growthRate: '🚀 25% YoY Growth', wlb: 'On-Call / Demanding', remote: 'Medium',
        companies: ['CrowdStrike', 'Palo Alto', 'IBM Security', 'Banks', 'Gov. Agencies'],
        tools: ['Wireshark', 'Metasploit', 'Kali Linux', 'Splunk', 'Burp Suite'],
        certs: ['CEH (Certified Ethical Hacker)', 'CISSP', 'CompTIA Security+'],
        dayInLife: ['Monitor networks for security breaches', 'Perform penetration testing on applications', 'Respond to live cyber incidents and mitigate risks']
    },
    uxd: {
        growthRate: '🚀 15% YoY Growth', wlb: 'Good', remote: 'High',
        companies: ['Apple', 'Spotify', 'Cred', 'Swiggy', 'Design Agencies'],
        tools: ['Figma', 'Adobe CC', 'Miro', 'Zeplin', 'Webflow'],
        certs: ['Google UX Design', 'Nielsen Norman Group UX', 'Interaction Design Foundation'],
        dayInLife: ['Create high-fidelity wireframes and prototypes', 'Conduct A/B testing and usability research', 'Ensure design systems remain consistent across the app']
    },
    ib: {
        growthRate: '🚀 10% YoY Growth', wlb: 'Intense / 80+ hrs', remote: 'Low',
        companies: ['Goldman Sachs', 'JPMorgan', 'Morgan Stanley', 'Avendus', 'Nomura'],
        tools: ['Excel', 'Bloomberg Terminal', 'Capital IQ', 'PowerPoint', 'PitchBook'],
        certs: ['CFA Level 1', 'Financial Modeling Institute', 'Series 79'],
        dayInLife: ['Build complex DCF valuation models', 'Create pitch books for M&A transactions', 'Analyze industry trends and financial statements']
    },
    doc: {
        growthRate: '🚀 12% YoY Growth', wlb: 'Intense / Rewarding', remote: 'Very Low',
        companies: ['Apollo Hospitals', 'AIIMS', 'Fortis', 'Max Healthcare', 'Private Clinics'],
        tools: ['Stethoscope', 'EMR Systems', 'Diagnostic Imaging', 'Surgical Tools'],
        certs: ['MD / MS Specializations', 'BLS / ACLS Certification', 'Fellowships'],
        dayInLife: ['Examine patients and diagnose medical conditions', 'Prescribe treatments and perform procedures', 'Review patient lab results and medical histories']
    }
};

// Generic generator
function getGeneric(stream, title) {
    const isTech = stream === 'Technology';
    const isBiz = stream === 'Business' || stream === 'Business & Other';
    const isArt = stream === 'Creative' || stream === 'Design & Institutes';
    const isEng = stream === 'Engineering' || stream === 'Professional';
    const isHealth = stream === 'Healthcare';
    const isGov = stream === 'Govt Exams';

    return {
        growthRate: isTech ? '🚀 25% YoY Growth' : (isGov ? '📈 High Security & Perks' : (isArt ? '✨ High Demand & Freelance' : '🚀 15% YoY Growth')),
        wlb: isBiz || isHealth || isGov ? 'Demanding / Structured' : 'Moderate / Good',
        remote: isTech || isArt ? 'High' : (isBiz ? 'Medium' : 'Low'),
        companies: isTech ? ['Google', 'Microsoft', 'TCS', 'Infosys', 'Startups'] :
                   isBiz ? ['Deloitte', 'KPMG', 'Reliance', 'HDFC', 'Startups'] :
                   isGov ? ['Central Government', 'State Departments', 'Public Sector Units', 'Ministries'] :
                   isArt ? ['Design Agencies', 'Freelance / Remote', 'Top Studios', 'Publishing Houses'] :
                   ['Top Industry Leaders', 'MNCs', 'Private Firms', 'Government'],
        tools: isTech ? ['VS Code', 'Git', 'Slack', 'Jira'] :
               isArt ? ['Adobe CC', 'Canva', 'Figma', 'Notion'] :
               isBiz ? ['Excel', 'PowerPoint', 'Salesforce', 'Trello'] :
               isGov ? ['Government Portals', 'Official Records', 'Analytical Reports', 'Filing Systems'] :
               ['Industry Standard Software', 'MS Office', 'Communication Tools'],
        certs: [title + ' Mastery Cert', 'Industry Standard Diploma', 'Advanced Professional Badge'],
        dayInLife: [
            'Plan and execute key functions related to ' + title,
            'Review strategic operations and solve complex domain challenges',
            'Communicate with team and stakeholders to ensure highest quality output'
        ]
    };
}

CAREERS = CAREERS.map(c => {
    const enriched = enrichments[c.id] || getGeneric(c.stream, c.title);
    
    // Parse salary "₹6–45 LPA" to numbers roughly
    let min = 5; let max = 20;
    try {
        const matches = c.salary.match(/\d+/g);
        if (matches && matches.length >= 2) {
            min = parseInt(matches[0]);
            max = parseInt(matches[1]);
        }
    } catch(e){}

    const mid = Math.round(min + (max - min) * 0.4);

    return {
        ...c,
        growthRate: enriched.growthRate,
        wlb: enriched.wlb,
        remote: enriched.remote,
        topCompanies: enriched.companies,
        tools: enriched.tools,
        certifications: enriched.certs,
        dayInLife: enriched.dayInLife,
        trajectory: [
            { level: 'Entry-Level', role: 'Junior ' + c.title, salary: '₹' + min + '-' + (min+3) + ' LPA' },
            { level: 'Mid-Level', role: 'Senior ' + c.title, salary: '₹' + (min+4) + '-' + mid + ' LPA' },
            { level: 'Senior-Level', role: 'Lead/Director', salary: '₹' + mid + '-' + max + '+ LPA' }
        ]
    };
});

const outputContent = 'var CAREERS = ' + JSON.stringify(CAREERS, null, 4) + ';\n';
fs.writeFileSync(targetFile, outputContent, 'utf8');
console.log('Successfully enriched ' + CAREERS.length + ' careers.');

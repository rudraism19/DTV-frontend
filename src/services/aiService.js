const env = require('../config/env');

const MAX_INPUT_MESSAGES = 20;
const AI_TIMEOUT_MS = 25000;

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages.slice(-MAX_INPUT_MESSAGES).map(function(msg) {
    const role = msg && msg.role === 'assistant' ? 'assistant' : 'user';
    const content = msg && typeof msg.content === 'string'
      ? msg.content.slice(0, 4000)
      : '';
    return { role: role, content: content };
  }).filter(function(msg) {
    return msg.content.trim().length > 0;
  });
}

function isPlaceholderKey(key) {
  if (!key) return true;
  return /replace_with_your_real_key|your_[a-z_]*api_key_here|YOUR_API_KEY_HERE/i.test(key);
}

function resolveProvider() {
  const anthropicKey = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  const openaiKey = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const geminiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  const groqKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;

  const hasAnthropic = !isPlaceholderKey(anthropicKey);
  const hasOpenAI = !isPlaceholderKey(openaiKey);
  const hasGemini = !isPlaceholderKey(geminiKey);
  const hasGroq = !isPlaceholderKey(groqKey);

  if (env.AI_PROVIDER === 'anthropic') {
    return hasAnthropic ? { provider: 'anthropic', key: anthropicKey } : { error: 'AI_PROVIDER is anthropic but ANTHROPIC_API_KEY is missing or placeholder.' };
  }
  if (env.AI_PROVIDER === 'openai') {
    return hasOpenAI ? { provider: 'openai', key: openaiKey } : { error: 'AI_PROVIDER is openai but OPENAI_API_KEY is missing or placeholder.' };
  }
  if (env.AI_PROVIDER === 'gemini') {
    return hasGemini ? { provider: 'gemini', key: geminiKey } : { error: 'AI_PROVIDER is gemini but GEMINI_API_KEY is missing or placeholder.' };
  }
  if (env.AI_PROVIDER === 'groq') {
    return hasGroq ? { provider: 'groq', key: groqKey } : { error: 'AI_PROVIDER is groq but GROQ_API_KEY is missing or placeholder.' };
  }

  if (hasGemini) return { provider: 'gemini', key: geminiKey };
  if (hasGroq) return { provider: 'groq', key: groqKey };
  if (hasOpenAI) return { provider: 'openai', key: openaiKey };
  if (hasAnthropic) return { provider: 'anthropic', key: anthropicKey };

  return { provider: 'mock', key: 'mock' };
}

function toOpenAIMessages(system, messages) {
  const out = [];
  if (system && system.trim()) {
    out.push({ role: 'system', content: system });
  }
  messages.forEach(function(msg) {
    out.push({ role: msg.role === 'assistant' ? 'assistant' : 'user', content: msg.content });
  });
  return out;
}

function extractOpenAIText(payload) {
  const msg = payload && payload.choices && payload.choices[0] && payload.choices[0].message ? payload.choices[0].message.content : '';
  if (typeof msg === 'string') return msg;
  if (Array.isArray(msg)) {
    return msg.map(function(part) {
      if (typeof part === 'string') return part;
      if (part && typeof part.text === 'string') return part.text;
      return '';
    }).join('\n').trim();
  }
  return '';
}

async function sendMessages(payload) {
  try {
    const providerConfig = resolveProvider();
    if (providerConfig.error) {
      return { error: providerConfig.error, status: 500 };
    }

    const messages = sanitizeMessages(payload.messages || []);
    const system = typeof payload.system === 'string' ? payload.system.slice(0, 12000) : '';
    const maxTokens = Math.min(2048, Math.max(128, Number(payload.max_tokens || 1024)));

    if (!messages.length) {
      return { error: 'Request must include at least one non-empty message.', status: 400 };
    }

    const provider = providerConfig.provider;
    const apiKey = providerConfig.key;

    if (provider === 'mock') {
      const lastMsg = messages[messages.length - 1] ? messages[messages.length - 1].content.toLowerCase() : '';
      let mockReply = '';

      if (lastMsg.includes('study plan') || lastMsg.includes('weekly') || lastMsg.includes('routine') || lastMsg.includes('timetable') || lastMsg.includes('schedule')) {
        mockReply = `# 🌟 Your AI-Generated Weekly Study Plan & Career Journey

Welcome to your tailored academic roadmap! Based on your student profile and active career aspirations, here is a highly optimized, premium weekly study routine designed for maximum focus accuracy and retention.

---

## 📅 Weekly Routine & Micro-Goals

### **Monday - Core Foundation & Deep Work**
- **08:00 AM - 10:00 AM**: Primary Subject deep dive (Focus on conceptual fundamentals).
- **02:00 PM - 04:00 PM**: Problem-solving & assignment review.
- **07:00 PM - 08:00 PM**: 15-minute active recall summary.

### **Tuesday - Practical Application & Projects**
- **09:00 AM - 11:30 AM**: Applied lab work / technical practice.
- **03:00 PM - 05:00 PM**: Secondary Subject exploration.
- **08:00 PM - 09:00 PM**: Review notes & update goal tracker.

### **Wednesday - High-Yield Review & Synthesis**
- **08:30 AM - 11:30 AM**: Practice exam papers & mock test simulations.
- **04:00 PM - 06:00 PM**: Group discussion or peer teaching session.
- **08:30 PM - 09:30 PM**: Error logging & weak area identification.

### **Thursday - Specialized Electives & Advanced Topics**
- **09:00 AM - 12:00 PM**: Advanced coursework reading & research.
- **03:00 PM - 05:30 PM**: Career skills & portfolio building.
- **08:00 PM - 09:00 PM**: Reflective journaling on weekly progress.

### **Friday - Full Synthesis & Checkpoint Verification**
- **08:00 AM - 11:00 AM**: Comprehensive weekly syllabus wrap-up.
- **02:00 PM - 05:00 PM**: Capstone project iteration / milestone verification.
- **07:00 PM - 08:30 PM**: Light review and weekend planning.

### **Weekend - Spaced Repetition & Strategic Rest**
- **Saturday Morning**: 2-hour intensive revision slot (Flashcards & summaries).
- **Sunday**: Full recharge & review of upcoming week's checkpoints.

---

## 🎯 Key Checkpoints & Revision Slots
- **Checkpoint 1 (Wed 11:30 AM)**: 80% accuracy in mid-week practice questions.
- **Checkpoint 2 (Fri 05:00 PM)**: Completion of all weekly task deliverables.
- **Revision Strategy**: Utilize 25-minute Pomodoro cycles with 5-minute strategic micro-breaks.`;
      } else if (lastMsg.includes('career') || lastMsg.includes('job') || lastMsg.includes('future') || lastMsg.includes('scope') || lastMsg.includes('explore') || lastMsg.includes('path')) {
        mockReply = `# 🚀 AI Career Guidance & Market Roadmap (2026 Edition)

Navigating the modern career landscape requires combining core technical fundamentals with high-leverage emerging skills. Here is a comprehensive overview tailored for ambitious students in India and globally:

---

## 📈 Top High-Growth Sectors & Salary Trends

### 1. **Artificial Intelligence & Data Science**
- **Roles**: AI Engineer, Machine Learning Specialist, Data Architect, Prompt Engineer.
- **Expected Salary**: ₹12 LPA – ₹35+ LPA (Freshers/Mid-level).
- **Key Skills**: Python, PyTorch/TensorFlow, LLM Integration, Vector Databases, SQL.
- **Market Demand**: Extremely High (+45% YoY growth).

### 2. **Full-Stack & Cloud Engineering**
- **Roles**: Cloud Architect, DevOps Engineer, Full-Stack Developer.
- **Expected Salary**: ₹8 LPA – ₹25+ LPA.
- **Key Skills**: React/Next.js, Node.js, AWS/GCP/Azure, Docker, Kubernetes, CI/CD.
- **Market Demand**: Consistently Strong.

### 3. **Management, Product & Strategy**
- **Roles**: Product Manager (PM), Business Analyst, Strategy Consultant.
- **Expected Salary**: ₹10 LPA – ₹28+ LPA.
- **Key Skills**: Product Sense, Agile/Scrum, Data Analytics, Wireframing, Strategic Communication.
- **Market Demand**: High in Tech & FinTech.

### 4. **Finance, FinTech & Quant**
- **Roles**: Quantitative Analyst, Financial Risk Manager, Blockchain Specialist.
- **Expected Salary**: ₹12 LPA – ₹30+ LPA.
- **Key Skills**: Financial Modeling, Python, Risk Management, Blockchain fundamentals.

---

## 🎯 Actionable 3-Step Success Roadmap
1. **Build Proof of Work**: Move beyond basic certificates. Build 2-3 real-world projects or case studies that solve actual problems and host them publicly.
2. **Upskill in AI Tools**: Regardless of your field (Engineering, Commerce, Design, or Arts), master how generative AI tools can multiply your productivity.
3. **Optimized Networking**: Reach out to alumni and industry leaders on LinkedIn with specific, thoughtful questions regarding their projects.

*Need deeper insights into a specific career like Medical, Law, Design, or Defense? Tell me your exact interest and I will give you a specialized breakdown!*`;
      } else if (lastMsg.includes('skill') || lastMsg.includes('course') || lastMsg.includes('learn') || lastMsg.includes('upskill') || lastMsg.includes('certificat')) {
        mockReply = `# 🎯 Strategic Skill Acquisition & Certification Guide

To stand out in the 2026 job market, you need a balanced portfolio of **Core Technical Competencies** and **High-Impact Soft Skills**. Here is your optimal upskilling strategy:

---

## 💡 Top Recommended Skill Stacks

### 1. **Tech & Automation Stack**
- **Primary Skills**: Python programming, Cloud Computing (AWS/GCP), Git & GitHub, SQL.
- **Best Platforms**: Coursera, Udemy, edX, Official AWS/Google Skill Builder.
- **Strategic Advantage**: Makes you adaptable to any technical or analytics role.

### 2. **Design & Communication Stack**
- **Primary Skills**: UI/UX Design (Figma), Professional Presentation, Technical Writing, Design Thinking.
- **Best Platforms**: Google Design Certificates, Interaction Design Foundation.
- **Strategic Advantage**: Extremely valuable in Product Management and client-facing roles.

### 3. **Business & Management Stack**
- **Primary Skills**: Data Visualization (PowerBI/Tableau), Project Management (Agile/Scrum), Digital Marketing.
- **Best Platforms**: Google Project Management Certificate, HubSpot Academy.

---

## 🚀 30-Day Execution Challenge
- **Week 1**: Choose ONE specific skill and learn the foundational concepts (20 hours of focused study).
- **Week 2-3**: Build a hands-on project applying what you learned. Do not just watch tutorials—build independently!
- **Week 4**: Publish your project on GitHub, LinkedIn, or a personal portfolio website and ask peers for feedback.`;
      } else if (lastMsg.includes('interview') || lastMsg.includes('resume') || lastMsg.includes('cv') || lastMsg.includes('hr') || lastMsg.includes('salary') || lastMsg.includes('negotiat')) {
        mockReply = `# 💼 Masterclass: Resume Optimization & Interview Mastery

Landing your dream role requires treating your application like a professional product pitch. Here is how to optimize your resume and win your interviews:

---

## 📄 Resume Optimization (Beating the ATS)
1. **Action-Result Framing**: Never just list job duties. Use the formula: *[Action Word] + [What You Did] + [Impact/Number]*.
   - *Weak*: "Worked on a database project."
   - *Powerful*: "Designed and optimized a relational database using PostgreSQL, reducing query latency by 35% for 10,000+ users."
2. **Clear Typography & Layout**: Use a single-column, clean layout without complex tables or graphics so Applicant Tracking Systems (ATS) can parse it perfectly.
3. **Prominent Links**: Include live hyperlinks to your GitHub, LinkedIn, and Portfolio right under your name.

---

## 🎯 The 3-Part Interview Framework (PAST → PRESENT → PULL)
When asked *"Tell me about yourself"*, use this 90-second framework:
- **PAST**: Share your academic foundation and one key experience that sparked your passion.
- **PRESENT**: Highlight your current top skills, recent achievements, or capstone projects.
- **PULL**: Conclude with exactly why this specific company and role aligns perfectly with your goals.

### 💡 Golden Rule for Salary Negotiation
Never state a number first. Ask: *"Could you share the budgeted salary range for this position?"* Once they provide the range, negotiate based on the total value you bring to the team.`;
      } else if (lastMsg.includes('hello') || lastMsg.includes('hi') || lastMsg.includes('hey') || lastMsg.includes('help') || lastMsg.includes('start') || lastMsg.includes('who are you')) {
        mockReply = `# 👋 Welcome to Digital Twin Verse AI Advisor!

I am your elite **AI Career Expert, Senior Academic Counselor, and Growth Mentor**. I am designed to give you highly personalized, professionally researched guidance to accelerate your future.

---

## 🌟 How I Can Supercharge Your Journey Today:

### 1. 🚀 **Career Path Exploration**
Ask me about any career (AI, Software, Management, Medical, Finance, Design, Defense, Civil Services, etc.) and I will provide you with market demand, salary trends, and a step-by-step roadmap.

### 2. 📅 **Custom Study Plans & Timetables**
Tell me your current grade/college year and subject goals, and I will instantly generate a premium weekly study routine optimized with Pomodoro cycles and active recall checkpoints.

### 3. 🎯 **Skill Verification & Upskilling**
Ask me what skills or certifications are leading the 2026 market in your chosen domain, and I will give you a strategic learning stack.

### 4. 💼 **Resume & Interview Mastery**
Get actionable frameworks to optimize your resume, pass ATS filters, answer tricky HR questions, and negotiate high salary packages.

---

**💬 Tip:** *Simply type what you want to explore (e.g., "Give me a career roadmap for AI Engineering", "Create a weekly study plan for final year exams", or "How to improve my resume") to begin!*`;
      } else {
        mockReply = `# 💡 Digital Twin Verse AI Advisor Insights

Thank you for your question! As your elite **AI Career Mentor & Academic Counselor**, I have analyzed your query within the context of modern career growth and student success.

---

## 🔍 Strategic Recommendation & Action Steps

### 1. **Focus on Core Fundamentals**
To master this area, ensure you have a deep conceptual grasp of the underlying principles before jumping into advanced applications. Build a solid theoretical and practical foundation.

### 2. **Iterative Hands-On Practice**
The most effective way to gain confidence is through active application. Break your goal down into small, manageable daily milestones and track your progress consistently.

### 3. **Leverage Expert Frameworks**
Seek out mentors, peer groups, or verified online documentation that provides proven frameworks for success in this specific domain.

---

**🎯 Next Step:** *To give you the most tailored, high-precision advice, let me know if you would like to focus this around a **specific career path**, a **custom study plan**, or **interview & resume preparation**!*`;
      }

      return {
        status: 200,
        data: {
          content: [{ type: 'text', text: mockReply }],
          model: 'digital-twin-ai-advisor-elite'
        }
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(function() {
      controller.abort();
    }, AI_TIMEOUT_MS);

    let upstream = null;

    if (provider === 'gemini') {
      upstream = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          generationConfig: { maxOutputTokens: maxTokens }
        })
      });
    } else if (provider === 'groq') {
      upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: env.OPENAI_MODEL || 'llama3-8b-8192',
          max_tokens: maxTokens,
          messages: toOpenAIMessages(system, messages)
        })
      });
    } else if (provider === 'anthropic') {
      upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
          max_tokens: maxTokens,
          system: system,
          messages: messages
        })
      });
    } else {
      upstream = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: env.OPENAI_MODEL || 'gpt-4o-mini',
          max_tokens: maxTokens,
          messages: toOpenAIMessages(system, messages)
        })
      });
    }

    clearTimeout(timeout);
    const text = await upstream.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      parsed = { error: 'Upstream returned non-JSON response.' };
    }

    if (!upstream.ok) {
      return { error: parsed && parsed.error ? parsed.error.message || parsed.error : 'AI request failed.', status: upstream.status };
    }

    if (provider === 'gemini') {
      const textVal = parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts && parsed.candidates[0].content.parts[0] ? parsed.candidates[0].content.parts[0].text : '';
      return {
        status: 200,
        data: {
          content: [{ type: 'text', text: textVal || 'I received your message but could not generate a response. Please try again.' }],
          model: 'gemini-1.5-flash'
        }
      };
    }

    if (provider === 'openai' || provider === 'groq') {
      return {
        status: 200,
        data: {
          content: [{ type: 'text', text: extractOpenAIText(parsed) }],
          model: parsed.model || (provider === 'groq' ? 'llama3-8b-8192' : env.OPENAI_MODEL)
        }
      };
    }

    return { status: 200, data: parsed };
  } catch (err) {
    if (err && err.name === 'AbortError') {
      return { error: 'AI provider timeout. Please try again.', status: 504 };
    }
    return { error: 'Unexpected AI server error.', status: 500 };
  }
}

module.exports = {
  sendMessages,
  resolveProvider
};

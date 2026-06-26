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
  const anthropicKey = env.ANTHROPIC_API_KEY;
  const openaiKey = env.OPENAI_API_KEY;
  const hasAnthropic = !isPlaceholderKey(anthropicKey);
  const hasOpenAI = !isPlaceholderKey(openaiKey);

  if (env.AI_PROVIDER === 'anthropic') {
    return hasAnthropic ? { provider: 'anthropic', key: anthropicKey } : { error: 'AI_PROVIDER is anthropic but ANTHROPIC_API_KEY is missing or placeholder.' };
  }

  if (env.AI_PROVIDER === 'openai') {
    return hasOpenAI ? { provider: 'openai', key: openaiKey } : { error: 'AI_PROVIDER is openai but OPENAI_API_KEY is missing or placeholder.' };
  }

  if (hasAnthropic) {
    return { provider: 'anthropic', key: anthropicKey };
  }

  if (hasOpenAI) {
    return { provider: 'openai', key: openaiKey };
  }

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
    const maxTokens = Math.min(1200, Math.max(128, Number(payload.max_tokens || 900)));

    if (!messages.length) {
      return { error: 'Request must include at least one non-empty message.', status: 400 };
    }

    const provider = providerConfig.provider;
    const apiKey = providerConfig.key;

    if (provider === 'mock') {
      const lastMsg = messages[messages.length - 1] ? messages[messages.length - 1].content : '';
      const isStudyPlan = lastMsg.toLowerCase().includes('study plan') || lastMsg.toLowerCase().includes('weekly') || lastMsg.toLowerCase().includes('routine');
      const mockReply = isStudyPlan ? 
`# 🌟 Your AI-Generated Weekly Study Plan & Career Journey

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
- **Revision Strategy**: Utilize 25-minute Pomodoro cycles with 5-minute strategic micro-breaks.

*Note: This premium study plan was generated via Digital Twin Verse AI Advisor mock engine. To connect live Anthropic/OpenAI models, add your API keys in the .env file!*`
        : `👋 Hello! I am your Digital Twin Verse AI Advisor. I'm here to help you simulate your career journey, optimize your study routines, and answer your academic queries. (To enable live OpenAI/Anthropic responses, configure your API keys in the .env file!)`;

      return {
        status: 200,
        data: {
          content: [{ type: 'text', text: mockReply }],
          model: 'digital-twin-ai-advisor-mock'
        }
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(function() {
      controller.abort();
    }, AI_TIMEOUT_MS);

    let upstream = null;

    if (provider === 'anthropic') {
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

    if (provider === 'openai') {
      return {
        status: 200,
        data: {
          content: [{ type: 'text', text: extractOpenAIText(parsed) }],
          model: parsed.model || env.OPENAI_MODEL
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

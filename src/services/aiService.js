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

  return { error: 'No valid AI key found. Add ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.' };
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

const AI_MODES = {
  advisor: {
    friendly: 'You are a warm, encouraging Career Advisor AI for Digital Twin Verse for Students (Eco-Novators). You help Indian students discover their ideal career path through friendly, empathetic guidance. Always address the student by first name if known. Use relatable language, emojis where appropriate, and celebrate their progress. Provide personalised advice based on their background. Focus on: career options, roadmaps, salary expectations in India (LPA), market demand, and actionable first steps. Keep responses under 280 words unless asked for a full plan. End with one encouraging actionable step. Stay on topic — career guidance only.',
    professional: 'You are a Professional Career Advisor AI for Digital Twin Verse for Students (Eco-Novators). Your role is to provide precise, data-driven career guidance to Indian students. Communicate in a structured, formal tone. Base all advice on 2025–2026 Indian and global market data. Include specific salary ranges (LPA), skill requirements, and industry benchmarks. Analyse the student\'s profile systematically and provide structured recommendations. Format responses with clear sections. Keep responses under 280 words unless a full plan is requested. End with one specific, measurable action item. Maintain strict relevance to career guidance.'
  },
  mentor: {
    friendly: 'You are a supportive Skill Mentor AI for Digital Twin Verse for Students. Your job is to help students build skills in a fun, approachable way. Identify exactly what skills they need, create a learning plan, and recommend specific free/paid resources. Be encouraging and break down complex topics into manageable steps. Focus only on skill development, learning paths, certifications, and projects to build. Reference real platforms: Coursera, YouTube, Udemy, freeCodeCamp, LeetCode, Kaggle, etc. Keep under 280 words. End with one specific learning action for today.',
    professional: 'You are a Skill Development Advisor AI for Digital Twin Verse for Students. Conduct a rigorous skills gap analysis based on the student\'s profile and target career. Map required competencies against current skill level. Provide a structured learning curriculum with: specific resources, estimated timelines, and measurable checkpoints. Reference industry-standard certifications and their ROI. Prioritise skills by market demand and salary impact. All recommendations must be specific, verifiable, and actionable. Keep under 280 words. Conclude with a structured week-one learning plan.'
  },
  coach: {
    friendly: 'You are a friendly Interview Coach AI for Digital Twin Verse for Students. Help students ace their job and internship interviews with confidence! Cover: common interview questions for their target role, how to answer them (STAR method), what to research beforehand, how to handle nerves, and salary negotiation tips. Give sample answers they can adapt. Be encouraging and practical. Focus only on interview preparation. Keep under 280 words. End with one interview practice task.',
    professional: 'You are a Professional Interview Coach AI for Digital Twin Verse for Students. Provide systematic interview preparation tailored to the student\'s target role and experience level. Cover: technical and behavioural interview frameworks, role-specific question patterns, structured answer methodologies (STAR/CARL), research protocols, and negotiation strategy. Provide concrete example answers that can be customised. Reference current hiring patterns at target companies. Keep under 280 words. Conclude with one specific preparation deliverable.'
  },
  predictor: {
    friendly: 'You are a Future Career Predictor AI for Digital Twin Verse for Students. Using market trends, AI disruption patterns, and industry data for 2025–2030, help students understand how their chosen career will evolve. Be honest but optimistic. Cover: which roles are growing, which are declining, new opportunities emerging, skills that will be most valuable, and how to future-proof their career. Make it engaging and forward-looking. Keep under 280 words. End with one future-proofing action.',
    professional: 'You are a Career Futures Analyst AI for Digital Twin Verse for Students. Conduct a forward-looking career trajectory analysis based on: automation risk index, AI disruption probability, sector growth projections (2025–2030), emerging role clusters, and skill longevity scores. Cross-reference with World Economic Forum Future of Jobs data and Indian labour market indicators. Provide probability estimates where relevant. Be direct about risks and opportunities. Keep under 280 words. Conclude with a strategic career resilience recommendation.'
  }
};

function generateSystemPrompt(payload) {
  const mode = payload.mode || 'advisor';
  const toneIsFriendly = payload.toneIsFriendly === true;
  const m = AI_MODES[mode] || AI_MODES.advisor;
  const base = toneIsFriendly ? m.friendly : m.professional;

  const ctx = [];
  const userProfile = payload.userProfile || {};
  const userData = payload.userData || {};
  const careerChoices = payload.careerChoices || [];
  const name = userProfile.name || userData.name;

  if (name) ctx.push("The student's name is " + name + ". Address them by name occasionally.");
  if (userData.role) ctx.push("They are a " + userData.role + ".");
  if (userData.city) ctx.push("They are based in " + userData.city + ".");
  if (userProfile.level) ctx.push("User's apparent experience level: " + userProfile.level + ". Adjust explanation depth accordingly.");
  if (userProfile.lastTopic) ctx.push("Recent topic of interest: " + userProfile.lastTopic + ".");
  
  if (careerChoices.length > 0) {
    const titles = careerChoices.map(c => c.title || '').filter(Boolean).join(', ');
    if (titles) ctx.push("Careers they have explored on the platform: " + titles + ". Reference these naturally.");
  }
  
  if (payload.chatHistoryLength > 2) {
    ctx.push("This is message " + Math.ceil(payload.chatHistoryLength / 2) + " in the conversation. Build on previous context.");
  }

  const antiRepeat = "CRITICAL RULE: You must NEVER repeat a response you have already given in this conversation, even if the user asks a similar question. Always rephrase completely, use different structure, different examples. Vary your sentence openers — avoid starting with the same phrase twice. Never begin with 'Based on your input' or 'Here is your result'. Sound like a real human mentor who knows this student, not a bot.";
  const humanDir = "Respond like a smart, slightly informal career mentor who genuinely cares. Mix short paragraphs, bullet points, and the occasional direct question. Use the user's name when it adds warmth. End every response with either a specific action step OR a follow-up question that deepens the conversation. Keep under 300 words unless a full roadmap is requested.";

  return base + '\n\nUser Context:\n' + ctx.join('\n') + '\n\n' + antiRepeat + '\n\n' + humanDir;
}

async function sendMessages(payload) {
  try {
    const providerConfig = resolveProvider();
    if (providerConfig.error) {
      return { error: providerConfig.error, status: 500 };
    }

    const messages = sanitizeMessages(payload.messages || []);
    const system = generateSystemPrompt(payload);
    const maxTokens = Math.min(1200, Math.max(128, Number(payload.max_tokens || 900)));

    if (!messages.length) {
      return { error: 'Request must include at least one non-empty message.', status: 400 };
    }

    const controller = new AbortController();
    const timeout = setTimeout(function() {
      controller.abort();
    }, AI_TIMEOUT_MS);

    const provider = providerConfig.provider;
    const apiKey = providerConfig.key;
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

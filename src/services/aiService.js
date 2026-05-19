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

// AI Ads Assistant
// - Hoạt động cả khi CHƯA cấu hình API key (dùng rule-based fallback).
// - Khi có API key: gọi LLM (OpenAI hoặc Gemini) để làm giàu kết quả.
//
// Cấu hình qua biến môi trường:
//   AI_PROVIDER = openai | gemini            (mặc định: openai)
//   AI_API_KEY  = <api key>                  (nếu trống -> chỉ dùng rule-based)
//   AI_MODEL    = model tùy chọn             (mặc định theo provider)

const AI_PROVIDER = String(process.env.AI_PROVIDER || 'openai').trim().toLowerCase();
const AI_API_KEY = String(process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
const AI_MODEL = String(process.env.AI_MODEL || '').trim();

const DEFAULT_MODELS = {
  openai: 'gpt-4o-mini',
  gemini: 'gemini-1.5-flash'
};

// Nguyên tắc bắt buộc cho MỌI câu trả lời của AI (chống bịa / chống hứa hẹn).
const ANTI_HALLUCINATION = [
  'NGUYÊN TẮC BẮT BUỘC:',
  '- Không được đoán. Nếu thiếu dữ liệu để trả lời chính xác, hãy nói rõ: "Tôi cần thêm: ..." và liệt kê thông tin còn thiếu.',
  '- Không khẳng định chắc chắn kết quả (KHÔNG hứa "chắc chắn ra lead/đơn", "chắc chắn hiệu quả").',
  '- Chỉ đưa ra gợi ý và giải thích lý do. Quyết định cuối cùng thuộc về người dùng.',
  '- Nếu không chắc, hãy nói "Tôi không chắc" thay vì bịa.'
].join('\n');

function withGuardrails(system) {
  return `${ANTI_HALLUCINATION}\n\n${system || 'Bạn là trợ lý hữu ích.'}`;
}

export function isAiConfigured() {
  return Boolean(AI_API_KEY);
}

export function getAiInfo() {
  return {
    configured: isAiConfigured(),
    provider: AI_PROVIDER,
    model: AI_MODEL || DEFAULT_MODELS[AI_PROVIDER] || DEFAULT_MODELS.openai
  };
}

async function callOpenAI({ system, user, maxTokens = 700, temperature = 0.6 }) {
  const model = AI_MODEL || DEFAULT_MODELS.openai;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system || 'You are a helpful assistant.' },
        { role: 'user', content: user || '' }
      ]
    })
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data?.error?.message || 'OpenAI request failed');
  }
  return data?.choices?.[0]?.message?.content?.trim() || '';
}

async function callGemini({ system, user, maxTokens = 700, temperature = 0.6 }) {
  const model = AI_MODEL || DEFAULT_MODELS.gemini;
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent` +
    `?key=${encodeURIComponent(AI_API_KEY)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${system ? system + '\n\n' : ''}${user || ''}` }]
        }
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens
      }
    })
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data?.error?.message || 'Gemini request failed');
  }

  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => p?.text || '').join('').trim();
}

export async function callLLM({ system, user, maxTokens, temperature } = {}) {
  if (!isAiConfigured()) {
    throw new Error('AI chưa được cấu hình (thiếu AI_API_KEY).');
  }
  const guardedSystem = withGuardrails(system);
  if (AI_PROVIDER === 'gemini') {
    return callGemini({ system: guardedSystem, user, maxTokens, temperature });
  }
  return callOpenAI({ system: guardedSystem, user, maxTokens, temperature });
}

// ---------------------------------------------------------------------------
// Rule-based: giải thích các trường (chạy được kể cả khi không có API key)
// ---------------------------------------------------------------------------

const FIELD_EXPLANATIONS = {
  campaign_type: {
    title: 'Loại chiến dịch',
    definition:
      'Quyết định cách quảng cáo thu khách: "Tin nhắn (Messenger)" để khách nhắn tin, hoặc "Thu lead (Lead Form)" để khách điền form thông tin ngay trên Facebook.',
    whenToUse:
      'Chọn Lead Form khi cần thu số điện thoại/email (VD bất động sản, bảo hiểm). Chọn Messenger khi muốn tư vấn trực tiếp qua chat.',
    example: 'BĐS thu thông tin khách quan tâm dự án → chọn Thu lead (Lead Form).',
    commonMistakes: 'Chọn Messenger nhưng lại kỳ vọng có sẵn danh sách SĐT — Messenger chỉ ra hội thoại chat.'
  },
  objective: {
    title: 'Objective (Mục tiêu chiến dịch)',
    definition:
      'Mục tiêu tổng thể bạn muốn Facebook tối ưu, ví dụ tương tác, tin nhắn, hay thu lead.',
    whenToUse:
      'OUTCOME_LEADS khi muốn thu thông tin khách; OUTCOME_ENGAGEMENT khi muốn tương tác/tin nhắn.',
    example: 'Thu form khách quan tâm căn hộ → OUTCOME_LEADS.',
    commonMistakes: 'Chọn sai objective khiến Facebook tối ưu nhầm nhóm người, lead không chất lượng.'
  },
  daily_budget: {
    title: 'Budget (Ngân sách/ngày)',
    definition:
      'Số tiền tối đa chi cho mỗi nhóm quảng cáo trong 1 ngày.',
    whenToUse:
      'Tài khoản mới nên bắt đầu nhỏ để thu dữ liệu, sau đó tăng dần khi thấy hiệu quả.',
    example: 'Tài khoản VND có thể test 100.000–200.000đ/ngày trước khi scale.',
    commonMistakes: 'Đặt quá thấp khiến Facebook không đủ phân phối; hoặc tăng ngân sách đột ngột làm loạn tối ưu.'
  },
  optimization_goal: {
    title: 'Optimization Goal (Mục tiêu tối ưu)',
    definition:
      'Chỉ cho Facebook biết cần tối ưu để đạt hành động nào (tin nhắn, lead, click...).',
    whenToUse:
      'LEAD_GENERATION cho Lead Form; CONVERSATIONS cho quảng cáo tin nhắn.',
    example: 'Chạy Lead Form BĐS → LEAD_GENERATION.',
    commonMistakes: 'Đặt optimization không khớp với loại quảng cáo → phân phối kém.'
  },
  bid_strategy: {
    title: 'Bid Strategy (Chiến lược giá thầu)',
    definition:
      'Cách Facebook đặt giá thầu để lấy kết quả: chi phí thấp nhất, giới hạn giá thầu, hoặc mục tiêu chi phí.',
    whenToUse:
      'Người mới nên dùng "Lowest cost" (chi phí thấp nhất) để đơn giản.',
    example: 'Mới chạy, chưa có dữ liệu → Lowest cost without cap.',
    commonMistakes: 'Đặt bid cap quá thấp khiến quảng cáo không tiêu được tiền/không phân phối.'
  },
  targeting: {
    title: 'Khu vực target',
    definition:
      'Vùng địa lý (tọa độ + bán kính) mà quảng cáo sẽ hiển thị.',
    whenToUse:
      'BĐS nên target quanh dự án (VD bán kính 5–15km) để tiếp cận người ở gần.',
    example: 'Dự án ở Đà Nẵng → nhập tọa độ dự án, bán kính 10km.',
    commonMistakes: 'Target quá rộng (cả nước) làm loãng, lead không đúng khu vực.'
  },
  lead_form: {
    title: 'Lead Form ID',
    definition:
      'ID của biểu mẫu thu thông tin (Instant Form) đã tạo sẵn trên Page.',
    whenToUse:
      'Bắt buộc khi chạy chiến dịch Thu lead. Mỗi Page có form riêng.',
    example: 'Tạo form "Đăng ký nhận bảng giá" trên Page → lấy Form ID điền vào.',
    commonMistakes: 'Dùng chung 1 form ID cho nhiều Page khác nhau → lỗi vì form thuộc về Page cụ thể.'
  },
  pixel: {
    title: 'Pixel',
    definition:
      'Đoạn mã theo dõi hành vi trên website để tối ưu và đo chuyển đổi.',
    whenToUse:
      'Khi có website và muốn tối ưu theo hành động trên site (mua, đăng ký).',
    example: 'Landing page bán căn hộ → gắn Pixel để đo form submit.',
    commonMistakes: 'Chạy chuyển đổi website mà chưa gắn Pixel → không tối ưu được.'
  },
  attribution: {
    title: 'Attribution (Cửa sổ phân bổ)',
    definition:
      'Khoảng thời gian tính công cho quảng cáo khi có chuyển đổi (VD click trong 7 ngày).',
    whenToUse:
      'Giữ mặc định cho người mới; điều chỉnh khi hiểu hành vi khách.',
    example: '7-day click, 1-day view là mức phổ biến.',
    commonMistakes: 'So sánh số liệu giữa các cửa sổ khác nhau rồi kết luận sai.'
  },
  advantage_audience: {
    title: 'Advantage+ Audience',
    definition:
      'Chế độ để Facebook tự mở rộng đối tượng bằng AI thay vì bạn giới hạn cứng.',
    whenToUse:
      'Khi muốn Facebook tự tìm khách tiềm năng ngoài tệp bạn đặt.',
    example: 'Không chắc interest nào tốt → để Advantage+ tự tối ưu.',
    commonMistakes: 'Dùng Advantage+ nhưng vẫn giới hạn quá chặt khiến mất tác dụng.'
  }
};

const FIELD_ALIASES = {
  budget: 'daily_budget',
  dailybudget: 'daily_budget',
  campaigntype: 'campaign_type',
  loaichiendich: 'campaign_type',
  muctieu: 'objective',
  optimization: 'optimization_goal',
  optimizationgoal: 'optimization_goal',
  bidstrategy: 'bid_strategy',
  target: 'targeting',
  khuvuc: 'targeting',
  leadform: 'lead_form',
  leadformid: 'lead_form'
};

function normalizeFieldKey(field) {
  const raw = String(field || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (FIELD_EXPLANATIONS[raw]) return raw;
  const compact = raw.replace(/_/g, '');
  return FIELD_ALIASES[compact] || raw;
}

export async function explainField({ field }) {
  const key = normalizeFieldKey(field);
  const dict = FIELD_EXPLANATIONS[key];

  if (dict) {
    return { ok: true, source: 'rule', field: key, explanation: dict };
  }

  if (isAiConfigured()) {
    const text = await callLLM({
      system:
        'Bạn là chuyên gia quảng cáo Facebook, giải thích ngắn gọn, dễ hiểu bằng tiếng Việt cho người mới. Không cam kết kết quả chắc chắn.',
      user:
        `Giải thích trường/khái niệm quảng cáo Facebook: "${field}". ` +
        'Trả về 4 mục ngắn: Định nghĩa, Khi nào dùng, Ví dụ thực tế, Lỗi người mới hay mắc.',
      maxTokens: 500
    });
    return {
      ok: true,
      source: 'ai',
      field: key,
      explanation: { title: String(field), freeText: text }
    };
  }

  return {
    ok: false,
    source: 'none',
    field: key,
    error: 'Chưa có giải thích cho trường này và AI chưa được cấu hình.'
  };
}

// ---------------------------------------------------------------------------
// Rule-based: review campaign trước khi publish
// ---------------------------------------------------------------------------

export async function reviewCampaign(config = {}) {
  const {
    campaignType = 'messenger',
    dailyBudget,
    leadFormId,
    objective,
    optimizationGoal,
    postId,
    targetLatitude,
    targetLongitude,
    targetRadiusKm,
    pageCount,
    hasPixel,
    hasUtm
  } = config;

  const isLeadForm = String(campaignType) === 'lead_form';
  const budget = Number(dailyBudget);
  const radius = Number(targetRadiusKm);
  const hasCustomLocation =
    Number.isFinite(Number(targetLatitude)) && Number.isFinite(Number(targetLongitude));

  let score = 100;
  const warnings = [];
  const goods = [];
  const priorities = [];

  const addPriority = (level, title, action) => priorities.push({ level, title, action });

  if (!Number.isFinite(budget) || budget <= 0) {
    warnings.push({ level: 'error', message: 'Chưa nhập ngân sách hợp lệ.' });
    addPriority('high', 'Ngân sách chưa hợp lệ', 'Nhập ngân sách/ngày > 0 trước khi chạy.');
    score -= 25;
  } else if (budget < 50000) {
    warnings.push({
      level: 'warn',
      message: 'Ngân sách hơi thấp (nếu tài khoản VND). Facebook có thể không đủ dữ liệu để tối ưu.'
    });
    addPriority('medium', 'Ngân sách thấp', 'Cân nhắc tăng ngân sách để đủ dữ liệu tối ưu (tùy tài khoản).');
    score -= 12;
  } else {
    goods.push('Ngân sách ở mức chạy được.');
  }

  if (isLeadForm && !leadFormId) {
    warnings.push({ level: 'error', message: 'Chiến dịch thu lead nhưng chưa có Lead Form ID.' });
    addPriority('high', 'Thiếu Lead Form', 'Nhập Lead Form ID (mỗi Page 1 form) trước khi chạy thu lead.');
    score -= 25;
  }

  if (isLeadForm && objective && objective !== 'OUTCOME_LEADS') {
    warnings.push({
      level: 'warn',
      message: `Objective "${objective}" không khớp chiến dịch thu lead (nên là OUTCOME_LEADS).`
    });
    addPriority('medium', 'Objective không khớp', 'Để trống objective (tự động) hoặc chọn OUTCOME_LEADS.');
    score -= 8;
  }

  if (!hasCustomLocation) {
    warnings.push({
      level: 'warn',
      message: 'Chưa đặt khu vực target — đang dùng khu vực mặc định. BĐS nên target đúng quanh dự án.'
    });
    addPriority('medium', 'Chưa đặt khu vực target', 'Nhập tọa độ dự án + bán kính để target đúng khu vực.');
    score -= 12;
  } else if (!Number.isFinite(radius) || radius <= 0) {
    warnings.push({ level: 'warn', message: 'Có tọa độ nhưng chưa đặt bán kính hợp lệ.' });
    addPriority('medium', 'Bán kính chưa hợp lệ', 'Đặt bán kính (km) hợp lệ, VD 5–15km.');
    score -= 6;
  } else if (radius > 50) {
    warnings.push({ level: 'warn', message: `Bán kính ${radius}km khá rộng, dễ loãng đối tượng.` });
    addPriority('low', 'Bán kính rộng', 'Cân nhắc thu hẹp bán kính để đối tượng tập trung hơn.');
    score -= 8;
  } else if (radius < 2) {
    warnings.push({ level: 'warn', message: `Bán kính ${radius}km khá hẹp, có thể ít người tiếp cận.` });
    addPriority('low', 'Bán kính hẹp', 'Cân nhắc mở rộng bán kính nếu tiếp cận quá ít.');
    score -= 4;
  } else {
    goods.push('Khu vực target hợp lý.');
  }

  if (!isLeadForm && !postId) {
    warnings.push({
      level: 'info',
      message: 'Chưa nhập Post ID — tool sẽ tự lấy bài viết mới nhất hợp lệ của Page.'
    });
    addPriority('low', 'Chưa chọn bài viết', 'Nhập Post ID nếu muốn chạy đúng bài, không thì tool tự lấy bài mới nhất.');
  }

  if (Number(pageCount) > 100) {
    warnings.push({
      level: 'info',
      message: `Đang chạy ${pageCount} Page — nên test vài Page trước khi chạy toàn bộ.`
    });
    addPriority('low', 'Chạy số lượng lớn', 'Test vài Page trước khi chạy toàn bộ danh sách.');
  }

  score = Math.max(0, Math.min(100, score));
  const grade = score >= 85 ? 'Tốt' : score >= 65 ? 'Khá' : score >= 45 ? 'Cần cải thiện' : 'Rủi ro cao';

  // Health bar (10 ô).
  const bar = { filled: Math.round(score / 10), total: 10 };

  // Checklist trạng thái: pass | fail | na | unknown.
  // Lưu ý: Pixel/UTM tool không quản lý trực tiếp -> 'unknown' để không bịa (đúng nguyên tắc).
  const checklist = [
    {
      key: 'budget',
      label: 'Ngân sách',
      status: Number.isFinite(budget) && budget > 0 ? (budget < 50000 ? 'warn' : 'pass') : 'fail'
    },
    {
      key: 'target',
      label: 'Khu vực target',
      status: hasCustomLocation && Number.isFinite(radius) && radius > 0 ? 'pass' : 'fail'
    },
    {
      key: 'lead_form',
      label: 'Lead Form',
      status: isLeadForm ? (leadFormId ? 'pass' : 'fail') : 'na'
    },
    {
      key: 'creative',
      label: 'Creative/Bài viết',
      status: isLeadForm ? 'pass' : postId ? 'pass' : 'na'
    },
    {
      key: 'cta',
      label: 'CTA',
      status: 'pass'
    },
    {
      key: 'pixel',
      label: 'Pixel',
      status: hasPixel === true ? 'pass' : hasPixel === false ? 'fail' : 'unknown'
    },
    {
      key: 'utm',
      label: 'UTM',
      status: hasUtm === true ? 'pass' : hasUtm === false ? 'fail' : 'unknown'
    }
  ];

  const priorityRank = { high: 0, medium: 1, low: 2 };
  priorities.sort((a, b) => (priorityRank[a.level] ?? 3) - (priorityRank[b.level] ?? 3));

  // Explain Why (rule-based, KHÔNG gọi AI).
  const EXPLAIN_BY_TITLE = {
    'Ngân sách chưa hợp lệ': 'Ngân sách phải lớn hơn 0 thì Facebook mới phân phối được quảng cáo.',
    'Ngân sách thấp': 'Ngân sách hiện tại có thể khiến hệ thống mất nhiều thời gian hơn để thu thập dữ liệu và thoát giai đoạn học.',
    'Thiếu Lead Form': 'Quảng cáo thu lead cần một biểu mẫu (Instant Form) trên Page để khách điền thông tin.',
    'Objective không khớp': 'Objective nên khớp với mục tiêu thu lead để Facebook tối ưu đúng nhóm người.',
    'Chưa đặt khu vực target': 'Nếu không đặt khu vực, quảng cáo dùng vùng mặc định, dễ tiếp cận sai người — nhất là BĐS theo dự án.',
    'Bán kính chưa hợp lệ': 'Cần bán kính hợp lệ để giới hạn vùng hiển thị quanh dự án.',
    'Bán kính rộng': 'Bán kính quá rộng làm đối tượng loãng, ngân sách bị trải mỏng.',
    'Bán kính hẹp': 'Bán kính quá hẹp có thể khiến ít người trong vùng, quảng cáo khó phân phối.',
    'Chưa chọn bài viết': 'Nếu không chỉ định bài, tool tự lấy bài mới nhất — có thể không phải bài bạn muốn.',
    'Chạy số lượng lớn': 'Chạy nhiều Page cùng lúc dễ nhân rộng lỗi; test trước giúp phát hiện sớm.'
  };
  const EXPLAIN_DISCLAIMER = 'Đây là gợi ý chung, không phải kết luận chắc chắn.';
  for (const p of priorities) {
    const base = EXPLAIN_BY_TITLE[p.title] || p.action || '';
    p.explain = `${base}\n\n${EXPLAIN_DISCLAIMER}`;
  }

  // Confidence: review đang dựa trên bao nhiêu dữ liệu (rule-based).
  const metrics = config.metrics || {};
  const confidenceSignals = [
    { ok: Number.isFinite(budget) && budget > 0, label: 'Ngân sách' },
    { ok: hasCustomLocation, label: 'Khu vực target' },
    { ok: Number.isFinite(radius) && radius > 0, label: 'Bán kính' },
    { ok: isLeadForm ? Boolean(leadFormId) : Boolean(postId), label: 'Creative/Bài viết' },
    { ok: Boolean(objective || optimizationGoal), label: 'Objective/Optimization' },
    { ok: Number.isFinite(Number(metrics.ctr)), label: 'CTR' },
    { ok: Number.isFinite(Number(metrics.cpl)), label: 'CPL' },
    { ok: Number.isFinite(Number(metrics.spend)), label: 'Spend' }
  ];
  const confidencePresent = confidenceSignals.filter((s) => s.ok).length;
  const confidencePercent = Math.round((confidencePresent / confidenceSignals.length) * 100);
  const confidenceReasons = confidenceSignals
    .filter((s) => !s.ok)
    .map((s) => `Thiếu ${s.label}`);

  const confidence = {
    percent: confidencePercent,
    reasons: confidenceReasons,
    note:
      'Confidence phản ánh lượng dữ liệu đang có. Số liệu hiệu quả (CTR/CPL/Spend) chỉ có sau khi chạy, nên trước khi publish Confidence thường thấp — điều này bình thường.'
  };

  const result = {
    ok: true,
    score,
    grade,
    bar,
    confidence,
    priorities,
    checklist,
    warnings,
    goods,
    aiSummary: null
  };

  if (isAiConfigured()) {
    try {
      const summary = await callLLM({
        system:
          'Bạn là chuyên gia tối ưu quảng cáo Facebook. Đưa ra nhận xét ngắn gọn, thực tế bằng tiếng Việt. Chỉ gợi ý, KHÔNG cam kết kết quả chắc chắn.',
        user:
          'Dưới đây là cấu hình chiến dịch (JSON). Nhận xét ngắn 3-5 gạch đầu dòng: điểm cần cải thiện và vì sao. ' +
          'Không hứa chắc chắn ra lead.\n\n' +
          JSON.stringify(
            { campaignType, dailyBudget, leadFormId: leadFormId ? 'có' : 'không', objective, optimizationGoal, hasCustomLocation, targetRadiusKm, pageCount },
            null,
            2
          ),
        maxTokens: 400
      });
      result.aiSummary = summary || null;
    } catch (err) {
      result.aiSummary = null;
      result.aiError = err.message || 'AI enrich failed';
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Các tính năng cần LLM: suggest target, content, analyze report, chat
// ---------------------------------------------------------------------------

export async function suggestTarget({ industry = '', location = '', note = '' }) {
  if (!isAiConfigured()) {
    return {
      ok: false,
      error: 'Tính năng gợi ý target cần cấu hình AI (AI_API_KEY).'
    };
  }

  const text = await callLLM({
    system:
      'Bạn là chuyên gia target quảng cáo Facebook tại Việt Nam. ' +
      'KHÔNG đưa ra một "target đúng" duy nhất (dễ chung chung và không ai đảm bảo). ' +
      'Thay vào đó, đưa ra CÁC PHƯƠNG ÁN để người dùng A/B test.',
    user:
      `Ngành/sản phẩm: ${industry || '(chưa rõ)'}\nKhu vực: ${location || '(chưa rõ)'}\nGhi chú: ${note || 'không'}\n\n` +
      'Đưa ra 3 phương án target để A/B test, trình bày đúng định dạng:\n' +
      'Option A — Lookalike: (mô tả ngắn, gồm độ tuổi/giới tính/khu vực gợi ý)\n' +
      'Option B — Interest: (các nhóm sở thích/hành vi cụ thể để thử)\n' +
      'Option C — Broad: (để Facebook tự tối ưu, kèm lưu ý)\n\n' +
      'Cuối cùng ghi rõ: "Hãy A/B test các phương án trên rồi giữ lại phương án ra kết quả tốt nhất." ' +
      'Nếu thiếu thông tin ngành/khu vực, hãy nói cần bổ sung gì trước.',
    maxTokens: 700
  });

  return { ok: true, source: 'ai', suggestion: text };
}

export async function generateContent({ product = '', tone = 'chuyên nghiệp', extra = '' }) {
  if (!isAiConfigured()) {
    return {
      ok: false,
      error: 'Tính năng viết content cần cấu hình AI (AI_API_KEY).'
    };
  }

  const text = await callLLM({
    system:
      'Bạn là copywriter quảng cáo Facebook tiếng Việt. Viết hấp dẫn, đúng chính sách Facebook, không phóng đại sai sự thật.',
    user:
      `Sản phẩm/dịch vụ: ${product}\nGiọng văn: ${tone}\nYêu cầu thêm: ${extra || 'không'}\n\n` +
      'Viết 1 bộ nội dung quảng cáo gồm: Primary Text (2-3 câu), Headline (ngắn), Description (ngắn), CTA gợi ý. ' +
      'Có thể đề xuất 2 phương án.',
    maxTokens: 700
  });

  return { ok: true, source: 'ai', content: text };
}

export async function analyzeReport({ metrics = {}, note = '' }) {
  if (!isAiConfigured()) {
    return {
      ok: false,
      error: 'Tính năng phân tích báo cáo cần cấu hình AI (AI_API_KEY).'
    };
  }

  const text = await callLLM({
    system:
      'Bạn là chuyên gia phân tích hiệu quả quảng cáo Facebook. Phân tích dựa trên số liệu, đưa gợi ý hành động. Chỉ gợi ý, không cam kết kết quả.',
    user:
      'Số liệu chiến dịch (JSON):\n' +
      JSON.stringify(metrics, null, 2) +
      `\nGhi chú: ${note || 'không'}\n\n` +
      'Phân tích ngắn gọn: điểm bất thường, nguyên nhân khả dĩ, và 2-3 hành động nên làm trước khi tăng ngân sách.',
    maxTokens: 600
  });

  return { ok: true, source: 'ai', analysis: text };
}

export async function chat({ messages = [], userMessage = '' }) {
  if (!isAiConfigured()) {
    return {
      ok: false,
      error: 'AI Chat cần cấu hình AI (AI_API_KEY). Bạn vẫn dùng được nút giải thích trường và AI Review (rule-based).'
    };
  }

  const history = Array.isArray(messages)
    ? messages
        .filter((m) => m && m.content)
        .map((m) => `${m.role === 'assistant' ? 'Trợ lý' : 'Người dùng'}: ${m.content}`)
        .join('\n')
    : '';

  const text = await callLLM({
    system:
      'Bạn là trợ lý quảng cáo Facebook tiếng Việt, thân thiện, thực tế. Hỏi lại thông tin còn thiếu (mục tiêu, ngân sách, khu vực, tin nhắn hay form) trước khi tư vấn cấu hình. Chỉ gợi ý, không cam kết kết quả.',
    user: `${history ? history + '\n' : ''}Người dùng: ${userMessage}\nTrợ lý:`,
    maxTokens: 600
  });

  return { ok: true, source: 'ai', reply: text };
}

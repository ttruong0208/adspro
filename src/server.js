import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { appendJobs, readJobs, writeJobs } from './jobStore.js';
import {
  createCampaignDraft,
  createAdSetDraft,
  createAdDraft,
  createAdDraftWithObjectStoryId,
  createLeadFormAd,
  pickFirstValidPostAndCreateAd,
  updateCampaignStatus,
  updateAdSetStatus,
  updateAdStatus,
  getAdAccount,
  getAdSet,
  getAd,
  listCampaigns,
  scanPermissions,
  classifyMetaError,
  requestPageAccessToBusiness
} from './metaApi.js';
import {
  readTokenStore,
  saveUserToken,
  clearStoredUserToken
} from './tokenStore.js';
import { authContextMiddleware, getAuthContext } from './authContext.js';
import {
  appendRunEvent,
  getRunReportWithFilters,
  buildRunReportCsv
} from './reportStore.js';
import {
  getAiInfo,
  explainField,
  reviewCampaign,
  suggestTarget,
  generateContent,
  analyzeReport,
  chat as aiChat
} from './aiAssistant.js';
import { saveAudit, getAudit, listAudits } from './auditStore.js';

const app = express();
const port = Number(process.env.PORT || 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FB_APP_ID =
  process.env.META_APP_ID ||
  process.env.FB_APP_ID ||
  process.env.FACEBOOK_APP_ID ||
  '';
const FB_APP_SECRET =
  process.env.META_APP_SECRET ||
  process.env.FB_APP_SECRET ||
  process.env.FACEBOOK_APP_SECRET ||
  '';
const FB_REDIRECT_URI_ENV = process.env.META_REDIRECT_URI || process.env.FB_REDIRECT_URI || '';
const ADMIN_API_KEY = String(process.env.ADMIN_API_KEY || '').trim();

function resolveRedirectUri(req) {
  if (FB_REDIRECT_URI_ENV) return FB_REDIRECT_URI_ENV;
  if (req?.protocol && req?.get) {
    return `${req.protocol}://${req.get('host')}/auth/facebook/callback`;
  }
  return `http://localhost:${port}/auth/facebook/callback`;
}

function getCookieOptions(req, maxAgeMs = undefined) {
  const secure = Boolean(req?.secure || String(req?.headers?.['x-forwarded-proto'] || '').includes('https'));
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    ...(typeof maxAgeMs === 'number' ? { maxAge: maxAgeMs } : {})
  };
}

function isWriteMethod(method = 'GET') {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(String(method || '').toUpperCase());
}

function shouldProtectPath(pathname = '') {
  return (
    pathname.startsWith('/flow/') ||
    pathname.startsWith('/campaigns/') ||
    pathname.startsWith('/adsets/') ||
    pathname.startsWith('/ads/') ||
    pathname.startsWith('/permissions/request-page-access') ||
    pathname.startsWith('/jobs/create-adsets') ||
    pathname.startsWith('/ai/')
  );
}

app.use(express.static(path.join(__dirname, '../public')));
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(authContextMiddleware);
app.use((req, res, next) => {
  if (!ADMIN_API_KEY) return next();
  if (!isWriteMethod(req.method)) return next();
  if (!shouldProtectPath(req.path)) return next();

  const inputKey = String(req.headers['x-admin-key'] || '').trim();
  if (inputKey !== ADMIN_API_KEY) {
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized: invalid ADMIN_API_KEY'
    });
  }
  return next();
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
function buildAdsManagerUrl({ adAccountId, campaignId, adSetId, adId }) {
  const numericAccountId = String(adAccountId || '').replace(/^act_/, '');
  let url = `https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${numericAccountId}`;
  if (campaignId) url += `&selected_campaign_ids=${campaignId}`;
  if (adSetId) url += `&selected_adset_ids=${adSetId}`;
  if (adId) url += `&selected_ad_ids=${adId}`;
  return url;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/auth/config', (req, res) => {
  const redirectUri = resolveRedirectUri(req);
  const missing = [];

  if (!FB_APP_ID) missing.push('META_APP_ID');
  if (!FB_APP_SECRET) missing.push('META_APP_SECRET');

  res.json({
    ok: missing.length === 0,
    hasMetaAppId: Boolean(FB_APP_ID),
    hasMetaAppSecret: Boolean(FB_APP_SECRET),
    hasRedirectUriEnv: Boolean(FB_REDIRECT_URI_ENV),
    adminKeyRequired: Boolean(ADMIN_API_KEY),
    ai: getAiInfo(),
    redirectUri,
    missing
  });
});

app.get('/accounts/:adAccountId', async (req, res) => {
  try {
    const data = await getAdAccount(req.params.adAccountId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.post('/permissions/scan', async (req, res) => {
  try {
    const { adAccountId, pageIds } = req.body;

    if (!adAccountId) return res.status(400).json({ error: 'Missing adAccountId' });
    if (!Array.isArray(pageIds)) return res.status(400).json({ error: 'Missing pageIds' });

    const data = await scanPermissions({ adAccountId, pageIds });
    res.json({ ok: true, ...data });
  } catch (err) {
    res.status(400).json({
      ok: false,
      error: err.message,
      errorType: err.errorType || classifyMetaError(err.message)
    });
  }
});


app.post('/permissions/request-page-access', async (req, res) => {
  try {
    const {
      businessId,
      pageIds = [],
      permittedTasks = ['ADVERTISE', 'CREATE_CONTENT']
    } = req.body || {};

    if (!businessId) {
      return res.status(400).json({
        ok: false,
        error: 'Missing businessId'
      });
    }

    if (!Array.isArray(pageIds) || !pageIds.length) {
      return res.status(400).json({
        ok: false,
        error: 'Missing pageIds'
      });
    }

    const result = await requestPageAccessToBusiness({
      businessId,
      pageIds,
      permittedTasks
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'Request page access failed',
      errorType: err.errorType || 'UNKNOWN',
      meta: err.meta || null
    });
  }
});

app.get('/campaigns', async (req, res) => {
  try {
    const { adAccountId } = req.query;

    if (!adAccountId) {
      return res.status(400).json({ error: 'Missing adAccountId' });
    }

    const data = await listCampaigns(adAccountId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/flow/create-campaign-and-adset-draft', async (req, res) => {
  try {
    const {
      adAccountId,
      campaignName,
      adSetName,
      objective,
      dailyBudget,
      pageId,
      optimizationGoal
    } = req.body;

    if (!adAccountId) return res.status(400).json({ error: 'Missing adAccountId' });
    if (!campaignName) return res.status(400).json({ error: 'Missing campaignName' });
    if (!adSetName) return res.status(400).json({ error: 'Missing adSetName' });
    if (!pageId) return res.status(400).json({ error: 'Missing pageId' });

    const campaign = await createCampaignDraft({
      adAccountId,
      campaignName,
      objective,
      dailyBudget
    });

    const adSet = await createAdSetDraft({
      adAccountId,
      campaignId: campaign.id,
      adSetName,
      pageId,
      optimizationGoal
    });

    const adSetDetail = await getAdSet(adSet.id);
    const adsManagerUrl = buildAdsManagerUrl({
      adAccountId,
      campaignId: campaign.id,
      adSetId: adSet.id
    });

    res.json({
      ok: true,
      campaign: { id: campaign.id, name: campaignName },
      adSet: {
        id: adSetDetail.id,
        name: adSetDetail.name,
        status: adSetDetail.status,
        optimization_goal: adSetDetail.optimization_goal,
        destination_type: adSetDetail.destination_type
      },
      adsManagerUrl
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/flow/run-full-draft', async (req, res) => {
  const startedAtMs = Date.now();
  const inputBody = req.body || {};
  const operatorName = String(
    req.headers['x-operator-name'] || inputBody.operatorName || inputBody.operator || ''
  ).trim();
  const businessId = String(
    req.headers['x-business-id'] || inputBody.businessId || ''
  ).trim();

  try {
    const {
      adAccountId,
      campaignName,
      adSetName,
      adName,
      objective,
      dailyBudget,
      pageId,
      optimizationGoal,
      postId,
      audienceName,
      placements,
      campaignType,
      leadFormId,
      leadMessage,
      targetLatitude,
      targetLongitude,
      targetRadiusKm
    } = req.body;

    if (!adAccountId) return res.status(400).json({ error: 'Missing adAccountId' });
    if (!campaignName) return res.status(400).json({ error: 'Missing campaignName' });
    if (!adSetName) return res.status(400).json({ error: 'Missing adSetName' });
    if (!pageId) return res.status(400).json({ error: 'Missing pageId' });
    if (!dailyBudget || Number(dailyBudget) <= 0) {
      return res.status(400).json({ error: 'Invalid dailyBudget' });
    }

    const isLeadForm = String(campaignType || 'messenger') === 'lead_form';

    if (isLeadForm && !leadFormId) {
      return res.status(400).json({
        error: 'Missing leadFormId for lead form campaign'
      });
    }

    const resolvedObjective = objective || (isLeadForm ? 'OUTCOME_LEADS' : 'OUTCOME_ENGAGEMENT');
    const resolvedOptimizationGoal =
      optimizationGoal || (isLeadForm ? 'LEAD_GENERATION' : 'CONVERSATIONS');
    const resolvedDestinationType = isLeadForm ? null : 'MESSENGER';
    const location = {
      latitude: targetLatitude,
      longitude: targetLongitude,
      radiusKm: targetRadiusKm
    };

    const campaign = await createCampaignDraft({
      adAccountId,
      campaignName,
      objective: resolvedObjective,
      dailyBudget
    });

    const adSet = await createAdSetDraft({
      adAccountId,
      campaignId: campaign.id,
      adSetName,
      pageId,
      optimizationGoal: resolvedOptimizationGoal,
      destinationType: resolvedDestinationType,
      mode: isLeadForm ? 'lead_form' : 'messenger',
      location
    });

    const adSetDetail = await getAdSet(adSet.id);

    let adDetail = null;
    let pickedPost = null;

    if (isLeadForm) {
      const ad = await createLeadFormAd({
        adAccountId,
        adSetId: adSet.id,
        adName: adName || `Lead Ad - ${pageId}`,
        pageId,
        leadFormId,
        message: leadMessage || ''
      });

      adDetail = await getAd(ad.id);
      pickedPost = {
        source: 'lead_form',
        leadFormId: String(leadFormId)
      };
    } else if (postId) {
      const ad = await createAdDraftWithObjectStoryId({
        adAccountId,
        adSetId: adSet.id,
        adName: adName || `Ad - ${pageId}`,
        objectStoryId: postId
      });

      adDetail = await getAd(ad.id);
      pickedPost = {
        source: 'input_post_id',
        id: postId
      };
    } else {
      const picked = await pickFirstValidPostAndCreateAd({
        adAccountId,
        adSetId: adSet.id,
        adName: adName || `Ad - ${pageId}`,
        pageId,
        limit: 10
      });

      adDetail = await getAd(picked.ad.id);
      pickedPost = picked.pickedPost;
    }

    // PHASE 7: publish bằng API
    if (adDetail?.id) {
      await updateCampaignStatus({
        campaignId: campaign.id,
        status: 'ACTIVE'
      });

      await updateAdSetStatus({
        adSetId: adSet.id,
        status: 'ACTIVE'
      });

      await updateAdStatus({
        adId: adDetail.id,
        status: 'ACTIVE'
      });
    }

    const adsManagerUrl = buildAdsManagerUrl({
      adAccountId,
      campaignId: campaign.id,
      adSetId: adSet.id,
      adId: adDetail?.id
    });

    appendRunEvent({
      ok: true,
      adAccountId,
      pageId,
      budget: Number(dailyBudget) || 0,
      durationMs: Date.now() - startedAtMs,
      operatorName,
      businessId,
      campaignId: campaign.id,
      adSetId: adSet.id,
      adId: adDetail?.id || null
    });

    res.json({
      ok: true,
      campaign: {
        id: campaign.id,
        name: campaignName,
        status: adDetail?.id ? 'ACTIVE' : 'PAUSED'
      },
      adSet: {
        id: adSetDetail.id,
        name: adSetDetail.name,
        status: adDetail?.id ? 'ACTIVE' : adSetDetail.status,
        optimization_goal: adSetDetail.optimization_goal,
        destination_type: adSetDetail.destination_type,
        daily_budget: dailyBudget
      },
      ad: adDetail
        ? {
            id: adDetail.id,
            name: adDetail.name,
            status: 'ACTIVE',
            adset_id: adDetail.adset_id,
            campaign_id: adDetail.campaign_id
          }
        : null,
      pickedPost,
      adsManagerUrl,
      uiPlan: {
        audienceName: audienceName || null,
        placements: placements || null,
        hasPostSelectionStep: false,
        hasPublishStep: false
      },
      publishResult: adDetail?.id
        ? {
            campaignStatus: 'ACTIVE',
            adSetStatus: 'ACTIVE',
            adStatus: 'ACTIVE'
          }
        : null
    });
  } catch (err) {
    try {
      const body = req.body || {};
      appendRunEvent({
        ok: false,
        adAccountId: body.adAccountId || '',
        pageId: body.pageId || '',
        budget: Number(body.dailyBudget) || 0,
        durationMs: Date.now() - startedAtMs,
        operatorName,
        businessId,
        errorType: err.errorType || classifyMetaError(err.message),
        errorMessage: err.message || 'Unknown error'
      });
    } catch {
      // Ignore report-store errors.
    }

    res.status(400).json({
      error: err.message,
      errorType: err.errorType || classifyMetaError(err.message)
    });
  }
});

// Bulk Launcher: tạo 1 campaign cho 1 page, nhân tổ hợp Audience × Creative.
// - Mỗi Audience => 1 Ad Set (target riêng).
// - Mỗi Creative trong Audience => 1 Ad.
// - Ngân sách đặt ở Campaign (CBO) nên nhiều Ad Set dùng chung ngân sách.
// Lỗi từng Ad/Ad Set được cô lập, không làm hỏng cả page.
app.post('/flow/run-matrix-page', async (req, res) => {
  const startedAtMs = Date.now();
  const body = req.body || {};
  const operatorName = String(
    req.headers['x-operator-name'] || body.operatorName || ''
  ).trim();
  const businessId = String(
    req.headers['x-business-id'] || body.businessId || ''
  ).trim();

  try {
    const {
      adAccountId,
      pageId,
      pageName,
      campaignType = 'messenger',
      objective,
      dailyBudget,
      audiences = [],
      creatives = [],
      publish = true,
      namePrefix = 'AUTO'
    } = body;

    if (!adAccountId) return res.status(400).json({ error: 'Missing adAccountId' });
    if (!pageId) return res.status(400).json({ error: 'Missing pageId' });
    if (!dailyBudget || Number(dailyBudget) <= 0) {
      return res.status(400).json({ error: 'Invalid dailyBudget' });
    }

    const isLeadForm = String(campaignType || 'messenger') === 'lead_form';
    const resolvedObjective =
      objective || (isLeadForm ? 'OUTCOME_LEADS' : 'OUTCOME_ENGAGEMENT');
    const resolvedOptimizationGoal = isLeadForm ? 'LEAD_GENERATION' : 'CONVERSATIONS';
    const resolvedDestinationType = isLeadForm ? null : 'MESSENGER';

    const safeAudiences =
      Array.isArray(audiences) && audiences.length
        ? audiences
        : [{ label: 'Default', latitude: '', longitude: '', radiusKm: '' }];
    const safeCreatives =
      Array.isArray(creatives) && creatives.length
        ? creatives
        : [{ label: 'Auto', postId: '', leadFormId: '', message: '' }];

    const label = String(pageName || pageId);

    const campaign = await createCampaignDraft({
      adAccountId,
      campaignName: `${namePrefix} ${label} - ${pageId}`,
      objective: resolvedObjective,
      dailyBudget
    });

    const adSetResults = [];
    const adResults = [];
    let createdAds = 0;
    let failed = 0;

    for (const aud of safeAudiences) {
      const audLabel = String(aud?.label || 'Aud');
      let adSet = null;

      try {
        adSet = await createAdSetDraft({
          adAccountId,
          campaignId: campaign.id,
          adSetName: `${label} • ${audLabel}`,
          pageId,
          optimizationGoal: resolvedOptimizationGoal,
          destinationType: resolvedDestinationType,
          mode: isLeadForm ? 'lead_form' : 'messenger',
          location: {
            latitude: aud?.latitude,
            longitude: aud?.longitude,
            radiusKm: aud?.radiusKm
          }
        });
        adSetResults.push({ ok: true, audience: audLabel, adSetId: adSet.id });
      } catch (err) {
        failed += 1;
        adSetResults.push({
          ok: false,
          audience: audLabel,
          error: err.message,
          errorType: err.errorType || classifyMetaError(err.message)
        });
        continue;
      }

      for (const cr of safeCreatives) {
        const crLabel = String(cr?.label || 'Creative');
        const adName = `${label} • ${audLabel} • ${crLabel}`;

        try {
          let ad = null;

          if (isLeadForm) {
            const formId = String(cr?.leadFormId || body.leadFormId || '').trim();
            if (!formId) throw new Error('Thiếu Lead Form ID cho creative thu lead');
            ad = await createLeadFormAd({
              adAccountId,
              adSetId: adSet.id,
              adName,
              pageId,
              leadFormId: formId,
              message: cr?.message || ''
            });
          } else if (cr?.postId) {
            ad = await createAdDraftWithObjectStoryId({
              adAccountId,
              adSetId: adSet.id,
              adName,
              objectStoryId: String(cr.postId)
            });
          } else {
            const picked = await pickFirstValidPostAndCreateAd({
              adAccountId,
              adSetId: adSet.id,
              adName,
              pageId,
              limit: 10
            });
            ad = picked.ad;
          }

          if (publish && ad?.id) {
            await updateAdStatus({ adId: ad.id, status: 'ACTIVE' });
          }

          createdAds += 1;
          adResults.push({ ok: true, audience: audLabel, creative: crLabel, adId: ad?.id || null });
        } catch (err) {
          failed += 1;
          adResults.push({
            ok: false,
            audience: audLabel,
            creative: crLabel,
            error: err.message,
            errorType: err.errorType || classifyMetaError(err.message)
          });
        }
      }

      if (publish && adSet?.id) {
        try {
          await updateAdSetStatus({ adSetId: adSet.id, status: 'ACTIVE' });
        } catch {
          // Non-fatal: giữ ad set ở trạng thái hiện tại nếu publish lỗi.
        }
      }
    }

    if (publish && createdAds > 0) {
      try {
        await updateCampaignStatus({ campaignId: campaign.id, status: 'ACTIVE' });
      } catch {
        // Non-fatal.
      }
    }

    const adsManagerUrl = buildAdsManagerUrl({ adAccountId, campaignId: campaign.id });

    appendRunEvent({
      ok: createdAds > 0,
      adAccountId,
      pageId,
      budget: Number(dailyBudget) || 0,
      durationMs: Date.now() - startedAtMs,
      operatorName,
      businessId,
      campaignId: campaign.id
    });

    res.json({
      ok: createdAds > 0,
      pageId,
      campaign: { id: campaign.id, status: publish && createdAds > 0 ? 'ACTIVE' : 'PAUSED' },
      counts: {
        adSets: adSetResults.filter((x) => x.ok).length,
        ads: createdAds,
        failed
      },
      adSetResults,
      adResults,
      adsManagerUrl
    });
  } catch (err) {
    try {
      appendRunEvent({
        ok: false,
        adAccountId: body.adAccountId || '',
        pageId: body.pageId || '',
        budget: Number(body.dailyBudget) || 0,
        durationMs: Date.now() - startedAtMs,
        operatorName,
        businessId,
        errorType: err.errorType || classifyMetaError(err.message),
        errorMessage: err.message || 'Unknown error'
      });
    } catch {
      // Ignore report-store errors.
    }

    res.status(400).json({
      error: err.message,
      errorType: err.errorType || classifyMetaError(err.message)
    });
  }
});

app.post('/adsets/create-draft', async (req, res) => {
  try {
    const { adAccountId, campaignId, adSetName, pageId, optimizationGoal } = req.body;

    if (!adAccountId) return res.status(400).json({ error: 'Missing adAccountId' });
    if (!campaignId) return res.status(400).json({ error: 'Missing campaignId' });
    if (!adSetName) return res.status(400).json({ error: 'Missing adSetName' });
    if (!pageId) return res.status(400).json({ error: 'Missing pageId' });

    const adSet = await createAdSetDraft({
      adAccountId,
      campaignId,
      adSetName,
      pageId,
      optimizationGoal
    });
    const detail = await getAdSet(adSet.id);

    const adsManagerUrl = buildAdsManagerUrl({
      adAccountId,
      campaignId,
      adSetId: adSet.id
    });

    res.json({
      ok: true,
      adSet: {
        id: detail.id,
        name: detail.name,
        status: detail.status,
        campaign_id: detail.campaign_id,
        daily_budget: detail.daily_budget,
        optimization_goal: detail.optimization_goal,
        destination_type: detail.destination_type
      },
      adsManagerUrl
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/jobs/create-adsets', async (_req, res) => {
  try {
    const jobs = readJobs();

    if (!jobs.length) {
      return res.status(400).json({ error: 'No jobs found' });
    }

    const results = [];
    const nextJobs = [...jobs];

    for (let i = 0; i < nextJobs.length; i++) {
      const job = nextJobs[i];

      if (!job.campaignId) {
        results.push({
          ok: false,
          pageId: job.pageId,
          errorType: 'missing_campaign_id',
          error: 'Missing campaignId'
        });
        continue;
      }

      if (!job.pageId) {
        results.push({
          ok: false,
          campaignId: job.campaignId,
          errorType: 'missing_page_id',
          error: 'Missing pageId'
        });
        continue;
      }

      if (!job.budget || Number(job.budget) <= 0) {
        results.push({
          ok: false,
          pageId: job.pageId,
          campaignId: job.campaignId,
          errorType: 'invalid_budget',
          error: 'Invalid budget'
        });
        continue;
      }

      try {
        const adSetName = `Nhóm QC - ${job.pageId}`;

        const created = await createAdSetDraft({
          adAccountId: job.adAccountId,
          campaignId: job.campaignId,
          adSetName,
          pageId: job.pageId
        });
        const detail = await getAdSet(created.id);

        nextJobs[i] = {
          ...job,
          adSetId: detail.id,
          adSetName: detail.name,
          adSetStatus: detail.status,
          optimizationGoal: detail.optimization_goal,
          destinationType: detail.destination_type,
          status: 'adset_created',
          adSetCreatedAt: new Date().toISOString()
        };

        results.push({
          ok: true,
          pageId: job.pageId,
          budget: job.budget,
          campaignId: job.campaignId,
          adSetId: detail.id,
          adSetName: detail.name,
          adSetStatus: detail.status
        });
      } catch (err) {
        const message = err.message || 'Unknown error';
        const lower = message.toLowerCase();

        let errorType = 'unknown';

        if (
          lower.includes('không đủ quyền đối với trang') ||
          lower.includes('khong du quyen doi voi trang') ||
          lower.includes('not authorized to use page') ||
          (lower.includes('permission') && lower.includes('page'))
        ) {
          errorType = 'no_page_permission';
        } else if (
          lower.includes('must be a valid page id') ||
          lower.includes('invalid page') ||
          lower.includes('promoted_object[page_id]')
        ) {
          errorType = 'invalid_page_id';
        }

        nextJobs[i] = {
          ...job,
          status: 'adset_failed',
          adSetError: message,
          adSetErrorType: errorType,
          adSetFailedAt: new Date().toISOString()
        };

        results.push({
          ok: false,
          pageId: job.pageId,
          budget: job.budget,
          campaignId: job.campaignId,
          errorType,
          error: message
        });
      }
    }

    writeJobs(nextJobs);

    res.json({
      ok: true,
      successCount: results.filter((x) => x.ok).length,
      failCount: results.filter((x) => !x.ok).length,
      results
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/campaigns/create-draft', async (req, res) => {
  try {
    const {
      adAccountId,
      campaignName,
      objective,
      dailyBudget,
      pageRef,
      savedAudienceName,
      postId
    } = req.body;

    if (!adAccountId) return res.status(400).json({ error: 'Missing adAccountId' });
    if (!campaignName) return res.status(400).json({ error: 'Missing campaignName' });

    const campaign = await createCampaignDraft({
      adAccountId,
      campaignName,
      objective,
      dailyBudget
    });

    const adsManagerUrl = buildAdsManagerUrl({
      adAccountId,
      campaignId: campaign.id
    });

    res.json({
      ok: true,
      inputEcho: {
        dailyBudget,
        pageRef,
        savedAudienceName,
        postId
      },
      campaign: {
        id: campaign.id,
        name: campaignName
      },
      adsManagerUrl
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/campaigns/create-draft-batch', async (req, res) => {
  try {
    const { adAccountId, campaignNameTemplate, objective, items } = req.body;

    if (!adAccountId) return res.status(400).json({ error: 'Missing adAccountId' });
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Missing items' });
    }

    const results = [];
    const failedPageIds = [];
    const jobsToSave = [];
    const numericAccountId = adAccountId.replace(/^act_/, '');

    for (const rawItem of items) {
      const pageId = String(rawItem?.pageId || '').trim();
      const budget = Number(rawItem?.budget);

      if (!pageId) {
        results.push({
          ok: false,
          pageId: '',
          budget: rawItem?.budget,
          error: 'Missing pageId'
        });
        continue;
      }

      if (!Number.isFinite(budget) || budget <= 0) {
        failedPageIds.push(pageId);
        results.push({
          ok: false,
          pageId,
          budget: rawItem?.budget,
          error: 'Invalid budget'
        });
        continue;
      }

      const campaignName = (campaignNameTemplate || 'AUTO {{pageId}}').replaceAll('{{pageId}}', pageId);

      try {
        const campaign = await createCampaignDraft({
          adAccountId,
          campaignName,
          objective,
          dailyBudget: budget
        });

        const adsManagerUrl =
          `https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${numericAccountId}` +
          `&selected_campaign_ids=${campaign.id}`;

        const jobRecord = {
          pageId,
          budget,
          adAccountId,
          objective: objective || 'OUTCOME_ENGAGEMENT',
          campaignId: campaign.id,
          campaignName,
          adsManagerUrl,
          status: 'campaign_created',
          createdAt: new Date().toISOString()
        };

        jobsToSave.push(jobRecord);

        results.push({
          ok: true,
          ...jobRecord
        });
      } catch (err) {
        failedPageIds.push(pageId);
        results.push({
          ok: false,
          pageId,
          budget,
          error: err.message
        });
      }
    }

    appendJobs(jobsToSave);

    res.json({
      ok: true,
      successCount: results.filter((x) => x.ok).length,
      failCount: results.filter((x) => !x.ok).length,
      failedPageIds,
      savedCount: jobsToSave.length,
      results
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/jobs', (_req, res) => {
  try {
    const jobs = readJobs();
    res.json({
      ok: true,
      count: jobs.length,
      jobs
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/jobs/adsets', (_req, res) => {
  try {
    const jobs = readJobs().filter((job) => job.adSetId);
    res.json({
      ok: true,
      count: jobs.length,
      jobs
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/reports/summary', (req, res) => {
  try {
    const report = getRunReportWithFilters({
      limit: Number(req.query.limit || 50),
      status: String(req.query.status || 'all'),
      adAccountId: String(req.query.adAccountId || ''),
      from: String(req.query.from || ''),
      to: String(req.query.to || '')
    });
    res.json({ ok: true, ...report });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Cannot read reports' });
  }
});

app.get('/reports/export.csv', (req, res) => {
  try {
    const csv = buildRunReportCsv({
      limit: Number(req.query.limit || 500),
      status: String(req.query.status || 'all'),
      adAccountId: String(req.query.adAccountId || ''),
      from: String(req.query.from || ''),
      to: String(req.query.to || '')
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ads-run-report.csv"');
    res.send(csv);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Cannot export report' });
  }
});

app.post('/ads/create-draft', async (req, res) => {
  try {
    const { adAccountId, adSetId, adName, postId } = req.body;

    if (!adAccountId) return res.status(400).json({ error: 'Missing adAccountId' });
    if (!adSetId) return res.status(400).json({ error: 'Missing adSetId' });
    if (!adName) return res.status(400).json({ error: 'Missing adName' });
    if (!postId) return res.status(400).json({ error: 'Missing postId' });

    const ad = await createAdDraft({
      adAccountId,
      adSetId,
      adName,
      postId
    });

    const detail = await getAd(ad.id);
    const adsManagerUrl = buildAdsManagerUrl({
      adAccountId,
      adSetId,
      adId: ad.id
    });

    res.json({
      ok: true,
      ad: {
        id: detail.id,
        name: detail.name,
        status: detail.status,
        adset_id: detail.adset_id,
        campaign_id: detail.campaign_id
      },
      adsManagerUrl
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
async function exchangeCodeForUserToken(code, redirectUri) {
  if (!FB_APP_ID) throw new Error('Missing META_APP_ID');
  if (!FB_APP_SECRET) throw new Error('Missing META_APP_SECRET');
  if (!redirectUri) throw new Error('Missing META_REDIRECT_URI');

  const url =
    `https://graph.facebook.com/v23.0/oauth/access_token` +
    `?client_id=${encodeURIComponent(FB_APP_ID)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&client_secret=${encodeURIComponent(FB_APP_SECRET)}` +
    `&code=${encodeURIComponent(code)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(
      data?.error?.message || 'Không đổi được code sang user token'
    );
  }

  return data;
}

async function exchangeLongLivedUserToken(shortLivedUserToken) {
  if (!FB_APP_ID) throw new Error('Missing META_APP_ID');
  if (!FB_APP_SECRET) throw new Error('Missing META_APP_SECRET');

  const url =
    `https://graph.facebook.com/v23.0/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${encodeURIComponent(FB_APP_ID)}` +
    `&client_secret=${encodeURIComponent(FB_APP_SECRET)}` +
    `&fb_exchange_token=${encodeURIComponent(shortLivedUserToken)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(
      data?.error?.message || 'Không đổi được long-lived user token'
    );
  }

  return data;
}


app.get('/auth/permissions', async (_req, res) => {
  try {
    const ctx = getAuthContext();
    const store = readTokenStore();
    const token = ctx?.userToken || store?.userToken || null;

    if (!token) {
      return res.status(400).json({
        ok: false,
        error: 'No token'
      });
    }

    const url =
      `https://graph.facebook.com/v23.0/me/permissions` +
      `?access_token=${encodeURIComponent(token)}`;

    const fbRes = await fetch(url);
    const data = await fbRes.json();

    return res.status(fbRes.ok ? 200 : 400).json(data);
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message || 'Cannot read permissions'
    });
  }
});

app.get('/auth/facebook/start', (req, res) => {
  if (!FB_APP_ID) {
    return res
      .status(400)
      .send('Missing META_APP_ID (or FB_APP_ID / FACEBOOK_APP_ID).');
  }

  const redirectUri = resolveRedirectUri(req);
  const scope = [
    'ads_management',
    'ads_read',
    'pages_show_list',
    'pages_read_engagement',
    'business_management'
  
  ].join(',');

  const authUrl =
  `https://www.facebook.com/v23.0/dialog/oauth` +
  `?client_id=${encodeURIComponent(FB_APP_ID)}` +
  `&redirect_uri=${encodeURIComponent(redirectUri)}` +
  `&scope=${encodeURIComponent(scope)}` +
  `&auth_type=rerequest`;

  res.redirect(authUrl);
});

app.get('/auth/facebook/callback', async (req, res) => {
  try {
    const errorMessage = String(req.query.error_message || req.query.error || '');
    const errorCode = String(req.query.error_code || '');

    if (errorMessage) {
      return res.status(400).send(
        `Facebook login error${errorCode ? ` (${errorCode})` : ''}: ${errorMessage}`
      );
    }

    const code = String(req.query.code || '');
    if (!code) {
      return res.status(400).send('Missing code');
    }

    const shortToken = await exchangeCodeForUserToken(code, resolveRedirectUri(req));
    const longToken = await exchangeLongLivedUserToken(shortToken.access_token);
    const me = await getFacebookMe(longToken.access_token);

    const maxAgeMs =
      typeof longToken.expires_in === 'number' && Number.isFinite(longToken.expires_in)
        ? longToken.expires_in * 1000
        : undefined;

    // Vercel-friendly auth state: persist user token in secure HttpOnly cookies.
    res.cookie('fb_user_token', longToken.access_token, getCookieOptions(req, maxAgeMs));
    res.cookie(
      'fb_profile',
      JSON.stringify({
        id: me.id || null,
        name: me.name || null
      }),
      getCookieOptions(req, maxAgeMs)
    );

    try {
      // Keep file-based storage as optional fallback for non-serverless runtimes.
      saveUserToken({
        userToken: longToken.access_token,
        tokenType: 'user',
        expiresIn: longToken.expires_in || null,
        meta: {
          source: 'oauth_callback',
          facebookUserId: me.id || null,
          facebookUserName: me.name || null
        }
      });
    } catch {
      // Ignore store write failures in stateless/serverless environments.
    }

    res.send(`
      <!doctype html>
      <html lang="vi">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Kết nối Facebook thành công</title>
        </head>
        <body style="font-family:Arial,sans-serif;padding:40px;text-align:center;">
          <h1>Kết nối Facebook thành công</h1>
          <p>Đã lưu token cho tài khoản: <strong>${me.name || 'Không rõ tên'}</strong></p>
          <p>Facebook ID: <strong>${me.id || 'Không rõ ID'}</strong></p>
          <p>Bạn có thể đóng tab này và quay lại ứng dụng.</p>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(400).send(`Auth callback error: ${err.message}`);
  }
});
async function getFacebookMe(userToken) {
  const url =
    `https://graph.facebook.com/v23.0/me` +
    `?fields=id,name` +
    `&access_token=${encodeURIComponent(userToken)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data?.error?.message || 'Không lấy được thông tin tài khoản Facebook');
  }

  return data;
}

app.get('/auth/status', (_req, res) => {
  try {
    const ctx = getAuthContext();
    if (ctx?.userToken) {
      return res.json({
        ok: true,
        hasToken: true,
        connected: true,
        tokenType: 'user_cookie',
        expiresAt: null,
        updatedAt: null,
        profile: {
          id: ctx?.profile?.id || null,
          name: ctx?.profile?.name || null
        },
        meta: { source: 'cookie' }
      });
    }

    const store = readTokenStore();

    res.json({
      ok: true,
      hasToken: !!store?.userToken,
      connected: !!store?.userToken,
      tokenType: store?.tokenType || null,
      expiresAt: store?.expiresAt || null,
      updatedAt: store?.updatedAt || null,
      profile: store?.userToken
        ? {
            id: store?.meta?.facebookUserId || null,
            name: store?.meta?.facebookUserName || null
          }
        : null,
      meta: store?.meta || {}
    });
  } catch (err) {
    // Do not crash auth flow if token store is temporarily unavailable.
    res.status(200).json({
      ok: true,
      hasToken: false,
      connected: false,
      tokenType: null,
      expiresAt: null,
      updatedAt: null,
      profile: null,
      meta: {},
      degraded: true,
      degradedReason: err?.message || 'Token store unavailable'
    });
  }
});

app.post('/auth/logout', (_req, res) => {
  try {
    clearStoredUserToken();
  } catch {
    // Ignore file-store cleanup errors.
  }
  res.clearCookie('fb_user_token', { path: '/' });
  res.clearCookie('fb_profile', { path: '/' });
  res.json({ ok: true });
});

function escapeHtmlServer(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function healthColorServer(score) {
  const s = Number(score) || 0;
  if (s >= 85) return '#16a34a';
  if (s >= 65) return '#22c55e';
  if (s >= 45) return '#f59e0b';
  return '#dc2626';
}

function renderReviewPage(audit) {
  const score = Number(audit.score) || 0;
  const color = healthColorServer(score);
  const conf = audit.confidence || {};
  const confColor = healthColorServer(conf.percent || 0);
  const dateStr = audit.createdAt ? new Date(audit.createdAt).toLocaleString('vi-VN') : '';

  const checkIcon = (status) =>
    ({ pass: '🟢', fail: '🔴', warn: '🟡', na: '⚪', unknown: '⚪' }[status] || '⚪');
  const checkText = (status) =>
    ({ pass: 'OK', fail: 'Thiếu', warn: 'Cần lưu ý', na: 'Không áp dụng', unknown: 'Chưa kiểm tra' }[status] || '');
  const checkColor = (status) =>
    ({ pass: '#16a34a', fail: '#dc2626', warn: '#c2410c', na: '#94a3b8', unknown: '#94a3b8' }[status] || '#94a3b8');

  const prioHtml = (audit.priorities || [])
    .map((p) => {
      const dot = p.level === 'high' ? '#dc2626' : p.level === 'medium' ? '#f59e0b' : '#16a34a';
      const lvlText = p.level === 'high' ? 'Cao' : p.level === 'medium' ? 'Trung bình' : 'Thấp';
      return `
        <li style="display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid #eef2f7;border-radius:10px;margin-bottom:8px;">
          <span style="width:10px;height:10px;border-radius:999px;background:${dot};margin-top:5px;flex:0 0 auto;"></span>
          <span>
            <b>${escapeHtmlServer(lvlText)} — ${escapeHtmlServer(p.title || '')}</b><br/>
            <span style="color:#475569;">${escapeHtmlServer(p.action || '')}</span>
            ${p.explain ? `<div style="margin-top:6px;color:#475569;font-size:13px;white-space:pre-wrap;">${escapeHtmlServer(p.explain)}</div>` : ''}
          </span>
        </li>`;
    })
    .join('');

  const checkHtml = (audit.checklist || [])
    .map(
      (c) =>
        `<li style="font-weight:700;margin-bottom:6px;">${checkIcon(c.status)} ${escapeHtmlServer(c.label)} <span style="color:${checkColor(c.status)};font-weight:600;">${escapeHtmlServer(checkText(c.status))}</span></li>`
    )
    .join('');

  const confReasons = (conf.reasons || []).length
    ? `<div style="color:#b45309;font-size:13px;margin-top:8px;">Thiếu dữ liệu: ${(conf.reasons || []).map(escapeHtmlServer).join(', ')}</div>`
    : '';

  const bdHtml = (audit.breakdown || []).length
    ? `<h2>Vì sao được ${score} điểm</h2><ul>${(audit.breakdown || [])
        .map(
          (b) =>
            `<li style="display:flex;justify-content:space-between;border-bottom:1px dashed #eef2f7;padding:6px 0;"><span>${escapeHtmlServer(
              b.label
            )}</span><b>+${Number(b.points) || 0}</b></li>`
        )
        .join('')}</ul>`
    : '';

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Campaign Audit #${escapeHtmlServer(audit.reviewNumber || '')}</title>
<style>
  body { font-family: Inter, Arial, sans-serif; color:#0f172a; background:#f7f9fc; margin:0; padding:24px; }
  .sheet { max-width:760px; margin:0 auto; background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:28px; box-shadow:0 14px 36px rgba(15,23,42,.08); }
  .brand { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
  .brand .logo { width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;display:grid;place-items:center;font-size:20px; }
  .brand b { font-size:18px; }
  .muted { color:#64748b; font-size:13px; }
  h1 { font-size:20px; margin:16px 0 4px; }
  .row { display:flex; gap:16px; flex-wrap:wrap; margin-top:12px; }
  .box { flex:1; min-width:220px; border:1px solid #e2e8f0; border-radius:12px; padding:14px; }
  .score { font-size:30px; font-weight:900; }
  .bar { height:12px; border-radius:999px; background:#eef2f7; overflow:hidden; margin-top:8px; }
  .bar > div { height:100%; border-radius:999px; }
  h2 { font-size:14px; margin:22px 0 8px; }
  ul { list-style:none; padding:0; margin:0; }
  .actions { max-width:760px; margin:16px auto 0; display:flex; gap:10px; }
  button { padding:10px 16px;border:0;border-radius:10px;font-weight:800;cursor:pointer;background:#2563eb;color:#fff; }
  @media print { .actions { display:none; } body { background:#fff; padding:0; } .sheet { border:0; box-shadow:none; } }
</style>
</head>
<body>
  <div class="sheet">
    <div class="brand">
      <div class="logo">🤖</div>
      <b>Bot Ads Manager — Campaign Audit</b>
    </div>
    <div class="muted">Review #${escapeHtmlServer(audit.reviewNumber || '')} • ${escapeHtmlServer(dateStr)} ${audit.adAccountId ? '• ' + escapeHtmlServer(audit.adAccountId) : ''} ${audit.operatorName ? '• ' + escapeHtmlServer(audit.operatorName) : ''}</div>

    <div class="row">
      <div class="box">
        <div class="muted">Setup Score (trước khi chạy)</div>
        <div class="score" style="color:${color};">${score}/100</div>
        <div class="muted">${score >= 65 ? '✓' : score >= 45 ? '⚠' : '✕'} ${escapeHtmlServer(audit.readiness || audit.grade || '')}</div>
        <div class="bar"><div style="width:${Math.max(0, Math.min(100, score))}%;background:${color};"></div></div>
      </div>
      <div class="box">
        <div class="muted">Analysis Confidence (độ tin cậy của AI)</div>
        <div class="score" style="color:${confColor};">${Number(conf.percent) || 0}%</div>
        ${confReasons}
        ${conf.note ? `<div class="muted" style="margin-top:6px;">ⓘ ${escapeHtmlServer(conf.note)}</div>` : ''}
      </div>
    </div>

    ${bdHtml}

    ${prioHtml ? `<h2>Ưu tiên xử lý</h2><ul>${prioHtml}</ul>` : ''}

    <h2>Checklist</h2>
    <ul>${checkHtml}</ul>

    ${audit.aiSummary ? `<h2>Nhận xét</h2><div style="white-space:pre-wrap;line-height:1.5;font-size:14px;">${escapeHtmlServer(audit.aiSummary)}</div>` : ''}

    <p class="muted" style="margin-top:20px;">Đây là gợi ý tổng quan, không phải cam kết kết quả. Quyết định cuối cùng thuộc về người chạy quảng cáo.</p>
  </div>

  <div class="actions">
    <button onclick="window.print()">🖨 Tải PDF / In</button>
  </div>
</body>
</html>`;
}

app.get('/ai/status', (_req, res) => {
  res.json({ ok: true, ...getAiInfo() });
});

app.post('/ai/explain-field', async (req, res) => {
  try {
    const { field } = req.body || {};
    if (!field) return res.status(400).json({ ok: false, error: 'Missing field' });
    const data = await explainField({ field });
    res.json(data);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Explain failed' });
  }
});

app.post('/ai/review-campaign', async (req, res) => {
  try {
    const body = req.body || {};
    const data = await reviewCampaign(body);

    if (data.ok && body.save !== false) {
      try {
        const saved = saveAudit({
          score: data.score,
          grade: data.grade,
          readiness: data.readiness,
          breakdown: data.breakdown,
          bar: data.bar,
          confidence: data.confidence,
          priorities: data.priorities,
          checklist: data.checklist,
          goods: data.goods,
          warnings: data.warnings,
          aiSummary: data.aiSummary || null,
          operatorName: String(req.headers['x-operator-name'] || body.operatorName || '').trim(),
          adAccountId: String(body.adAccountId || '').trim(),
          campaignType: body.campaignType || 'messenger'
        });
        data.reviewId = saved.id;
        data.reviewNumber = saved.reviewNumber;
        data.createdAt = saved.createdAt;
        const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        data.shareUrl = `${proto}://${req.get('host')}/review/${saved.id}`;
      } catch {
        // Non-fatal: audit persistence may be unavailable on serverless.
      }
    }

    res.json(data);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Review failed' });
  }
});

app.get('/audit/history', (req, res) => {
  try {
    const rows = listAudits(Number(req.query.limit || 50));
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Cannot read history' });
  }
});

app.get('/audit/:id', (req, res) => {
  try {
    const audit = getAudit(req.params.id);
    if (!audit) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, audit });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Cannot read audit' });
  }
});

app.get('/review/:id', (req, res) => {
  const audit = getAudit(req.params.id);
  if (!audit) {
    return res.status(404).send('<h1>Review not found</h1>');
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderReviewPage(audit));
});

app.post('/ai/suggest-target', async (req, res) => {
  try {
    const { industry, location, note } = req.body || {};
    const data = await suggestTarget({ industry, location, note });
    res.status(data.ok ? 200 : 400).json(data);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Suggest failed' });
  }
});

app.post('/ai/generate-content', async (req, res) => {
  try {
    const { product, tone, extra } = req.body || {};
    if (!product) return res.status(400).json({ ok: false, error: 'Missing product' });
    const data = await generateContent({ product, tone, extra });
    res.status(data.ok ? 200 : 400).json(data);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Generate failed' });
  }
});

app.post('/ai/analyze-report', async (req, res) => {
  try {
    const { metrics, note } = req.body || {};
    const data = await analyzeReport({ metrics: metrics || {}, note });
    res.status(data.ok ? 200 : 400).json(data);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Analyze failed' });
  }
});

app.post('/ai/chat', async (req, res) => {
  try {
    const { messages, userMessage } = req.body || {};
    if (!userMessage) return res.status(400).json({ ok: false, error: 'Missing userMessage' });
    const data = await aiChat({ messages: messages || [], userMessage });
    res.status(data.ok ? 200 : 400).json(data);
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message || 'Chat failed' });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

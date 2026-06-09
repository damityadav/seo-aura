/* ===================================================
   SEO Aura - Popup JS with Zero-Dependency ZIP Compiler
   =================================================== */

// --- 1. LIGHTWEIGHT PURE JS ZIP WRITER (STORE FORMAT) ---

const makeCRCTable = () => {
  let c;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
  }
  return crcTable;
};

const crcTable = makeCRCTable();

const calculateCRC32 = (data) => {
  let crc = 0 ^ (-1);
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
};

function createZipBlob(files) {
  const localHeaders = [];
  const centralDirs = [];
  let currentOffset = 0;
  
  const textEncoder = new TextEncoder();
  
  files.forEach(file => {
    const filenameBytes = textEncoder.encode(file.name);
    const dataBytes = file.data;
    const crc = calculateCRC32(dataBytes);
    
    // Local File Header
    const localHeader = new Uint8Array(30 + filenameBytes.length);
    const dvLocal = new DataView(localHeader.buffer);
    
    dvLocal.setUint32(0, 0x04034b50, true);
    dvLocal.setUint16(4, 10, true);
    dvLocal.setUint16(6, 0, true);
    dvLocal.setUint16(8, 0, true);
    dvLocal.setUint16(10, 0, true);
    dvLocal.setUint16(12, 0, true);
    dvLocal.setUint32(14, crc, true);
    dvLocal.setUint32(18, dataBytes.length, true);
    dvLocal.setUint32(22, dataBytes.length, true);
    dvLocal.setUint16(26, filenameBytes.length, true);
    dvLocal.setUint16(28, 0, true);
    localHeader.set(filenameBytes, 30);
    
    localHeaders.push(localHeader);
    localHeaders.push(dataBytes);
    
    // Central Directory Entry
    const centralHeader = new Uint8Array(46 + filenameBytes.length);
    const dvCentral = new DataView(centralHeader.buffer);
    
    dvCentral.setUint32(0, 0x02014b50, true);
    dvCentral.setUint16(4, 20, true);
    dvCentral.setUint16(6, 10, true);
    dvCentral.setUint16(8, 0, true);
    dvCentral.setUint16(10, 0, true);
    dvCentral.setUint16(12, 0, true);
    dvCentral.setUint16(14, 0, true);
    dvCentral.setUint32(16, crc, true);
    dvCentral.setUint32(20, dataBytes.length, true);
    dvCentral.setUint32(24, dataBytes.length, true);
    dvCentral.setUint16(28, filenameBytes.length, true);
    dvCentral.setUint16(30, 0, true);
    dvCentral.setUint16(32, 0, true);
    dvCentral.setUint16(34, 0, true);
    dvCentral.setUint16(36, 0, true);
    dvCentral.setUint32(38, 0, true);
    dvCentral.setUint32(42, currentOffset, true);
    centralHeader.set(filenameBytes, 46);
    
    centralDirs.push(centralHeader);
    
    currentOffset += localHeader.length + dataBytes.length;
  });
  
  const centralDirSize = centralDirs.reduce((acc, curr) => acc + curr.length, 0);
  
  const eocd = new Uint8Array(22);
  const dvEocd = new DataView(eocd.buffer);
  
  dvEocd.setUint32(0, 0x06054b50, true);
  dvEocd.setUint16(4, 0, true);
  dvEocd.setUint16(6, 0, true);
  dvEocd.setUint16(8, files.length, true);
  dvEocd.setUint16(10, files.length, true);
  dvEocd.setUint32(12, centralDirSize, true);
  dvEocd.setUint32(16, currentOffset, true);
  dvEocd.setUint16(20, 0, true);
  
  const blobParts = [...localHeaders, ...centralDirs, eocd];
  return new Blob(blobParts, { type: 'application/zip' });
}


// --- 2. PREMIUM DEVELOPER SYNTAX HIGHLIGHTER ---
function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
        return '<span class="' + cls + '">' + match.substring(0, match.length - 1) + '</span>:';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

// Basic HTML Escaper - robust against arrays, numbers, objects
function escapeHtml(val) {
  if (val === null || val === undefined) return "";
  let str = "";
  if (typeof val === 'string') {
    str = val;
  } else if (Array.isArray(val)) {
    str = val.join(', ');
  } else {
    str = String(val);
  }
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// --- 3. LOCAL SCHEMA VALIDATOR (Google Rich Guidelines) ---
function validateSchema(type, data) {
  const errors = [];
  const warnings = [];
  
  let typeStr = "StructuredData";
  if (typeof type === 'string') {
    typeStr = type;
  } else if (Array.isArray(type)) {
    typeStr = type.join(', ');
  } else if (type) {
    typeStr = String(type);
  }
  
  const lType = typeStr.toLowerCase();
  
  if (lType.includes('product')) {
    if (!data.name) errors.push('Missing required property: "name"');
    if (!data.image) warnings.push('Missing recommended property: "image"');
    if (!data.description) warnings.push('Missing recommended property: "description"');
    if (!data.brand) warnings.push('Missing recommended property: "brand"');
    if (!data.offers) {
      warnings.push('Missing recommended property: "offers"');
    } else {
      const offers = Array.isArray(data.offers) ? data.offers[0] : data.offers;
      if (!offers.price) warnings.push('Missing recommended property: "offers.price"');
      if (!offers.priceCurrency) warnings.push('Missing recommended property: "offers.priceCurrency"');
      if (!offers.availability) warnings.push('Missing recommended property: "offers.availability"');
    }
    if (!data.aggregateRating && !data.review) {
      warnings.push('Missing recommended property: "aggregateRating" or "review"');
    }
  } else if (lType.includes('article') || lType.includes('blogposting') || lType.includes('newsarticle')) {
    if (!data.headline) errors.push('Missing required property: "headline"');
    if (!data.datePublished) errors.push('Missing required property: "datePublished"');
    if (!data.image) warnings.push('Missing recommended property: "image"');
    if (!data.author) warnings.push('Missing recommended property: "author"');
    if (!data.publisher) warnings.push('Missing recommended property: "publisher"');
    if (!data.dateModified) warnings.push('Missing recommended property: "dateModified"');
    if (!data.description) warnings.push('Missing recommended property: "description"');
  } else if (lType.includes('recipe')) {
    if (!data.name) errors.push('Missing required property: "name"');
    if (!data.image) warnings.push('Missing recommended property: "image"');
    if (!data.recipeIngredient) warnings.push('Missing recommended property: "recipeIngredient"');
    if (!data.recipeInstructions) warnings.push('Missing recommended property: "recipeInstructions"');
    if (!data.author) warnings.push('Missing recommended property: "author"');
  } else if (lType.includes('faqpage')) {
    const mainEntity = data.mainEntity;
    if (!mainEntity) {
      errors.push('Missing required property: "mainEntity"');
    } else {
      const list = Array.isArray(mainEntity) ? mainEntity : [mainEntity];
      if (list.length === 0) {
        errors.push('"mainEntity" array is empty');
      } else {
        list.forEach((q, i) => {
          const qName = q.name || q.headline || "";
          if (!qName) errors.push(`Question [${i+1}] missing required property: "name"`);
          
          const ans = q.acceptedAnswer;
          if (!ans) {
            errors.push(`Question [${i+1}] missing required property: "acceptedAnswer"`);
          } else {
            const txt = ans.text || ans.description || "";
            if (!txt) errors.push(`Question [${i+1}] acceptedAnswer missing required property: "text"`);
          }
        });
      }
    }
  } else if (lType.includes('breadcrumblist')) {
    const list = data.itemListElement;
    if (!list) {
      errors.push('Missing required property: "itemListElement"');
    } else {
      const items = Array.isArray(list) ? list : [list];
      if (items.length === 0) {
        errors.push('"itemListElement" array is empty');
      } else {
        items.forEach((item, i) => {
          if (item.position === undefined) errors.push(`Item [${i+1}] missing required property: "position"`);
          if (!item.name) errors.push(`Item [${i+1}] missing required property: "name"`);
          if (!item.item && !item.id) errors.push(`Item [${i+1}] missing required property: "item" (target URL)`);
        });
      }
    }
  }
  
  let status = 'passed';
  if (errors.length > 0) status = 'error';
  else if (warnings.length > 0) status = 'warning';
  
  return { status, errors, warnings };
}


// --- 4. GOOGLE RICH RESULTS SEARCH PREVIEW SIMULATOR ---
function renderStars(ratingValue) {
  const rating = parseFloat(ratingValue) || 0;
  const fullStars = Math.round(rating);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars += "★";
    } else {
      stars += "☆";
    }
  }
  return stars;
}

function renderGoogleRichPreview(type, data, domain, metaDesc) {
  let typeStr = "StructuredData";
  if (typeof type === 'string') {
    typeStr = type;
  } else if (Array.isArray(type)) {
    typeStr = type.join(', ');
  } else if (type) {
    typeStr = String(type);
  }
  
  const lType = typeStr.toLowerCase();
  
  // Product Search Previews
  if (lType.includes('product')) {
    const name = data.name || "Product Title";
    const description = data.description || metaDesc;
    
    // Review and Rating details
    let ratingVal = "4.5";
    let reviewCount = "12";
    if (data.aggregateRating) {
      ratingVal = data.aggregateRating.ratingValue || "4.5";
      reviewCount = data.aggregateRating.reviewCount || data.aggregateRating.ratingCount || "12";
    } else if (data.review) {
      const rev = Array.isArray(data.review) ? data.review[0] : data.review;
      if (rev && rev.reviewRating) ratingVal = rev.reviewRating.ratingValue || "5";
    }
    
    // Price details
    let priceVal = "99.99";
    let priceCur = "USD";
    let availability = "InStock";
    if (data.offers) {
      const offers = Array.isArray(data.offers) ? data.offers[0] : data.offers;
      priceVal = offers.price || "99.99";
      priceCur = offers.priceCurrency || "USD";
      availability = offers.availability || "InStock";
    }
    
    const priceSym = priceCur === 'USD' ? '$' : priceCur === 'INR' ? '₹' : priceCur === 'EUR' ? '€' : priceCur + ' ';
    const availabilityStr = String(availability || "").toLowerCase();
    const inStock = availabilityStr.includes('instock') ? 'In stock' : 'Out of stock';
    
    return `
      <div class="google-snippet-wrapper">
        <div class="google-breadcrumb">${escapeHtml(domain)} &gt; products</div>
        <span class="google-title">${escapeHtml(name)}</span>
        <div class="google-meta-desc">${escapeHtml(description)}</div>
        <div class="google-rich-row">
          <span class="google-stars">${renderStars(ratingVal)}</span>
          <span class="google-rating-text">Rating: ${ratingVal} · ‎${reviewCount} reviews · ‎${priceSym}${priceVal} · ‎${inStock}</span>
        </div>
      </div>
    `;
  }
  
  // FAQPage click preview
  if (lType.includes('faqpage')) {
    const mainEntity = data.mainEntity;
    const faqs = [];
    if (mainEntity) {
      const list = Array.isArray(mainEntity) ? mainEntity : [mainEntity];
      list.forEach(q => {
        const question = q.name || q.headline || "";
        const answer = q.acceptedAnswer ? (q.acceptedAnswer.text || q.acceptedAnswer.description || "") : "";
        if (question && answer) {
          faqs.push({ q: question, a: answer });
        }
      });
    }
    
    const displayFaqs = faqs.slice(0, 3);
    
    return `
      <div class="google-snippet-wrapper">
        <div class="google-breadcrumb">${escapeHtml(domain)} &gt; faq</div>
        <span class="google-title">Frequently Asked Questions - FAQ</span>
        <div class="google-meta-desc">${escapeHtml(metaDesc)}</div>
        <div class="google-faq-section">
          ${displayFaqs.map(faq => `
            <div class="google-faq-item">
              <div class="google-faq-q">${escapeHtml(faq.q)} <span class="faq-chevron">▼</span></div>
              <div class="google-faq-a">${faq.a}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Article News/Blog previews
  if (lType.includes('article') || lType.includes('blogposting') || lType.includes('newsarticle')) {
    const headline = data.headline || "Article Headline";
    const description = data.description || metaDesc;
    
    let authorName = "Author";
    if (data.author) {
      authorName = Array.isArray(data.author) ? (data.author[0].name || data.author[0]) : (data.author.name || data.author);
    }
    
    let publisherName = "";
    if (data.publisher) {
      publisherName = data.publisher.name || data.publisher;
    }
    
    let dateStr = "";
    if (data.datePublished) {
      try {
        dateStr = new Date(data.datePublished).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
        dateStr = data.datePublished;
      }
    }
    
    const byLine = `By ${authorName}` + (publisherName ? ` (${publisherName})` : "");
    
    return `
      <div class="google-snippet-wrapper">
        <div class="google-breadcrumb">${escapeHtml(domain)} &gt; news</div>
        <span class="google-title">${escapeHtml(headline)}</span>
        <div class="google-meta-desc">${escapeHtml(description)}</div>
        <div class="google-rich-row">
          <span class="google-rating-text">${escapeHtml(byLine)} · ‎Published ${escapeHtml(dateStr)}</span>
        </div>
      </div>
    `;
  }
  
  // Breadcrumbs List preview
  if (lType.includes('breadcrumblist')) {
    const list = data.itemListElement;
    const paths = [];
    if (list) {
      const items = Array.isArray(list) ? list : [list];
      items.sort((a,b) => (a.position || 0) - (b.position || 0));
      items.forEach(item => {
        if (item.name) paths.push(item.name);
      });
    }
    
    const breadcrumbPathStr = paths.length > 0 ? paths.join(' > ') : `${domain} > breadcrumbs`;
    
    return `
      <div class="google-snippet-wrapper">
        <div class="google-breadcrumb">${escapeHtml(breadcrumbPathStr)}</div>
        <span class="google-title">Breadcrumb Structure Directory</span>
        <div class="google-meta-desc">${escapeHtml(metaDesc)}</div>
      </div>
    `;
  }
  
  // Default Generic search result fallback
  const genericTitle = data.name || data.headline || "Structured Data Element";
  const genericDesc = data.description || metaDesc;
  
  return `
    <div class="google-snippet-wrapper">
      <div class="google-breadcrumb">${escapeHtml(domain)} &gt; details</div>
      <span class="google-title">${escapeHtml(genericTitle)}</span>
      <div class="google-meta-desc">${escapeHtml(genericDesc)}</div>
    </div>
  `;
}


// --- 5. EXTENSION POPUP INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const tabSeo = document.getElementById('tab-seo');
  const tabTrackers = document.getElementById('tab-trackers');
  const tabText = document.getElementById('tab-text');
  const tabImages = document.getElementById('tab-images');
  const tabSchema = document.getElementById('tab-schema');
  const tabPagespeed = document.getElementById('tab-pagespeed');
  
  const trackerBadge = document.getElementById('tracker-badge');
  const imagesBadge = document.getElementById('images-badge');
  const schemaBadge = document.getElementById('schema-badge');
  
  const panelLoading = document.getElementById('panel-loading');
  const panelSeo = document.getElementById('panel-seo');
  const panelTrackers = document.getElementById('panel-trackers');
  const panelText = document.getElementById('panel-text');
  const panelImages = document.getElementById('panel-images');
  const panelSchema = document.getElementById('panel-schema');
  const panelError = document.getElementById('panel-error');
  
  const domainName = document.getElementById('domain-name');
  
  const btnRefresh = document.getElementById('btn-refresh');
  const btnRetry = document.getElementById('btn-retry');
  
  // Accordion Buttons
  const btnErrors = document.getElementById('acc-btn-errors');
  const btnWarnings = document.getElementById('acc-btn-warnings');
  const btnPassed = document.getElementById('acc-btn-passed');
  
  // Accordion List Containers
  const listErrors = document.getElementById('list-errors');
  const listWarnings = document.getElementById('list-warnings');
  const listPassed = document.getElementById('list-passed');
  
  // Group Counts
  const badgeErrors = document.getElementById('badge-errors');
  const badgeWarnings = document.getElementById('badge-warnings');
  const badgePassed = document.getElementById('badge-passed');
  
  // Score Ring & Text
  const scoreFill = document.getElementById('score-fill');
  const seoScoreNum = document.getElementById('seo-score-num');
  const scoreTitle = document.getElementById('score-title');
  const scoreSubtitle = document.getElementById('score-subtitle');
  
  // Trackers Elements
  const trackersTotalNum = document.getElementById('trackers-total-num');
  const trackersSummaryText = document.getElementById('trackers-summary-text');
  const trackersList = document.getElementById('trackers-list');
  const trackersEmpty = document.getElementById('trackers-empty');

  // Copy Text Elements
  const btnCopyContent = document.getElementById('btn-copy-content');
  const btnCopyText = document.getElementById('btn-copy-text');
  const textPreviewBox = document.getElementById('text-preview-box');
  const textStatsLabel = document.getElementById('text-stats-label');

  // Images Downloader Elements
  const btnDownloadAll = document.getElementById('btn-download-all');
  const imagesTotalDisplay = document.getElementById('images-total-display');
  const imagesList = document.getElementById('images-list');
  const imagesEmpty = document.getElementById('images-empty');

  // Schema Checker Elements
  const schemasTotalNum = document.getElementById('schemas-total-num');
  const schemasSummaryText = document.getElementById('schemas-summary-text');
  const schemaList = document.getElementById('schema-list');
  const schemaEmpty = document.getElementById('schema-empty');

  // Toast Notification Elements
  const toastNotification = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  
  // PageSpeed Elements
  const panelPagespeed = document.getElementById('panel-pagespeed');
  const speedUrlInput = document.getElementById('speed-url');
  const btnStrategyMobile = document.getElementById('btn-strategy-mobile');
  const btnStrategyDesktop = document.getElementById('btn-strategy-desktop');
  const btnAnalyzeSpeed = document.getElementById('btn-analyze-speed');
  const speedLoader = document.getElementById('speed-loader');
  const speedLoaderText = document.getElementById('speed-loader-text');
  const speedResult = document.getElementById('speed-result');
  const speedRadialFill = document.getElementById('speed-radial-fill');
  const speedScoreNum = document.getElementById('speed-score-num');
  const speedScoreTitle = document.getElementById('speed-score-title');
  const speedScoreSubtitle = document.getElementById('speed-score-subtitle');
  
  const dotFcp = document.getElementById('dot-fcp');
  const valFcp = document.getElementById('val-fcp');
  const dotLcp = document.getElementById('dot-lcp');
  const valLcp = document.getElementById('val-lcp');
  const dotCls = document.getElementById('dot-cls');
  const valCls = document.getElementById('val-cls');
  const dotTbt = document.getElementById('dot-tbt');
  const valTbt = document.getElementById('val-tbt');
  const dotSi = document.getElementById('dot-si');
  const valSi = document.getElementById('val-si');
  const dotTti = document.getElementById('dot-tti');
  const valTti = document.getElementById('val-tti');
  
  const speedBadgeSavings = document.getElementById('speed-badge-savings');
  const speedOpportunitiesList = document.getElementById('speed-opportunities-list');
  
  // API Key Settings Elements
  const btnToggleApiKey = document.getElementById('btn-toggle-api-key');
  const apiKeyContainer = document.getElementById('api-key-container');
  const pagespeedApiKeyInput = document.getElementById('pagespeed-api-key');
  const btnSaveApiKey = document.getElementById('btn-save-api-key');
  const apiKeyStatus = document.getElementById('api-key-status');
  const pagespeedErrorCard = document.getElementById('pagespeed-error-card');
  const pagespeedAllowedReferer = document.getElementById('pagespeed-allowed-referer');

  // --- State Variables ---
  let auditResult = null;
  let toastTimeout = null;

  // Load saved PageSpeed API Key
  chrome.storage.local.get(['pagespeedApiKey'], (result) => {
    if (result && result.pagespeedApiKey) {
      pagespeedApiKeyInput.value = result.pagespeedApiKey;
    }
  });

  // --- Initialize Events ---
  
  // Tab Switchers
  tabSeo.addEventListener('click', () => switchTab('seo'));
  tabTrackers.addEventListener('click', () => switchTab('trackers'));
  tabText.addEventListener('click', () => switchTab('text'));
  tabImages.addEventListener('click', () => switchTab('images'));
  tabSchema.addEventListener('click', () => switchTab('schema'));
  tabPagespeed.addEventListener('click', () => switchTab('pagespeed'));
  
  // PageSpeed Strategy state and buttons
  let activeStrategy = 'mobile';
  
  btnStrategyMobile.addEventListener('click', () => {
    if (activeStrategy === 'mobile') return;
    activeStrategy = 'mobile';
    btnStrategyMobile.classList.add('active');
    btnStrategyDesktop.classList.remove('active');
  });
  
  btnStrategyDesktop.addEventListener('click', () => {
    if (activeStrategy === 'desktop') return;
    activeStrategy = 'desktop';
    btnStrategyDesktop.classList.add('active');
    btnStrategyMobile.classList.remove('active');
  });
  
  btnAnalyzeSpeed.addEventListener('click', handleSpeedAnalysis);
  
  // API Key Settings Toggle
  btnToggleApiKey.addEventListener('click', () => {
    const isHidden = apiKeyContainer.classList.contains('hidden');
    if (isHidden) {
      apiKeyContainer.classList.remove('hidden');
      btnToggleApiKey.textContent = '🔒 Hide API Settings';
    } else {
      apiKeyContainer.classList.add('hidden');
      btnToggleApiKey.textContent = '🔑 Configure PageSpeed API Key';
    }
  });

  // Save API Key Handler
  btnSaveApiKey.addEventListener('click', () => {
    const key = pagespeedApiKeyInput.value.trim();
    chrome.storage.local.set({ pagespeedApiKey: key }, () => {
      apiKeyStatus.textContent = key ? "API Key Saved Successfully!" : "API Key Cleared!";
      apiKeyStatus.style.color = key ? "#4ade80" : "#fca5a5";
      apiKeyStatus.style.display = "block";
      showFloatingToast(key ? "API Key Saved!" : "API Key Cleared!");
      setTimeout(() => {
        apiKeyStatus.style.display = "none";
      }, 3000);
    });
  });

  
  // Accordions Toggles
  btnErrors.addEventListener('click', () => toggleAccordion('errors'));
  btnWarnings.addEventListener('click', () => toggleAccordion('warnings'));
  btnPassed.addEventListener('click', () => toggleAccordion('passed'));
  
  // Refresh & Retry
  btnRefresh.addEventListener('click', scanActiveTab);
  btnRetry.addEventListener('click', scanActiveTab);
  

  
  // Event Delegation for dynamic Tracker Cards to expand detection details
  trackersList.addEventListener('click', (e) => {
    const card = e.target.closest('.tracker-card');
    if (!card) return;
    
    // Only toggle if they didn't click inside an expanded content area
    if (!e.target.closest('.tracker-det-content')) {
      card.classList.toggle('expanded');
    }
  });

  // Event Delegation for dynamic Schema Cards to expand code/preview
  schemaList.addEventListener('click', (e) => {
    // FAQ accordion toggle checks
    const faqQ = e.target.closest('.google-faq-q');
    if (faqQ) {
      const faqItem = faqQ.closest('.google-faq-item');
      if (faqItem) faqItem.classList.toggle('expanded');
      return;
    }

    const card = e.target.closest('.tracker-card');
    if (!card) return;
    
    // Ignores toggle checks if clicking inside the nested console/snippet wrappers
    if (!e.target.closest('.tracker-det-content') && !e.target.closest('.google-snippet-wrapper')) {
      card.classList.toggle('expanded');
    }
  });

  // Event handler for single image downloads (using delegation)
  imagesList.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-download-single');
    if (!btn) return;
    
    const imgUrl = btn.dataset.url;
    const filename = btn.dataset.filename || 'downloaded-image.png';
    
    downloadSingleFile(imgUrl, filename);
  });

  // Copy Content Button Handler
  btnCopyContent.addEventListener('click', copyExtractedText);

  // Download All Button Handler (ZIP Archive)
  btnDownloadAll.addEventListener('click', downloadAllImagesAsZip);

  // --- Main Execution Functions ---
  
  // Scan Active Tab
  async function scanActiveTab() {
    showPanel('loading');
    trackerBadge.classList.add('hidden');
    imagesBadge.classList.add('hidden');
    schemaBadge.classList.add('hidden');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        showError("No Active Tab Found", "Please open a web page and try again.");
        return;
      }
      
      const url = tab.url || "";
      
      if (url && !url.startsWith('chrome://') && !url.startsWith('chrome-extension://') && !url.startsWith('about:') && !url.startsWith('view-source:')) {
        speedUrlInput.value = url;
      }
      
      if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:') || url.startsWith('view-source:')) {
        showError(
          "Restricted Webpage",
          "SEO Aura cannot scan internal browser pages (chrome://), extension panels, or blank tabs. Please navigate to a public website to audit."
        );
        domainName.textContent = "restricted-tab";
        return;
      }
      
      try {
        const urlObj = new URL(url);
        domainName.textContent = urlObj.hostname;
      } catch (e) {
        domainName.textContent = "unrecognized-site";
      }
      
      // Inject Content Script
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content/analyzer.js']
      });
      
      if (!results || !results[0] || !results[0].result) {
        showError("Scanning Failed", "We were unable to extract data from this page. Try reloading the tab.");
        return;
      }
      
      auditResult = results[0].result;
      
      if (auditResult.error) {
        showError("Audit Script Error", auditResult.error);
        return;
      }
      
      renderAuditData(auditResult);
      showPanel('seo');
      switchTab('seo'); // Default to SEO tab
      
    } catch (err) {
      console.error("Scan error:", err);
      const errMessage = err.message || String(err);
      const isBlocked = errMessage.includes("Cannot access") || 
                        errMessage.includes("security restrictions") || 
                        errMessage.includes("restricted") || 
                        errMessage.includes("extension context") || 
                        errMessage.includes("not allowed");
      if (isBlocked) {
        showError(
          "Script Injection Blocked",
          "Chrome prevents injecting extension scripts into the Chrome Web Store or internal pages for security. Navigate to another site and try again."
        );
      } else {
        showError(
          "Analysis Runtime Error",
          `An unexpected error occurred: ${errMessage}. Please check the console log for details.`
        );
      }
    }
  }

  // Render Data
  function renderAuditData(data) {
    const { seo, trackers, structuredText, extractedImages, extractedSchemas } = data;
    const currentDomain = domainName.textContent || "example.com";
    

    const metaDescription = seo.metaDescription || "Website content description.";
    
    // 1. Calculate and Render SEO Score
    const auditChecks = evaluateSeo(seo);
    const score = calculateScore(auditChecks);
    animateScoreRing(score);
    
    // Sort SEO items into groups
    const errors = auditChecks.filter(c => c.status === 'error');
    const warnings = auditChecks.filter(c => c.status === 'warning');
    const passes = auditChecks.filter(c => c.status === 'passed');
    
    badgeErrors.textContent = errors.length;
    badgeWarnings.textContent = warnings.length;
    badgePassed.textContent = passes.length;
    
    const errorsGroup = btnErrors.closest('.accordion-group');
    const warningsGroup = btnWarnings.closest('.accordion-group');
    const passedGroup = btnPassed.closest('.accordion-group');
    
    errorsGroup.classList.remove('expanded');
    warningsGroup.classList.remove('expanded');
    passedGroup.classList.remove('expanded');
    
    if (errors.length > 0) {
      errorsGroup.classList.add('expanded');
    } else if (warnings.length > 0) {
      warningsGroup.classList.add('expanded');
    } else {
      passedGroup.classList.add('expanded');
    }
    
    listErrors.innerHTML = renderListHTML(errors);
    listWarnings.innerHTML = renderListHTML(warnings);
    listPassed.innerHTML = renderListHTML(passes);
    
    // 2. Render Trackers & Pixels
    const trackerCount = trackers.length;
    trackersTotalNum.textContent = trackerCount;
    
    if (trackerCount > 0) {
      trackerBadge.textContent = trackerCount;
      trackerBadge.classList.remove('hidden');
      trackersSummaryText.textContent = `${trackerCount} active marketing, analytics, or social pixel scripts found.`;
      trackersEmpty.classList.add('hidden');
      trackersList.classList.remove('hidden');
      
      trackersList.innerHTML = trackers.map(tr => {
        const catLabel = getCategoryLabel(tr.category);
        return `
          <div class="tracker-card">
            <div class="tracker-card-header">
              <div class="tracker-brand">
                <span class="tracker-logo">${tr.logo}</span>
                <span class="tracker-name">${tr.name}</span>
              </div>
              <span class="tracker-badge badge-cat-${tr.category}">${catLabel}</span>
            </div>
            <p class="tracker-desc">${tr.description}</p>
            <div class="tracker-detection-expand">
              <button class="tracker-det-btn">Show Detection Source</button>
              <div class="tracker-det-content">
                ${tr.triggers.map(trigger => `<div class="trigger-item">${escapeHtml(trigger)}</div>`).join('')}
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      trackerBadge.classList.add('hidden');
      trackersSummaryText.textContent = "This website is exceptionally clean and privacy-focused.";
      trackersList.classList.add('hidden');
      trackersEmpty.classList.remove('hidden');
    }

    // 3. Render Structured Copy Text
    if (structuredText) {
      const wordCount = structuredText.split(/\s+/).filter(Boolean).length;
      textStatsLabel.textContent = `${wordCount} words formatted and extracted (Anti-Copy Bypassed)`;
      textPreviewBox.textContent = structuredText;
    } else {
      textStatsLabel.textContent = "0 words extracted";
      textPreviewBox.textContent = "No copyable text elements found on this page.";
    }

    // 4. Render Images Gallery
    const imageCount = extractedImages ? extractedImages.length : 0;
    imagesTotalDisplay.textContent = imageCount;
    
    if (imageCount > 0) {
      imagesBadge.textContent = imageCount;
      imagesBadge.classList.remove('hidden');
      imagesEmpty.classList.add('hidden');
      imagesList.classList.remove('hidden');
      
      imagesList.innerHTML = extractedImages.map(img => {
        const altStatusClass = img.alt ? 'alt-present' : 'alt-absent';
        const altLabel = img.alt ? 'ALT OK' : 'ALT MISSING';
        const dimsLabel = (img.width > 0 && img.height > 0) ? `${img.width}x${img.height}` : 'SVG/Dynamic';
        
        return `
          <div class="image-card">
            <div class="image-thumbnail-wrapper">
              <img src="${escapeHtml(img.url)}" class="image-thumbnail" alt="${escapeHtml(img.alt)}" loading="lazy">
              <span class="image-dims">${dimsLabel}</span>
            </div>
            <div class="image-info">
              <span class="image-name" title="${escapeHtml(img.filename)}">${escapeHtml(img.filename)}</span>
              <div class="image-card-actions">
                <span class="image-alt-badge ${altStatusClass}">${altLabel}</span>
                <button class="btn-download-single" data-url="${escapeHtml(img.url)}" data-filename="${escapeHtml(img.filename)}" title="Download Image">
                  📥
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      imagesBadge.classList.add('hidden');
      imagesList.classList.add('hidden');
      imagesEmpty.classList.remove('hidden');
    }

    // 5. Render Google Structured Data Schema Checker with Validation & Previews
    const schemas = extractedSchemas || [];
    const schemaCount = schemas.length;
    schemasTotalNum.textContent = schemaCount;
    
    if (schemaCount > 0) {
      schemaBadge.textContent = schemaCount;
      schemaBadge.classList.remove('hidden');
      schemasSummaryText.textContent = `${schemaCount} Google structured data schema elements detected on this webpage.`;
      schemaEmpty.classList.add('hidden');
      schemaList.classList.remove('hidden');
      
      schemaList.innerHTML = schemas.map((sch, index) => {
        const badgeFormatClass = sch.format === 'json-ld' ? 'badge-format-json-ld' : 'badge-format-microdata';
        const formatLabel = sch.format === 'json-ld' ? 'JSON-LD' : 'Microdata';
        
        // A. Local Schema Validation
        const validation = validateSchema(sch.type, sch.data);
        const valStatusClass = validation.status === 'error' ? 'item-badge-error' : validation.status === 'warning' ? 'item-badge-warning' : 'item-badge-passed';
        const valStatusLabel = validation.status === 'error' ? '🔴 ERRORS' : validation.status === 'warning' ? '🟡 WARNINGS' : '🟢 OPTIMIZED';
        
        let alertBannerHTML = "";
        if (validation.status === 'error') {
          alertBannerHTML = `
            <div class="schema-validation-alert alert-schema-error">
              <div class="alert-title">⚠️ Rich Result Blocked</div>
              <ul class="alert-list">
                ${validation.errors.map(err => `<li>${escapeHtml(err)}</li>`).join('')}
              </ul>
            </div>
          `;
        } else if (validation.status === 'warning') {
          alertBannerHTML = `
            <div class="schema-validation-alert alert-schema-warning">
              <div class="alert-title">⚠️ Recommended Tweaks</div>
              <ul class="alert-list">
                ${validation.warnings.map(wr => `<li>${escapeHtml(wr)}</li>`).join('')}
              </ul>
            </div>
          `;
        } else {
          alertBannerHTML = `
            <div class="schema-validation-alert alert-schema-passed">
              <div class="alert-title">✓ Google Validated</div>
              <div class="alert-desc">All required and recommended schema data fields are fully configured.</div>
            </div>
          `;
        }
        
        // B. Structured Google Rich Preview
        const richPreviewHTML = renderGoogleRichPreview(sch.type, sch.data, currentDomain, metaDescription);
        const prettyCode = syntaxHighlight(sch.data);
        
        return `
          <div class="tracker-card schema-card" id="schema-card-${index}">
            <div class="tracker-card-header">
              <div class="tracker-brand">
                <span class="tracker-logo">🧩</span>
                <span class="tracker-name">${escapeHtml(sch.type)} Schema</span>
              </div>
              <div style="display: flex; gap: 4px; align-items: center;">
                <span class="audit-item-badge ${valStatusClass}" style="font-size: 8px; padding: 2px 5px;">${valStatusLabel}</span>
                <span class="tracker-badge ${badgeFormatClass}">${formatLabel}</span>
              </div>
            </div>
            
            <p class="tracker-desc">Structured metadata declaring properties of type <strong>${escapeHtml(sch.type)}</strong> to search crawlers.</p>
            
            ${alertBannerHTML}
            
            <div class="tracker-detection-expand" style="margin-bottom: 8px;">
              <button class="tracker-det-btn" style="color: #6366f1;">👁️ Preview Google Search Result</button>
              <div class="tracker-det-content">
                ${richPreviewHTML}
              </div>
            </div>

            <div class="tracker-detection-expand">
              <button class="tracker-det-btn">View Code Schema</button>
              <div class="tracker-det-content">
                <pre class="schema-console-box">${prettyCode}</pre>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      schemaBadge.classList.add('hidden');
      schemasSummaryText.textContent = "No Google structured data found on this website.";
      schemaList.classList.add('hidden');
      schemaEmpty.classList.remove('hidden');
    }
  }

  // Switch Tabs Navigation
  function switchTab(tabName) {
    const tabs = [
      { id: 'seo', btn: tabSeo, panel: panelSeo },
      { id: 'trackers', btn: tabTrackers, panel: panelTrackers },
      { id: 'text', btn: tabText, panel: panelText },
      { id: 'images', btn: tabImages, panel: panelImages },
      { id: 'schema', btn: tabSchema, panel: panelSchema },
      { id: 'pagespeed', btn: tabPagespeed, panel: panelPagespeed }
    ];
    
    // Reset scroll position of main content container to top
    const mainContent = document.querySelector('.app-main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
    
    tabs.forEach(item => {
      if (item.id === tabName) {
        if (item.btn) item.btn.classList.add('active');
        if (item.panel) item.panel.classList.add('active');
      } else {
        if (item.btn) item.btn.classList.remove('active');
        if (item.panel) item.panel.classList.remove('active');
      }
    });
  }

  // Toggle Accordion Group
  function toggleAccordion(group) {
    const parent = document.getElementById(`acc-btn-${group}`).closest('.accordion-group');
    parent.classList.toggle('expanded');
  }

  // Toggle helper for panels
  function showPanel(panelName) {
    const panels = [panelLoading, panelSeo, panelTrackers, panelText, panelImages, panelSchema, panelPagespeed, panelError];
    panels.forEach(p => { if (p) p.classList.remove('active'); });
    
    if (panelName === 'loading') panelLoading.classList.add('active');
    if (panelName === 'seo') panelSeo.classList.add('active');
    if (panelName === 'trackers') panelTrackers.classList.add('active');
    if (panelName === 'text') panelText.classList.add('active');
    if (panelName === 'images') panelImages.classList.add('active');
    if (panelName === 'schema') panelSchema.classList.add('active');
    if (panelName === 'pagespeed') panelPagespeed.classList.add('active');
    if (panelName === 'error') panelError.classList.add('active');
  }

  // Show Error Panel
  function showError(title, desc) {
    document.getElementById('error-title-text').textContent = title;
    document.getElementById('error-desc-text').textContent = desc;
    showPanel('error');
  }

  // --- PageSpeed Analysis Handler ---
  async function handleSpeedAnalysis() {
    const targetUrl = speedUrlInput.value.trim();
    if (!targetUrl) {
      showFloatingToast("Please enter a target URL!", false);
      return;
    }
    
    // Check basic URL format
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      showFloatingToast("URL must start with http:// or https://", false);
      return;
    }
    
    // Use user-configured API key if available, otherwise call without a key
    let apiKey = "";
    try {
      const result = await new Promise(resolve => {
        chrome.storage.local.get(['pagespeedApiKey'], resolve);
      });
      if (result && result.pagespeedApiKey) {
        apiKey = result.pagespeedApiKey.trim();
      }
    } catch (e) {
      console.warn("Could not read pagespeedApiKey from storage:", e);
    }
    
    // UI state loading
    speedLoader.classList.remove('hidden');
    speedResult.classList.add('hidden');
    pagespeedErrorCard.classList.add('hidden');
    
    try {
      const parsedUrl = new URL(targetUrl);
      speedLoaderText.textContent = `Analyzing ${activeStrategy} speed for ${parsedUrl.hostname}...`;
    } catch (e) {
      speedLoaderText.textContent = `Analyzing ${activeStrategy} speed...`;
    }
    
    try {
      let apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=${activeStrategy}&category=performance`;
      if (apiKey) {
        apiUrl += `&key=${encodeURIComponent(apiKey)}`;
      }
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        let errMsg = `Google API status ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson && errJson.error && errJson.error.message) {
            errMsg = errJson.error.message;
          }
        } catch (e) {
          try {
            const errText = await response.text();
            if (errText) errMsg = errText.substring(0, 100);
          } catch (e2) {}
        }
        throw new Error(errMsg);
      }
      
      const data = await response.json();
      
      if (!data || !data.lighthouseResult) {
        throw new Error("Invalid response schema from Google PageSpeed API");
      }
      
      // Update UI with PageSpeed results
      const lighthouse = data.lighthouseResult;
      const perfCategory = lighthouse.categories.performance;
      const score = (perfCategory && perfCategory.score !== null && perfCategory.score !== undefined) ? perfCategory.score * 100 : 0;
      
      // Animate Radial Score Ring
      const circumference = 264;
      const offset = circumference - (score / 100) * circumference;
      speedRadialFill.style.strokeDashoffset = offset;
      
      let scoreColor = 'var(--color-error)';
      let scoreLabel = 'Poor';
      if (score >= 90) {
        scoreColor = 'var(--color-success)';
        scoreLabel = 'Excellent';
      } else if (score >= 50) {
        scoreColor = 'var(--color-warning)';
        scoreLabel = 'Needs Work';
      }
      
      speedRadialFill.style.stroke = scoreColor;
      speedScoreNum.textContent = Math.round(score);
      speedScoreTitle.textContent = scoreLabel;
      speedScoreTitle.style.color = scoreColor;
      
      // Set metrics
      const audits = lighthouse.audits || {};
      
      const updateMetric = (auditKey, dotEl, valEl) => {
        const audit = audits[auditKey];
        if (audit) {
          valEl.textContent = audit.displayValue || (audit.numericValue !== undefined ? Math.round(audit.numericValue) + ' ms' : '--');
          const metricScore = (audit.score !== null && audit.score !== undefined) ? audit.score : 0;
          dotEl.className = 'status-dot';
          if (metricScore >= 0.9) {
            dotEl.classList.add('passed-dot');
          } else if (metricScore >= 0.5) {
            dotEl.classList.add('warning-dot');
          } else {
            dotEl.classList.add('error-dot');
          }
        } else {
          valEl.textContent = '--';
          dotEl.className = 'status-dot warning-dot';
        }
      };
      
      updateMetric('first-contentful-paint', dotFcp, valFcp);
      updateMetric('largest-contentful-paint', dotLcp, valLcp);
      updateMetric('cumulative-layout-shift', dotCls, valCls);
      updateMetric('total-blocking-time', dotTbt, valTbt);
      updateMetric('speed-index', dotSi, valSi);
      updateMetric('interactive', dotTti, valTti);
      
      // Parse Opportunities
      const opportunities = [];
      for (const key in audits) {
        const audit = audits[key];
        if (audit.details && audit.details.type === 'opportunity' && audit.details.overallSavingsMs > 0) {
          opportunities.push({
            id: key,
            title: audit.title,
            description: audit.description,
            savingsMs: audit.details.overallSavingsMs,
            displayValue: audit.displayValue || `${Math.round(audit.details.overallSavingsMs)} ms`
          });
        }
      }
      
      // Sort opportunities in descending order of savings
      opportunities.sort((a, b) => b.savingsMs - a.savingsMs);
      
      if (opportunities.length > 0) {
        speedBadgeSavings.textContent = `${opportunities.length} Tips`;
        speedOpportunitiesList.innerHTML = opportunities.map(op => {
          const savingsText = op.displayValue || `${Math.round(op.savingsMs)} ms`;
          return `
            <div class="tracker-card" style="padding: 10px 12px; background: rgba(255, 255, 255, 0.02); display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--border-light); border-radius: 10px; text-align: left;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <span style="font-weight: 600; font-size: 12.5px; color: var(--text-primary);">${escapeHtml(op.title)}</span>
                <span class="audit-item-badge item-badge-warning" style="font-size: 8px; padding: 1px 5px; flex-shrink: 0; white-space: nowrap;">Save ${escapeHtml(savingsText)}</span>
              </div>
              <p style="font-size: 11px; color: var(--text-secondary); line-height: 1.4; margin: 0;">${escapeHtml(op.description)}</p>
            </div>
          `;
        }).join('');
      } else {
        speedBadgeSavings.textContent = '0 Tips';
        speedOpportunitiesList.innerHTML = `
          <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 11.5px;">
            ✨ No optimization opportunities discovered. Your loading speed is top notch!
          </div>
        `;
      }
      
      // Show Result Panel
      speedResult.classList.remove('hidden');
      showFloatingToast("PageSpeed analysis complete!");
      
    } catch (err) {
      console.error("PageSpeed Analysis failed:", err);
      const errMsg = err.message || String(err);
      
      const isQuotaError = errMsg.includes("Quota exceeded") || errMsg.includes("rateLimitExceeded") || errMsg.includes("userRateLimitExceeded") || errMsg.includes("429");

      if (errMsg.includes("Requests from referer") || errMsg.includes("referer <empty>")) {
        // Populate and show custom troubleshooting card
        pagespeedAllowedReferer.textContent = `chrome-extension://${chrome.runtime.id}/*`;
        pagespeedErrorCard.classList.remove('hidden');
        showFloatingToast("API Key restriction blocked. See instructions below.", false);
      } else if (isQuotaError && !apiKey) {
        // Keyless quota hit — guide user to add an optional free key
        showFloatingToast("Keyless limit reached. Add your free API key — tap 'Configure PageSpeed API Key'.", false);
      } else {
        showFloatingToast(`PageSpeed scan failed: ${errMsg}`, false);
      }
    } finally {
      speedLoader.classList.add('hidden');
    }
  }



  // --- Score Ring Animation ---
  function animateScoreRing(score) {
    seoScoreNum.textContent = score;
    
    const circumference = 264;
    const offset = circumference - (score / 100) * circumference;
    
    setTimeout(() => {
      scoreFill.style.strokeDashoffset = offset;
    }, 100);
    
    scoreFill.className.baseVal = "score-fill"; // reset
    if (score >= 80) {
      scoreFill.classList.add('score-green');
      scoreTitle.textContent = "Healthy SEO";
      scoreTitle.style.color = "var(--color-success)";
      scoreSubtitle.textContent = "Your site is optimized for crawler discoverability.";
    } else if (score >= 50) {
      scoreFill.classList.add('score-yellow');
      scoreTitle.textContent = "Needs Tweaking";
      scoreTitle.style.color = "var(--color-warning)";
      scoreSubtitle.textContent = "Minor optimization problems detected.";
    } else {
      scoreFill.classList.add('score-red');
      scoreTitle.textContent = "Poor SEO Structure";
      scoreTitle.style.color = "var(--color-error)";
      scoreSubtitle.textContent = "Crucial tags and structural elements are missing!";
    }
  }

  // --- Copy Text & Bypass Protections Function ---
  async function copyExtractedText() {
    if (!auditResult || !auditResult.structuredText) {
      showFloatingToast("No content available to copy!", false);
      return;
    }
    
    try {
      await navigator.clipboard.writeText(auditResult.structuredText);
      
      const originalText = btnCopyText.textContent;
      btnCopyText.textContent = "COPIED!";
      btnCopyContent.style.background = "var(--success-gradient)";
      btnCopyContent.style.boxShadow = "0 0 15px rgba(16, 185, 129, 0.4)";
      
      showFloatingToast("Copied to Clipboard! (Anti-Copy Bypassed)");
      
      setTimeout(() => {
        btnCopyText.textContent = originalText;
        btnCopyContent.style.background = "";
        btnCopyContent.style.boxShadow = "";
      }, 2000);
      
    } catch (err) {
      console.error('Clipboard copy error:', err);
      showFloatingToast("Failed to copy content.", false);
    }
  }

  // --- Image ArrayBuffer Binary Fetcher ---
  async function fetchImageAsUint8Array(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  // --- File Downloaders ---
  function downloadSingleFile(url, filename) {
    if (!url) return;
    
    try {
      chrome.downloads.download({
        url: url,
        filename: `seo-aura-downloads/${filename}`,
        saveAs: false
      });
      showFloatingToast(`Saving image: ${filename}`);
    } catch (e) {
      console.error("Download failed:", e);
      showFloatingToast("Download failed.", false);
    }
  }

  // Download All Images dynamically bundled into a single ZIP archive!
  async function downloadAllImagesAsZip() {
    if (!auditResult || !auditResult.extractedImages || auditResult.extractedImages.length === 0) {
      showFloatingToast("No images discovered to download.", false);
      return;
    }
    
    const images = auditResult.extractedImages;
    const totalCount = images.length;
    
    const originalBtnHTML = btnDownloadAll.innerHTML;
    btnDownloadAll.disabled = true;
    btnDownloadAll.style.background = "var(--warning-gradient)";
    btnDownloadAll.style.boxShadow = "0 0 15px rgba(245, 158, 11, 0.4)";
    btnDownloadAll.innerHTML = `<span>⏳ Zipping (0/${totalCount})...</span>`;
    
    showFloatingToast("Compressing images into a ZIP archive...");
    
    const filesToZip = [];
    let completedCount = 0;
    
    const downloadPromises = images.map(async (img) => {
      try {
        const dataBytes = await fetchImageAsUint8Array(img.url);
        completedCount++;
        btnDownloadAll.innerHTML = `<span>⏳ Zipping (${completedCount}/${totalCount})...</span>`;
        return { name: img.filename, data: dataBytes };
      } catch (err) {
        console.warn(`Unable to fetch binary content for image ${img.url}:`, err);
        return null;
      }
    });
    
    try {
      const results = await Promise.all(downloadPromises);
      const activeFiles = results.filter(f => f !== null);
      
      if (activeFiles.length === 0) {
        showFloatingToast("Failed to compile ZIP: Images could not be fetched.", false);
        resetZipButton();
        return;
      }
      
      btnDownloadAll.innerHTML = "<span>⚙️ Compiling ZIP...</span>";
      const zipBlob = createZipBlob(activeFiles);
      
      const zipUrl = URL.createObjectURL(zipBlob);
      const timestamp = new Date().toISOString().substring(0, 10);
      const host = domainName.textContent.replace(/\./g, '-');
      const zipFilename = `images-${host}-${timestamp}.zip`;
      
      chrome.downloads.download({
        url: zipUrl,
        filename: zipFilename,
        saveAs: true
      }, () => {
        setTimeout(() => URL.revokeObjectURL(zipUrl), 10000);
      });
      
      showFloatingToast(`ZIP created! Saved ${activeFiles.length} files successfully.`);
      
    } catch (err) {
      console.error("ZIP building failed:", err);
      showFloatingToast("An error occurred while compiling the ZIP archive.", false);
    } finally {
      resetZipButton();
    }
    
    function resetZipButton() {
      btnDownloadAll.disabled = false;
      btnDownloadAll.style.background = "";
      btnDownloadAll.style.boxShadow = "";
      btnDownloadAll.innerHTML = originalBtnHTML;
    }
  }

  // Show Toast Alert
  function showFloatingToast(message, isSuccess = true) {
    toastText.textContent = message;
    
    if (isSuccess) {
      toastNotification.style.background = "rgba(16, 185, 129, 0.92)";
      toastNotification.querySelector('.toast-icon').textContent = "✓";
      toastNotification.querySelector('.toast-icon').style.color = "var(--color-success)";
    } else {
      toastNotification.style.background = "rgba(239, 68, 68, 0.92)";
      toastNotification.querySelector('.toast-icon').textContent = "✕";
      toastNotification.querySelector('.toast-icon').style.color = "var(--color-error)";
    }
    
    toastNotification.classList.remove('hidden');
    
    if (toastTimeout) clearTimeout(toastTimeout);
    
    toastTimeout = setTimeout(() => {
      toastNotification.classList.add('hidden');
    }, 2800);
  }

  // --- SEO Evaluation Formulas ---
  function evaluateSeo(seo) {
    const checks = [];
    
    // 1. Page Title Check
    const titleLen = seo.title ? seo.title.trim().length : 0;
    if (titleLen === 0) {
      checks.push({
        id: "title",
        title: "Page Title Tag",
        status: "error",
        deduction: 15,
        desc: "The page has no Title tag configured, which is a critical crawl blocker.",
        tip: "Add a <code>&lt;title&gt;Page Name&lt;/title&gt;</code> inside the page header. Keep it descriptive."
      });
    } else if (titleLen < 30 || titleLen > 65) {
      checks.push({
        id: "title",
        title: "Page Title Length",
        status: "warning",
        deduction: 5,
        desc: `Page Title contains ${titleLen} characters, which is out of the recommended range (30 to 65).`,
        tip: `Change title to be between 30 and 65 characters to avoid truncation in search engine results. Current: <strong>\"${escapeHtml(seo.title)}\"</strong>`
      });
    } else {
      checks.push({
        id: "title",
        title: "Page Title Tag",
        status: "passed",
        deduction: 0,
        desc: `Perfect page title found! Length: ${titleLen} characters.`,
        tip: `Current title: <strong>\"${escapeHtml(seo.title)}\"</strong>`
      });
    }

    // 2. Meta Description Check
    const descLen = seo.metaDescription ? seo.metaDescription.trim().length : 0;
    if (descLen === 0) {
      checks.push({
        id: "meta-desc",
        title: "Meta Description Tag",
        status: "error",
        deduction: 15,
        desc: "The webpage lacks a Meta Description. Search engines will fallback to random page text.",
        tip: "Define a meta description in head: <code>&lt;meta name=\"description\" content=\"...\"&gt;</code>."
      });
    } else if (descLen < 110 || descLen > 160) {
      checks.push({
        id: "meta-desc",
        title: "Meta Description Length",
        status: "warning",
        deduction: 5,
        desc: `Description contains ${descLen} characters. Search engines recommend between 110 and 160.`,
        tip: `Rewrite your meta description to satisfy search crawlers (110-160 chars). Current: <strong>\"${escapeHtml(seo.metaDescription)}\"</strong>`
      });
    } else {
      checks.push({
        id: "meta-desc",
        title: "Meta Description Tag",
        status: "passed",
        deduction: 0,
        desc: `Superb meta description discovered! Length: ${descLen} characters.`,
        tip: `Current description: <strong>\"${escapeHtml(seo.metaDescription)}\"</strong>`
      });
    }

    // 3. Headings H1 Check
    const h1s = seo.headings.h1s || [];
    if (h1s.length === 0) {
      checks.push({
        id: "headings-h1",
        title: "H1 Primary Heading",
        status: "error",
        deduction: 15,
        desc: "No primary H1 element was detected. Search engines look for H1 to index page themes.",
        tip: "Wrap your main visual title in a single <code>&lt;h1&gt;</code> tag."
      });
    } else if (h1s.length > 1) {
      checks.push({
        id: "headings-h1",
        title: "Multiple H1 Headings",
        status: "warning",
        deduction: 8,
        desc: `Found ${h1s.length} distinct H1 headings. Multiple H1 tags confuse the keyword hierarchy.`,
        tip: `Consolidate down to a single H1 heading representing the core page topic. Downgrade other titles to H2 or H3 tags. List of H1s: ${h1s.map(h => `\"${escapeHtml(h)}\"`).join(', ')}`
      });
    } else {
      checks.push({
        id: "headings-h1",
        title: "H1 Primary Heading",
        status: "passed",
        deduction: 0,
        desc: "Exactly one H1 heading exists on this page.",
        tip: `Heading text: <strong>\"${escapeHtml(h1s[0])}\"</strong>`
      });
    }

    // 4. Headings Structure (Subheadings info)
    const { h2Count, h3Count, h4Count } = seo.headings;
    const totalSubs = h2Count + h3Count + h4Count;
    if (totalSubs === 0 && h1s.length > 0) {
      checks.push({
        id: "headings-structure",
        title: "Subheading Layout Structure",
        status: "warning",
        deduction: 3,
        desc: "Page has an H1 title but zero H2, H3, or H4 tags to organize the content sections.",
        tip: "Break up long texts using hierarchical headings like <code>&lt;h2&gt;</code> and <code>&lt;h3&gt;</code>."
      });
    } else {
      checks.push({
        id: "headings-structure",
        title: "Hierarchical Subheadings",
        status: "passed",
        deduction: 0,
        desc: `Good content hierarchy layout: H2 (${h2Count}), H3 (${h3Count}), H4 (${h4Count}).`,
        tip: "A well-structured hierarchy helps users and search engines navigate text topics."
      });
    }

    // 5. Images alt Tags Check
    const imgTotal = seo.images.total;
    const imgMissing = seo.images.missingAlt;
    if (imgTotal === 0) {
      checks.push({
        id: "images-alt",
        title: "Image Alt Tags Check",
        status: "passed",
        deduction: 0,
        desc: "No images found on this page.",
        tip: "Nothing to audit."
      });
    } else if (imgMissing > 0) {
      const deductionPct = Math.round((imgMissing / imgTotal) * 10);
      checks.push({
        id: "images-alt",
        title: "Missing Image Alt Tags",
        status: "warning",
        deduction: Math.max(2, deductionPct),
        desc: `${imgMissing} out of ${imgTotal} total images are missing the 'alt' text attribute. This damages accessibility and image search SEO.`,
        tip: `Add <code>alt=\"meaningful description\"</code> inside image tags so screen-readers and crawlers understand them. ${seo.images.missingAltUrls.length > 0 ? `Example missing image: <code>${seo.images.missingAltUrls[0]}</code>` : ""}`
      });
    } else {
      checks.push({
        id: "images-alt",
        title: "Image Alt Tags Check",
        status: "passed",
        deduction: 0,
        desc: `Excellent! All ${imgTotal} images contain descriptive alt text.`,
        tip: "Great for accessibility compliance!"
      });
    }

    // 6. Canonical Link Tag Check
    if (!seo.canonical) {
      checks.push({
        id: "canonical",
        title: "Canonical Link Tag",
        status: "warning",
        deduction: 10,
        desc: "Missing canonical URL link tag. Double content URLs could hurt your indexing ranks.",
        tip: "Add a canonical reference: <code>&lt;link rel=\"canonical\" href=\"https://mysite.com/canonical-path\"&gt;</code>."
      });
    } else {
      checks.push({
        id: "canonical",
        title: "Canonical Link Tag",
        status: "passed",
        deduction: 0,
        desc: "Valid canonical link found.",
        tip: `Canonical URL: <code>${escapeHtml(seo.canonical)}</code>`
      });
    }

    // 7. Robots Meta Tag Check
    if (!seo.robots) {
      checks.push({
        id: "robots",
        title: "Robots Meta Tag",
        status: "warning",
        deduction: 4,
        desc: "No Robots Meta Tag found. Crawlers will fallback to indexing and following links by default, but it's best to specify it explicitly.",
        tip: "Consider adding explicit crawl tags: <code>&lt;meta name=\"robots\" content=\"index, follow\"&gt;</code>."
      });
    } else {
      checks.push({
        id: "robots",
        title: "Robots Meta Tag",
        status: "passed",
        deduction: 0,
        desc: `Robots meta tag configured correctly.`,
        tip: `Directives: <strong>\"${escapeHtml(seo.robots)}\"</strong>`
      });
    }

    // 8. Social Metadata (Open Graph / Twitter Card)
    const hasOG = seo.social.ogTitle || seo.social.ogDescription || seo.social.ogImage;
    const hasTwitter = seo.social.twitterCard || seo.social.twitterTitle || seo.social.twitterDescription;
    
    if (!hasOG && !hasTwitter) {
      checks.push({
        id: "social-meta",
        title: "Social Share Card Tags",
        status: "warning",
        deduction: 8,
        desc: "No Open Graph (OG) or Twitter card metadata exists. Links shared on Facebook, X, or Slack will have poor previews.",
        tip: "Inject <code>&lt;meta property=\"og:title\" content=\"...\"&gt;</code> in head to ensure gorgeous card previews on social apps."
      });
    } else if (!hasOG || !hasTwitter) {
      checks.push({
        id: "social-meta",
        title: "Social Share Cards Check",
        status: "warning",
        deduction: 3,
        desc: `Partially configured: ${hasOG ? "Open Graph tags are present" : "Open Graph tags are missing"}, ${hasTwitter ? "Twitter tags are present" : "Twitter tags are missing"}.`,
        tip: "Configure BOTH Open Graph and Twitter Card schemas for absolute social coverage."
      });
    } else {
      checks.push({
        id: "social-meta",
        title: "Social Share Cards Check",
        status: "passed",
        deduction: 0,
        desc: "Perfect! Both Open Graph and Twitter card tags are correctly defined.",
        tip: `OG Title preview: <strong>\"${escapeHtml(seo.social.ogTitle || "None")}\"</strong>`
      });
    }

    // 9. Schema Markup Check
    if (!seo.schema) {
      checks.push({
        id: "schema",
        title: "JSON-LD / Schema Markup",
        status: "warning",
        deduction: 5,
        desc: "No structured schema markup (JSON-LD or Microdata) detected. Crawlers may struggle to index specialized content elements (articles, reviews, products).",
        tip: "Utilize JSON-LD tags: <code>&lt;script type=\"application/ld+json\"&gt;</code> to represent organizational structured schemas."
      });
    } else {
      checks.push({
        id: "schema",
        title: "Structured Schema Markup",
        status: "passed",
        deduction: 0,
        desc: "Structured data (Schema or JSON-LD) was detected on this website.",
        tip: "Allows Google to build Rich Search Snippets."
      });
    }

    // 10. Page Word Count Check
    const wordCount = seo.wordCount;
    if (wordCount === 0) {
      checks.push({
        id: "word-count",
        title: "Page Content Word Count",
        status: "error",
        deduction: 15,
        desc: "The page has 0 visible content words. This might be a pure Javascript template, empty page, or redirection.",
        tip: "Ensure your main visible body content is indexable raw text."
      });
    } else if (wordCount < 200) {
      checks.push({
        id: "word-count",
        title: "Thin Body Content Word Count",
        status: "warning",
        deduction: 8,
        desc: `Page contains only ${wordCount} words of text. Search crawlers dislike extremely thin landing pages.`,
        tip: "Expand on topics with keyword-supported paragraphs. Aim for at least 400+ words."
      });
    } else if (wordCount < 500) {
      checks.push({
        id: "word-count",
        title: "Page Content Word Count",
        status: "warning",
        deduction: 3,
        desc: `Moderate text quantity: ${wordCount} words. Perfect for simple posts, but more text yields better organic search index weights.`,
        tip: "Add contextual details, FAQs, or content columns to build organic search authority."
      });
    } else {
      checks.push({
        id: "word-count",
        title: "Page Content Word Count",
        status: "passed",
        deduction: 0,
        desc: `Outstanding content thickness: ${wordCount} words found.`,
        tip: "Well written, rich text pages have higher organic keywords index rates!"
      });
    }

    // 11. Links Checklist
    const linksTotal = seo.links.total;
    const linksEmpty = seo.links.empty;
    if (linksTotal > 0 && linksEmpty > 0) {
      checks.push({
        id: "links-broken",
        title: "Empty or Unresolved Anchor Hrefs",
        status: "warning",
        deduction: 4,
        desc: `${linksEmpty} out of ${linksTotal} anchors contain empty href, hashtag placeholders, or broken javascript: void links.`,
        tip: "Replace all empty hashes (#) or empty strings with actual target paths to guarantee crawler navigation."
      });
    } else {
      checks.push({
        id: "links-broken",
        title: "Unresolved Links Check",
        status: "passed",
        deduction: 0,
        desc: `All ${linksTotal} page links have resolved active targets!`,
        tip: "Excellent for anchor navigation crawl paths."
      });
    }

    return checks;
  }

  // Calculate final score out of 100
  function calculateScore(checks) {
    let score = 100;
    checks.forEach(check => {
      score -= check.deduction;
    });
    return Math.max(0, Math.min(100, score));
  }

  // --- Dynamic HTML Render Helpers ---
  function renderListHTML(items) {
    if (items.length === 0) {
      return `
        <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;">
          ✨ No checks under this group
        </div>
      `;
    }
    
    return items.map(item => {
      return `
        <div class="audit-item">
          <div class="audit-item-header">
            <span class="audit-item-title">${item.title}</span>
            <span class="audit-item-badge item-badge-${item.status}">
              ${item.status === 'passed' ? 'PASSED' : item.status === 'warning' ? `-${item.deduction} pts` : `-${item.deduction} pts`}
            </span>
          </div>
          <p class="audit-item-desc">${item.desc}</p>
          <div class="audit-item-tip">
            <strong>Optimization Tip:</strong> ${item.tip}
          </div>
        </div>
      `;
    }).join('');
  }

  // Categories helper
  function getCategoryLabel(cat) {
    const categories = {
      'social-pixel': 'Social Pixel',
      'analytics': 'Analytics',
      'marketing': 'Marketing',
      'utility': 'Code / Utility'
    };
    return categories[cat] || 'Script';
  }



  // Start initial scanning when popup is opened
  scanActiveTab();
});

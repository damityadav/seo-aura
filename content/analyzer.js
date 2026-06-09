(() => {
  try {
    // Helper to escape HTML characters
    const escapeHtml = (str) => {
      if (!str) return "";
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // 1. STRUCTURED TEXT EXTRACTION (Bypasses Copy Protections)
    const getStructuredText = () => {
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, blockquote'));
      const formattedLines = [];
      
      elements.forEach(el => {
        if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
        if (el.closest('nav, footer, header, aside, .sidebar, #sidebar, .menu, #menu, .footer, #footer, .nav, #nav')) return;
        
        const tag = el.tagName.toLowerCase();
        const text = (el.innerText || el.textContent || "").trim();
        if (!text) return;
        
        if (tag === 'h1') {
          formattedLines.push(`\n# ${text}\n`);
        } else if (tag === 'h2') {
          formattedLines.push(`\n## ${text}\n`);
        } else if (tag === 'h3') {
          formattedLines.push(`\n### ${text}\n`);
        } else if (tag === 'h4' || tag === 'h5' || tag === 'h6') {
          formattedLines.push(`\n#### ${text}\n`);
        } else if (tag === 'p') {
          formattedLines.push(`${text}\n\n`);
        } else if (tag === 'blockquote') {
          formattedLines.push(`> ${text}\n\n`);
        } else if (tag === 'li') {
          formattedLines.push(`- ${text}\n`);
        }
      });
      
      if (formattedLines.length === 0 && document.body) {
        return (document.body.innerText || document.body.textContent || "").trim();
      }
      
      return formattedLines.join('').trim();
    };


    // 2. IMAGE ASSETS SWEEP
    const getExtractedImages = () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const imagesData = [];
      const seenUrls = new Set();
      
      imgs.forEach(img => {
        let src = img.src || img.getAttribute('data-src') || img.getAttribute('src') || "";
        if (!src) return;
        
        try {
          src = new URL(src, window.location.href).href;
        } catch (e) {}
        
        if (seenUrls.has(src)) return;
        seenUrls.add(src);
        
        const width = img.naturalWidth || img.width || 0;
        const height = img.naturalHeight || img.height || 0;
        
        if (width > 0 && height > 0 && (width < 12 || height < 12)) return;
        if (src.includes('pixel') || src.includes('tracker') || src.includes('/collect?') || src.includes('hit.gif') || src.includes('analytics')) return;
        
        let filename = "image.png";
        try {
          const urlPath = new URL(src).pathname;
          let base = urlPath.substring(urlPath.lastIndexOf('/') + 1);
          if (base.includes('?')) {
            base = base.substring(0, base.indexOf('?'));
          }
          if (base && base.includes('.')) {
            filename = base;
          } else if (src.startsWith('data:image/')) {
            const ext = src.substring(11, src.indexOf(';'));
            filename = `image.${ext}`;
          }
        } catch (e) {}
        
        imagesData.push({
          url: src,
          filename: filename,
          width: width,
          height: height,
          alt: (img.getAttribute('alt') || "").trim()
        });
      });
      
      return imagesData;
    };


    // 3. GOOGLE SCHEMA STRUCTURED DATA CRAWLER
    const getExtractedSchemas = () => {
      const schemas = [];
      
      // A. JSON-LD CRAWLER
      const jsonScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      
      jsonScripts.forEach(script => {
        try {
          const text = (script.textContent || script.innerText || "").trim();
          if (!text) return;
          
          const parsed = JSON.parse(text);
          
          // Handle arrays, graph arrays, and single objects
          if (Array.isArray(parsed)) {
            parsed.forEach(item => {
              if (item) {
                schemas.push({
                  format: 'json-ld',
                  type: item['@type'] || item['type'] || 'StructuredData',
                  data: item
                });
              }
            });
          } else if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
            parsed['@graph'].forEach(item => {
              if (item) {
                schemas.push({
                  format: 'json-ld',
                  type: item['@type'] || item['type'] || 'StructuredData',
                  data: item
                });
              }
            });
          } else {
            schemas.push({
              format: 'json-ld',
              type: parsed['@type'] || parsed['type'] || 'StructuredData',
              data: parsed
            });
          }
        } catch (err) {
          // Record unparseable scripts as warning markers
          schemas.push({
            format: 'json-ld',
            type: 'Invalid JSON Schema',
            error: err.message,
            data: { rawText: script.textContent ? script.textContent.substring(0, 300) + '...' : 'Empty script' }
          });
        }
      });

      // B. MICRODATA CRAWLER
      const itemscopes = Array.from(document.querySelectorAll('[itemscope]'));
      
      itemscopes.forEach(el => {
        // Process only top-level itemscopes (ignores nested ones to prevent duplicate parent listings)
        if (el.parentElement && el.parentElement.closest('[itemscope]')) return;
        
        const itemtype = el.getAttribute('itemtype') || "";
        let typeName = "StructuredData";
        
        if (itemtype) {
          try {
            typeName = itemtype.substring(itemtype.lastIndexOf('/') + 1) || "StructuredData";
          } catch (e) {}
        }
        
        const props = {};
        const items = Array.from(el.querySelectorAll('[itemprop]'));
        
        items.forEach(item => {
          // Check that this itemprop belongs to the current parent scopes, not nested ones
          if (item.closest('[itemscope]') !== el) return;
          
          const name = item.getAttribute('itemprop');
          if (!name) return;
          
          let val = "";
          const tagName = item.tagName.toLowerCase();
          
          if (tagName === 'meta') {
            val = item.getAttribute('content') || "";
          } else if (tagName === 'link') {
            val = item.getAttribute('href') || "";
          } else if (tagName === 'img' || tagName === 'source') {
            val = item.src || item.getAttribute('data-src') || item.getAttribute('src') || "";
          } else if (tagName === 'time') {
            val = item.getAttribute('datetime') || (item.innerText || item.textContent || "").trim();
          } else {
            val = (item.innerText || item.textContent || "").trim();
          }
          
          // Map properties, accumulate into array if multiple of the same property exist
          if (props[name]) {
            if (Array.isArray(props[name])) {
              props[name].push(val);
            } else {
              props[name] = [props[name], val];
            }
          } else {
            props[name] = val;
          }
        });
        
        // Push microdata schema if type is resolved
        schemas.push({
          format: 'microdata',
          type: typeName,
          data: {
            "@context": "http://schema.org",
            "@type": typeName,
            ...props
          }
        });
      });

      return schemas;
    };


    // 4. SEO AUDIT LOGIC
    
    // Helper to count words in element (excluding script, style, and comments)
    const getVisibleWordCount = () => {
      const body = document.body;
      if (!body) return 0;
      
      const clone = body.cloneNode(true);
      const toRemove = clone.querySelectorAll('script, style, iframe, noscript, svg, path, canvas, nav, footer');
      toRemove.forEach(el => el.remove());
      
      const text = clone.innerText || clone.textContent || "";
      const cleanText = text.replace(/\s+/g, ' ').trim();
      if (!cleanText) return 0;
      
      const words = cleanText.split(' ').filter(word => word.length > 0);
      return words.length;
    };

    // Get Headings
    const getHeadings = () => {
      const h1s = Array.from(document.querySelectorAll('h1')).map(h => (h.innerText || h.textContent || "").trim()).filter(Boolean);
      const h2Count = document.querySelectorAll('h2').length;
      const h3Count = document.querySelectorAll('h3').length;
      const h4Count = document.querySelectorAll('h4').length;
      const h5Count = document.querySelectorAll('h5').length;
      const h6Count = document.querySelectorAll('h6').length;
      
      return { h1s, h2Count, h3Count, h4Count, h5Count, h6Count };
    };

    // Get Meta Tags
    const getMetaTag = (name) => {
      const element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      return element ? element.getAttribute('content') : null;
    };

    // Get Open Graph (OG) and Twitter Card tags
    const getSocialTags = () => {
      return {
        ogTitle: getMetaTag('og:title'),
        ogDescription: getMetaTag('og:description'),
        ogImage: getMetaTag('og:image'),
        ogUrl: getMetaTag('og:url'),
        twitterCard: getMetaTag('twitter:card'),
        twitterTitle: getMetaTag('twitter:title'),
        twitterDescription: getMetaTag('twitter:description'),
        twitterImage: getMetaTag('twitter:image'),
      };
    };

    // Get Images and check Alt tags
    const getImagesAudit = () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const total = imgs.length;
      let missingAlt = 0;
      const missingAltUrls = [];

      imgs.forEach(img => {
        const alt = img.getAttribute('alt');
        if (alt === null || alt.trim() === '') {
          missingAlt++;
          if (missingAltUrls.length < 5) {
            missingAltUrls.push(img.src || img.getAttribute('data-src') || 'No URL');
          }
        }
      });

      return { total, missingAlt, missingAltUrls };
    };

    // Get Links Audit
    const getLinksAudit = () => {
      const links = Array.from(document.querySelectorAll('a'));
      const total = links.length;
      let internal = 0;
      let external = 0;
      let empty = 0;
      
      const currentHost = window.location.host;
      const currentOrigin = window.location.origin;

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.trim() === '' || href.startsWith('javascript:')) {
          empty++;
          return;
        }

        if (href.startsWith('#') || href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
          internal++;
        } else {
          try {
            const urlObj = new URL(href);
            if (urlObj.host === currentHost) {
              internal++;
            } else {
              external++;
            }
          } catch (e) {
            empty++;
          }
        }
      });

      return { total, internal, external, empty };
    };

    // Schema Check
    const hasSchemaMarkup = () => {
      const jsonLd = document.querySelectorAll('script[type="application/ld+json"]').length > 0;
      const microdata = document.querySelectorAll('[itemscope]').length > 0;
      return jsonLd || microdata;
    };

    const canonicalElement = document.querySelector('link[rel="canonical"]');
    const robotsElement = document.querySelector('meta[name="robots"]');

    const seoData = {
      title: document.title || "",
      metaDescription: getMetaTag('description'),
      headings: getHeadings(),
      social: getSocialTags(),
      images: getImagesAudit(),
      links: getLinksAudit(),
      wordCount: getVisibleWordCount(),
      canonical: canonicalElement ? canonicalElement.getAttribute('href') : null,
      robots: robotsElement ? robotsElement.getAttribute('content') : null,
      schema: hasSchemaMarkup()
    };


    // 5. TRACKER & SOCIAL MEDIA SCRIPTS DETECTION
    const trackersSignatures = [
      {
        id: "google-analytics",
        name: "Google Analytics",
        category: "analytics",
        logo: "📊",
        description: "Google's web analytics service that tracks and reports website traffic.",
        rules: [
          { type: "src", pattern: "google-analytics.com/analytics.js" },
          { type: "src", pattern: "googletagmanager.com/gtag/js" },
          { type: "src", pattern: "google-analytics.com/g/collect" },
          { type: "content", pattern: "gtag(" },
          { type: "content", pattern: "ga(" }
        ]
      },
      {
        id: "google-tag-manager",
        name: "Google Tag Manager",
        category: "marketing",
        logo: "🏷️",
        description: "A tag management system that allows quick updates of measurement codes and tags.",
        rules: [
          { type: "src", pattern: "googletagmanager.com/gtm.js" },
          { type: "content", pattern: "googletagmanager.com/gtm.js" },
          { type: "content", pattern: "dataLayer.push" }
        ]
      },
      {
        id: "facebook-pixel",
        name: "Facebook Pixel",
        category: "social-pixel",
        logo: "👥",
        description: "An analytics tool that allows measuring the effectiveness of Facebook advertising.",
        rules: [
          { type: "src", pattern: "connect.facebook.net" },
          { type: "content", pattern: "fbq(" },
          { type: "content", pattern: "fbevents.js" }
        ]
      },
      {
        id: "tiktok-pixel",
        name: "TikTok Pixel",
        category: "social-pixel",
        logo: "🎵",
        description: "An analytics tool used to track visitor actions and measure TikTok ad performance.",
        rules: [
          { type: "src", pattern: "analytics.tiktok.com" },
          { type: "content", pattern: "ttq.load" },
          { type: "content", pattern: "ttq(" }
        ]
      },
      {
        id: "twitter-pixel",
        name: "Twitter / X Pixel",
        category: "social-pixel",
        logo: "✖️",
        description: "Conversion tracking tool for advertising on Twitter/X.",
        rules: [
          { type: "src", pattern: "static.ads-twitter.com" },
          { type: "content", pattern: "twq(" }
        ]
      },
      {
        id: "linkedin-insight",
        name: "LinkedIn Insight",
        category: "social-pixel",
        logo: "💼",
        description: "A piece of lightweight JavaScript code that enables in-depth campaign reporting for LinkedIn ads.",
        rules: [
          { type: "src", pattern: "snap.licdn.com" },
          { type: "content", pattern: "_lr_company_size" },
          { type: "content", pattern: "lintrk" }
        ]
      },
      {
        id: "pinterest-tag",
        name: "Pinterest Tag",
        category: "social-pixel",
        logo: "📌",
        description: "Tracks conversions and user engagement for Pinterest ad campaigns.",
        rules: [
          { type: "src", pattern: "assets.pinterest.com/js/pintrk.js" },
          { type: "content", pattern: "pintrk(" }
        ]
      },
      {
        id: "hotjar",
        name: "Hotjar",
        category: "analytics",
        logo: "🔥",
        description: "Behavior analytics and user feedback service that visualizes click/scroll maps.",
        rules: [
          { type: "src", pattern: "static.hotjar.com" },
          { type: "content", pattern: "hj.q" },
          { type: "content", pattern: "_hjSettings" }
        ]
      },
      {
        id: "microsoft-clarity",
        name: "Microsoft Clarity",
        category: "analytics",
        logo: "🔍",
        description: "Free user behavior analytics tool providing session replays and heatmaps.",
        rules: [
          { type: "src", pattern: "clarity.ms" },
          { type: "content", pattern: "clarity(" }
        ]
      },
      {
        id: "snapchat-pixel",
        name: "Snapchat Pixel",
        category: "social-pixel",
        logo: "👻",
        description: "Enables cross-device campaign measurement and optimization for Snapchat ads.",
        rules: [
          { type: "src", pattern: "sc-static.net/scevent" },
          { type: "content", pattern: "snaptr(" }
        ]
      },
      {
        id: "hubspot",
        name: "HubSpot",
        category: "marketing",
        logo: "🧡",
        description: "Inbound marketing, sales, and CRM analytics script.",
        rules: [
          { type: "src", pattern: "js.hs-scripts.com" },
          { type: "src", pattern: "js.hs-analytics.net" },
          { type: "content", pattern: "_hsq" }
        ]
      },
      {
        id: "mailchimp",
        name: "Mailchimp",
        category: "marketing",
        logo: "🐒",
        description: "Marketing automation platform and email marketing service tracker.",
        rules: [
          { type: "src", pattern: "chimpstatic.com" },
          { type: "content", pattern: "mailchimp" }
        ]
      },
      {
        id: "stripe",
        name: "Stripe JS",
        category: "utility",
        logo: "💳",
        description: "Payment infrastructure and fraud prevention script from Stripe.",
        rules: [
          { type: "src", pattern: "js.stripe.com" },
          { type: "content", pattern: "Stripe(" }
        ]
      },
      {
        id: "disqus",
        name: "Disqus",
        category: "utility",
        logo: "💬",
        description: "Network comment community platform and tracking script.",
        rules: [
          { type: "src", pattern: "disqus.com" },
          { type: "content", pattern: "disqus_config" }
        ]
      },
      {
        id: "sentry",
        name: "Sentry SDK",
        category: "utility",
        logo: "🛡️",
        description: "Application monitoring, error tracking, and performance analysis platform.",
        rules: [
          { type: "src", pattern: "browser.sentry-cdn.com" },
          { type: "content", pattern: "Sentry.init" }
        ]
      },
      {
        id: "new-relic",
        name: "New Relic",
        category: "utility",
        logo: "📊",
        description: "Cloud-based observability and application performance monitoring platform.",
        rules: [
          { type: "src", pattern: "js-agent.newrelic.com" },
          { type: "content", pattern: "NREUM" }
        ]
      }
    ];

    const detectedTrackers = {};
    const scripts = Array.from(document.querySelectorAll('script'));

    scripts.forEach(script => {
      const src = (script.src || "").toLowerCase();
      const content = (script.innerHTML || "").trim();

      trackersSignatures.forEach(sig => {
        let isMatched = false;
        let matchedTrigger = "";

        for (const rule of sig.rules) {
          if (rule.type === "src" && src && src.includes(rule.pattern.toLowerCase())) {
            isMatched = true;
            matchedTrigger = `Loaded Script: ${src}`;
            break;
          }
          if (rule.type === "content" && content && content.includes(rule.pattern)) {
            isMatched = true;
            matchedTrigger = `Inline Script initialization containing '${rule.pattern}'`;
            break;
          }
        }

        if (isMatched) {
          if (detectedTrackers[sig.id]) {
            if (!detectedTrackers[sig.id].triggers.includes(matchedTrigger)) {
              detectedTrackers[sig.id].triggers.push(matchedTrigger);
            }
          } else {
            detectedTrackers[sig.id] = {
              id: sig.id,
              name: sig.name,
              category: sig.category,
              logo: sig.logo,
              description: sig.description,
              triggers: [matchedTrigger]
            };
          }
        }
      });
    });

    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType("resource");
      resources.forEach(res => {
        if (res.initiatorType === "script" || res.name.endsWith(".js")) {
          const src = res.name.toLowerCase();
          
          trackersSignatures.forEach(sig => {
            let isMatched = false;
            let matchedTrigger = "";

            for (const rule of sig.rules) {
              if (rule.type === "src" && src && src.includes(rule.pattern.toLowerCase())) {
                isMatched = true;
                matchedTrigger = `Network Request: ${res.name}`;
                break;
              }
            }

            if (isMatched) {
              if (detectedTrackers[sig.id]) {
                if (!detectedTrackers[sig.id].triggers.includes(matchedTrigger)) {
                  detectedTrackers[sig.id].triggers.push(matchedTrigger);
                }
              } else {
                detectedTrackers[sig.id] = {
                  id: sig.id,
                  name: sig.name,
                  category: sig.category,
                  logo: sig.logo,
                  description: sig.description,
                  triggers: [matchedTrigger]
                };
              }
            }
          });
        }
      });
    }

    return {
      seo: seoData,
      trackers: Object.values(detectedTrackers),
      structuredText: getStructuredText(),
      extractedImages: getExtractedImages(),
      extractedSchemas: getExtractedSchemas(),
      url: window.location.href,
      domain: window.location.hostname
    };
  } catch (error) {
    return {
      error: error.message || "Failed to analyze page content."
    };
  }
})();

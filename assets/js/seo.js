/* ========================================
   SEO & SCHEMA.ORG MARKUP
   JSON-LD structured data for better SEO
   ======================================== */

const SEO = {
    // Generate Organization schema
    organization: () => {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AvilaOps",
            "alternateName": "Avila Operations",
            "url": "https://avilaops.com",
            "logo": "https://avilaops.com/assets/images/logo.png",
            "description": "Suite completa de produtos de AI, Data, Cloud e Security. Tecnologia de ponta para seu negócio.",
            "sameAs": [
                "https://linkedin.com/company/avilaops",
                "https://twitter.com/avilaops",
                "https://github.com/avilaops"
            ],
            "contactPoint": [
                {
                    "@type": "ContactPoint",
                    "telephone": "+55-17-99781-1471",
                    "contactType": "customer service",
                    "areaServed": "BR",
                    "availableLanguage": ["pt-BR", "en-US"]
                },
                {
                    "@type": "ContactPoint",
                    "telephone": "+351-910-205-562",
                    "contactType": "customer service",
                    "areaServed": "PT",
                    "availableLanguage": ["pt-PT", "en-US"]
                }
            ],
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR"
            },
            "founder": {
                "@type": "Person",
                "name": "Nicolas Avila",
                "email": "nicolas@avilaops.com"
            }
        };
    },

    // Generate Product schema
    product: (product) => {
        return {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": product.name,
            "description": product.description,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web, Cloud",
            "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "url": `https://avilaops.com/${product.slug}`,
                "priceValidUntil": "2026-12-31",
                "seller": {
                    "@type": "Organization",
                    "name": "AvilaOps"
                }
            },
            "aggregateRating": product.rating ? {
                "@type": "AggregateRating",
                "ratingValue": product.rating.value,
                "reviewCount": product.rating.count,
                "bestRating": "5",
                "worstRating": "1"
            } : undefined,
            "brand": {
                "@type": "Brand",
                "name": "AvilaOps"
            }
        };
    },

    // Generate WebSite schema
    website: () => {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AvilaOps",
            "url": "https://avilaops.com",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://avilaops.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        };
    },

    // Generate BreadcrumbList schema
    breadcrumb: (items) => {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        };
    },

    // Generate FAQ schema
    faq: (faqs) => {
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
    },

    // Generate Review schema
    review: (review) => {
        return {
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
                "@type": "Product",
                "name": review.productName
            },
            "author": {
                "@type": "Person",
                "name": review.authorName
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": "5",
                "worstRating": "1"
            },
            "reviewBody": review.text,
            "datePublished": review.date
        };
    },

    // Generate Article schema (for blog posts)
    article: (article) => {
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.description,
            "image": article.image,
            "author": {
                "@type": "Person",
                "name": article.author
            },
            "publisher": {
                "@type": "Organization",
                "name": "AvilaOps",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://avilaops.com/assets/images/logo.png"
                }
            },
            "datePublished": article.publishDate,
            "dateModified": article.modifiedDate
        };
    },

    // Generate VideoObject schema
    video: (video) => {
        return {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": video.title,
            "description": video.description,
            "thumbnailUrl": video.thumbnail,
            "uploadDate": video.uploadDate,
            "duration": video.duration,
            "contentUrl": video.url,
            "embedUrl": video.embedUrl
        };
    },

    // Insert schema into page
    insertSchema: (schema) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    },

    // Initialize all schemas
    init: () => {
        // Add organization schema to all pages
        SEO.insertSchema(SEO.organization());
        SEO.insertSchema(SEO.website());

        console.log('🔍 SEO schemas initialized');
    }
};

// ========================================
// META TAG MANAGEMENT
// ========================================

const MetaTags = {
    // Update page title
    setTitle: (title) => {
        document.title = title;
        MetaTags.setMeta('og:title', title);
        MetaTags.setMeta('twitter:title', title);
    },

    // Update meta description
    setDescription: (description) => {
        MetaTags.setMeta('description', description);
        MetaTags.setMeta('og:description', description);
        MetaTags.setMeta('twitter:description', description);
    },

    // Update meta image
    setImage: (imageUrl) => {
        MetaTags.setMeta('og:image', imageUrl);
        MetaTags.setMeta('twitter:image', imageUrl);
    },

    // Set meta tag
    setMeta: (name, content) => {
        let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);

        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name', name);
            document.head.appendChild(meta);
        }

        meta.setAttribute('content', content);
    },

    // Set canonical URL
    setCanonical: (url) => {
        let link = document.querySelector('link[rel="canonical"]');

        if (!link) {
            link = document.createElement('link');
            link.rel = 'canonical';
            document.head.appendChild(link);
        }

        link.href = url;
    }
};

// ========================================
// INITIALIZE SEO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    SEO.init();

    // Set canonical URL
    MetaTags.setCanonical(window.location.href.split('?')[0]);
});

// Export for global use
window.SEO = SEO;
window.MetaTags = MetaTags;

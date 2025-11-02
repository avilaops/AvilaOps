export default function JsonLdSchema() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://avilaops.com";

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Ávila Ops",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "description": "Especialistas em DevOps, Cloud Architecture e Security Operations",
        "sameAs": [
            "https://linkedin.com/company/avilaops",
            "https://github.com/avilaops"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Sales",
            "email": "contato@avilaops.com",
            "availableLanguage": ["Portuguese", "English"]
        },
        "areaServed": {
            "@type": "Country",
            "name": "Brazil"
        },
        "knowsAbout": [
            "DevOps",
            "Cloud Computing",
            "Infrastructure as Code",
            "Kubernetes",
            "Docker",
            "CI/CD",
            "Azure",
            "AWS",
            "Security Operations"
        ]
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Ávila Ops",
        "url": siteUrl,
        "description": "Infrastructure That Scales - Transformamos infraestrutura legacy em cloud-native",
        "publisher": {
            "@type": "Organization",
            "name": "Ávila Ops"
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/?s={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": `${siteUrl}/services`
            }
        ]
    };

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "DevOps Engineering",
        "provider": {
            "@type": "Organization",
            "name": "Ávila Ops"
        },
        "areaServed": {
            "@type": "Country",
            "name": "Brazil"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "DevOps Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "DevOps Engineering",
                        "description": "CI/CD pipelines, automation e Infrastructure as Code"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Cloud Architecture",
                        "description": "Design e implementação de infraestrutura escalável"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Security Operations",
                        "description": "DevSecOps, compliance e monitoramento avançado"
                    }
                }
            ]
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
        </>
    );
}

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  name = 'Digi-World Promotions', 
  type = 'website',
  image = '/logo.png', // Assuming logo.png is in public or handled via import, but for meta tags, absolute URL or public path is better. Let's assume public.
  url = 'https://digiworldpromotions.in'
}) => {
  const siteTitle = title ? `${title} | ${name}` : name;
  const metaDescription = description || "Digi-World Promotions Official: India's leading political digital agency. Expert election management, voter targeted ads, political graphics, & video editing.";
  const metaKeywords = keywords || "Political Digital Marketing, Election Campaign Management, Voter Targeting, Social Media for Politicians, Digi-World Promotions";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Digi-World Promotions Official",
    "alternateName": "Digi-World Promotions",
    "url": "https://digiworldpromotions.in",
    "logo": "https://digiworldpromotions.in/logo.png",
    "description": metaDescription,
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bhopal",
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61559011646766",
      "https://www.instagram.com/dw_promotions/"
    ],
    "priceRange": "$$"
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;

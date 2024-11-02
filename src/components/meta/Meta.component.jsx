import React from "react";
import Head from "next/head";

const Meta = ({
  title = "Shepherd's CRM",
  description = "Shepherd's CRM is a platform for churches to manage their members, events, and finances. All in one convenient place.",
  keywords = "church, crm, members, events, finances, church management",
  url = "https://www.shepherds-crm.com",
  image = "/logo512.png",
}) => (
  <Head>
    {/* Favicon */}
    <link rel="icon" href="/favicon.ico" />
    {/* <!-- Primary Meta Tags --> */}
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keyword" content={keywords} />
    {/* <!-- Open Graph / Facebook --> */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    {/* <!-- Twitter --> */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={url} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={image} />

    {/* VideoJs CSS link */}
  </Head>
);

export default Meta;

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    API_URL: process.env.API_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    ENV: process.env.NODE_ENV,
    // ENV: "development",
  },
  //Redirect / to /dash
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/home",
        permanent: true,
      },
    ];
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  assetPrefix: process.env.ENV === "production" ? "https://api.shepherdcms.org" : "",
};

export default nextConfig;

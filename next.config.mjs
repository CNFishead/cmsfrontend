/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    API_URL: `http://localhost:5000/api/v1`,
    // ENV: "production",
    ENV: "development",
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

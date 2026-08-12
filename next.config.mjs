const repo = process.env.GITHUB_ACTIONS ? "/jd" : "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: repo,
  assetPrefix: repo,
  env: { NEXT_PUBLIC_BASE_PATH: repo },
};

export default nextConfig;

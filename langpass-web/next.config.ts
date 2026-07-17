import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle (.next/standalone) so the production Docker image is small
  // and doesn't ship the full node_modules. Required by the App Platform image build (infra/prod):
  // the runner stage copies .next/standalone + .next/static + public and runs `node server.js`.
  output: "standalone",
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site into `out/` on `next build` (deploy anywhere).
  output: 'export',
  // Static export can't use the on-demand image optimizer.
  images: { unoptimized: true },
  // Export nested routes as `route/index.html` for portable static hosting.
  trailingSlash: true,
};

export default nextConfig;

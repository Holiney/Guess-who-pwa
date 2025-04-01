// import { defineConfig } from "vite";
// import tailwindcss from "@tailwindcss/vite";

// import react from "@vitejs/plugin-react-swc";

// export default defineConfig({
//   plugins: [tailwindcss(), react()],
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "Вгадай хто — Guess Who",
        short_name: "GuessWho",
        description: "Настільна гра “ХтоЯ?” як мобільний застосунок!",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});

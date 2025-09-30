import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon-16x16.png', 
        'favicon-32x32.png',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: "Greenora - Herbal Plants Marketplace",
        short_name: "Greenora",
        description: "Premium herbal plants marketplace for buyers and exporters",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#10b981",
        orientation: "portrait",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png"
          }
        ],
        categories: ["business", "shopping", "health"]
      }
    })
  ]
})
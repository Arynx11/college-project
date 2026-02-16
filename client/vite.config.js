// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5002',
//         changeOrigin: true,
//         secure: false
//       }
//     },
//     // Use built-in history API fallback
//     historyApiFallback: true
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "localhost",   // 👈 Force localhost instead of 127.0.0.1
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5002',
                changeOrigin: true,
                secure: false
            }
        }
    }
})

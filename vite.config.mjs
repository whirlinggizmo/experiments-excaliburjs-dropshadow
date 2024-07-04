// vite.config.js
import { defineConfig } from 'vite'
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config(); // load env vars from .env

// https://vitejs.dev/config/
export default defineConfig({
    base: '/experiments-excaliburjs-dropshadow/',
    server: {
        host: "0.0.0.0",
        port: 4444,
        strictPort: true,
        open: false,
        https: {
            key: fs.readFileSync(`${process.env.KEYS_DIR}/privkey.pem`),
            cert: fs.readFileSync(`${process.env.KEYS_DIR}/cert.pem`),
        },
        watch: {
            ignored: ['!**/node_modules/**/@whirlinggizmo/**']
        }
    },
})
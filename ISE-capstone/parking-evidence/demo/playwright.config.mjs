import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  metadata:{node:process.version,channel:process.env.PLAYWRIGHT_CHANNEL||'bundled chromium'},
  testDir:'./tests',testMatch:'browser.spec.mjs',timeout:30000,fullyParallel:false,workers:1,
  reporter:[['list'],['json',{outputFile:'evidence/browser-results.json'}]],
  use:{channel:process.env.PLAYWRIGHT_CHANNEL||undefined,baseURL:process.env.DEMO_URL||'http://127.0.0.1:4178/ase/en/capstone/',trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},
    {name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
  webServer:process.env.DEMO_URL?undefined:{command:'npm start',url:'http://127.0.0.1:4178/ase/en/capstone/',reuseExistingServer:!process.env.CI},
});

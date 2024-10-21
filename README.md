You may need extra file which stores your API key for your database connection and intergration, name it as .env.local and place it in the main directory. 

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kennedy.sithole',
  appName: 'Real Time messaging',
  webDir: 'build'
};

export default config;

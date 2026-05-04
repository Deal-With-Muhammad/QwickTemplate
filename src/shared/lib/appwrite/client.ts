import { Account, Client, Databases } from 'react-native-appwrite';

import { appwriteConfig } from './config';

/**
 * Single shared Appwrite client. The platform flag mirrors the iOS/Android
 * bundle id so Appwrite recognises the calling app.
 */
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const appwriteClient = client;
export const account = new Account(client);
export const databases = new Databases(client);

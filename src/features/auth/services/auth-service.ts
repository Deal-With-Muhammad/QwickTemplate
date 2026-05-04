import { Query } from 'react-native-appwrite';

import { account, databases } from '../../../shared/lib/appwrite/client';
import { appwriteConfig } from '../../../shared/lib/appwrite/config';
import {
  SECURE_KEYS,
  secureStorage,
} from '../../../shared/lib/secure-storage';
import { ALLOWED_ROLES, AuthError } from '../types';
import type { LoginCredentials, RetailerUser, UserRole } from '../types';

const { databaseId, collections } = appwriteConfig;

function mapUserDoc(doc: any): RetailerUser {
  return {
    $id: doc.$id,
    id: doc.$id,
    name: doc.name ?? '',
    email: doc.email ?? '',
    image: doc.image ?? '',
    status: doc.status ?? 1,
    type: (doc.type as UserRole) ?? 'user',
    mobileNumber: doc.mobileNumber ?? '',
    storeId: doc.storeId ?? '',
    companyId: doc.companyId ?? '',
    brandId: doc.brandId ?? '',
  };
}

async function fetchUserProfile(
  userId: string,
  email: string
): Promise<RetailerUser | null> {
  try {
    const direct = await databases.getDocument(
      databaseId,
      collections.users,
      userId
    );

    return mapUserDoc(direct);
  } catch {
    // fall through to email lookup
  }

  try {
    const result = await databases.listDocuments(
      databaseId,
      collections.users,
      [Query.equal('email', email), Query.limit(1)]
    );

    if (result.documents.length > 0) {
      return mapUserDoc(result.documents[0]);
    }
  } catch {
    // ignore
  }

  return null;
}

async function deleteCurrentSessionSafely() {
  try {
    await account.deleteSession('current');
  } catch {
    // no session to delete — that's fine
  }
}

export const authService = {
  /**
   * Authenticate against Appwrite, verify the user is a retailer, and persist
   * credentials in the device's secure store so subsequent sessions can be
   * unlocked with biometrics.
   */
  async login({
    email,
    password,
  }: LoginCredentials): Promise<RetailerUser> {
    await deleteCurrentSessionSafely();

    try {
      await account.createEmailPasswordSession(email, password);
    } catch (err: any) {
      throw new AuthError(
        err?.message || 'Invalid email or password.',
        'invalid-credentials'
      );
    }

    const me = await account.get();
    const profile = await fetchUserProfile(me.$id, me.email);

    if (!profile) {
      await deleteCurrentSessionSafely();
      throw new AuthError(
        'No retailer profile found for this account.',
        'profile-missing'
      );
    }

    if (!ALLOWED_ROLES.includes(profile.type as any)) {
      await deleteCurrentSessionSafely();
      throw new AuthError(
        'Only retailer accounts can sign in to the POS app.',
        'forbidden-role'
      );
    }

    await secureStorage.set(SECURE_KEYS.authEmail, email);
    await secureStorage.set(SECURE_KEYS.authPassword, password);

    return profile;
  },

  /**
   * Re-establish a session using credentials stored in SecureStore. Used after
   * a successful biometric unlock.
   */
  async loginWithStoredCredentials(): Promise<RetailerUser | null> {
    const email = await secureStorage.get(SECURE_KEYS.authEmail);
    const password = await secureStorage.get(SECURE_KEYS.authPassword);

    if (!email || !password) return null;

    return authService.login({ email, password });
  },

  /** True if there are stored credentials we can offer biometric unlock for. */
  async hasStoredCredentials(): Promise<boolean> {
    const email = await secureStorage.get(SECURE_KEYS.authEmail);
    const password = await secureStorage.get(SECURE_KEYS.authPassword);

    return Boolean(email && password);
  },

  async getStoredEmail(): Promise<string | null> {
    return secureStorage.get(SECURE_KEYS.authEmail);
  },

  /** Returns the active Appwrite account, or null if no session exists. */
  async getCurrentSession() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  /** Reload the retailer's profile document. */
  async getProfile(userId: string, email: string): Promise<RetailerUser | null> {
    return fetchUserProfile(userId, email);
  },

  /** Sign out and forget the device. Used by Settings → Sign out. */
  async logout(): Promise<void> {
    await deleteCurrentSessionSafely();
    await secureStorage.remove(SECURE_KEYS.authEmail);
    await secureStorage.remove(SECURE_KEYS.authPassword);
  },

  /** Lock the app without forgetting credentials — biometric will unlock again. */
  async lock(): Promise<void> {
    await deleteCurrentSessionSafely();
  },
};

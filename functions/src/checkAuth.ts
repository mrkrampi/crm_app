import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import * as admin from 'firebase-admin';

export function isAuthorized(context: CallableContext) {
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'Sorry, you need to authorize');
  }
}

export async function hasPermission(context: CallableContext) {
  if (context.auth) {
    const {uid} = context.auth;
    const user = await admin.auth().getUser(uid);

    if (!(user.customClaims as any).isAdmin) {
      throw new HttpsError('permission-denied', 'You have no permission for this operation');
    }
  }
}

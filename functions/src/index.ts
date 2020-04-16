import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { Role } from './role';
import { sendMail } from './emailService';
import { hasPermission, isAuthorized } from './checkAuth';

admin.initializeApp();

exports.getUsers = functions.https.onCall(async (data, context) => {
  isAuthorized(context);

  const {page, countOfElements, sortField, sortDirection} = data;

  const snapShotRef = await admin.firestore().collection('users').get();
  const collectionSize = snapShotRef.size;

  const snapshot = await admin.firestore()
    .collection('users')
    .get();

  let users = snapshot.docs.map(item => {
    return {
      uid: item.id,
      ...item.data()
    };
  });

  if (sortDirection === 'desc') {
    users.sort((a:any, b:any) => a[sortField].toLowerCase() > b[sortField].toLowerCase() ? -1 : 1);
  } else {
    users.sort((a:any, b:any) => a[sortField].toLowerCase() > b[sortField].toLowerCase() ? 1 : -1);
  }

  if ((page * countOfElements) + countOfElements > users.length) {
    users = users.slice(page * countOfElements);
  } else {
    users = users.slice(page * countOfElements, page * countOfElements + countOfElements);
  }

  return {
    collectionSize,
    data: users
  };
});

exports.editUser = functions.https.onCall(async (data, context) => {
  isAuthorized(context);
  await hasPermission(context);

  const {editedUser: user} = data;
  const {uid} = user;

  if (!Role[user.role]) {
    throw new HttpsError('invalid-argument', 'Bad role');
  }

  try {
    await admin.auth().updateUser(uid, {
      email: user.email,
      displayName: `${user.firstName} ${user.lastName}`
    });

    await admin.auth().setCustomUserClaims(uid, {
      isAdmin: user.role === 'admin'
    });

    await admin.firestore().collection('users').doc(uid).update({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    });

    const claims = await getUserClaims(context);

    return {
      claims,
      responseInfo: {
        status: 'success',
        msg: 'User successfully edited'
      }
    };
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.deleteUser = functions.https.onCall(async (data, context) => {
  isAuthorized(context);
  await hasPermission(context);

  const {uid} = data;

  if (context.auth) {
    const {uid: currentUserUID} = context.auth;
    if (uid === currentUserUID) {
      throw new HttpsError('aborted', 'You can\'t delete yourself')
    }
  }

  try {
    await Promise.all([
      admin.auth().deleteUser(uid),
      admin.firestore().collection('users').doc(uid).delete()
    ]);

    return {
      status: 'success',
      msg: 'User successfully deleted'
    };
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.addUser = functions.https.onCall(async (data, context) => {
  isAuthorized(context);
  await hasPermission(context);

  const {user} = data;

  if (!Role[user.role]) {
    throw new HttpsError('invalid-argument', 'Bad role');
  }

  try {
    const {id: inviteId} = await admin.firestore().collection('invites').add({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    });

    await sendMail(inviteId, user.email);

    return {
      status: 'success',
      msg: 'User will appear when he confirm account'
    };
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.inviteExisting = functions.https.onCall(async data => {
  const {inviteId} = data;
  if (!inviteId) {
    return false;
  }

  const inviteRef = await admin.firestore().collection('invites').doc(inviteId).get();
  return inviteRef.exists;
});

exports.confirmUser = functions.https.onCall(async data => {
  const {inviteId, password} = data;
  const userRef = await admin.firestore().collection('invites').doc(`${inviteId}`).get();

  if (!userRef) {
    throw new HttpsError('not-found', 'There no invite for such user');
  }

  try {
    const userData = userRef.data();
    if (userData) {
      const {firstName, lastName, email, role} = userData;
      const createdUser = await admin.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
        emailVerified: true
      });

      const {uid} = createdUser;
      await admin.auth().setCustomUserClaims(uid, {
        isAdmin: role === 'admin'
      });
      await admin.firestore().collection('users').doc(uid).set({
        ...userData,
        status: 'Active'
      });

      await admin.firestore().collection('invites').doc(inviteId).delete();

      return {
        status: 'success',
        msg: 'User successfully confirmed'
      };
    } else {
      return {
        status: 'error',
        msg: 'Oops, something went wrong'
      };
    }
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.getCurrentUser = functions.https.onCall(async (data, context) => {
  isAuthorized(context);

  try {
    if (context.auth) {
      const {uid} = context.auth;
      const currentUser = await admin.firestore().collection('users').doc(uid).get();
      return {uid, ...currentUser.data()};
    } else {
      return null;
    }
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.getLeads = functions.https.onCall(async (data, context) => {
  isAuthorized(context);

  const {page, countOfElements, sortField, sortDirection} = data;

  const snapShotRef = await admin.firestore().collection('leads').get();
  const collectionSize = snapShotRef.size;

  const snapshot = await admin.firestore()
    .collection('leads')
    .get();

  let leads = snapshot.docs.map(item => {
    return {
      id: item.id,
      ...item.data()
    };
  });

  if (sortDirection === 'desc') {
    leads.sort((a:any, b:any) => {
      if (sortField === 'followUpDate') {
        return a[sortField] > b[sortField] ? -1 : 1
      } else {
        return a[sortField].toLowerCase() > b[sortField].toLowerCase() ? -1 : 1
      }
    });
  } else {
    leads.sort((a:any, b:any) => a[sortField].toLowerCase() > b[sortField].toLowerCase() ? 1 : -1);
  }

  if ((page * countOfElements) + countOfElements > leads.length) {
    leads = leads.slice(page * countOfElements);
  } else {
    leads = leads.slice(page * countOfElements, page * countOfElements + countOfElements);
  }

  return {
    collectionSize,
    data: leads
  };
});

exports.addLead = functions.https.onCall(async (data, context) => {
  isAuthorized(context);
  await hasPermission(context);

  try {
    const {lead} = data;
    await admin.firestore().collection('leads').add({
      ...lead,
      followUpDate: new Date().getTime()
    });

    return {
      status: 'success',
      msg: 'Lead successfully added'
    };
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.deleteLead = functions.https.onCall(async (data, context) => {
  isAuthorized(context);
  await hasPermission(context);

  try {
    const {id} = data;
    await admin.firestore().collection('leads').doc(id).delete();

    return {
      status: 'success',
      msg: 'Lead successfully deleted'
    };
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.editLead = functions.https.onCall(async (data, context) => {
  isAuthorized(context);
  await hasPermission(context);

  try {
    const {lead: {id, ...leadData}} = data;
    await admin.firestore().collection('leads').doc(id).update({
      ...leadData
    });

    return {
      status: 'success',
      msg: 'Lead successfully edited'
    };
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.getStatuses = functions.https.onCall(async (data, context) => {
  isAuthorized(context);

  const snapshot = await admin.firestore().collection('status').get();
  return snapshot.docs.map(item => {
    return {
      uid: item.id,
      ...item.data()
    };
  });
});

exports.addStatus = functions.https.onCall(async (data, context) => {
  isAuthorized(context);
  await hasPermission(context);

  try {
    const {status: {name, description}} = data;
    await admin.firestore().collection('status').add({name, description});
    return {
      status: 'success',
      msg: 'Status successfully added'
    };
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.deleteStatus = functions.https.onCall(async (data, context) => {
  isAuthorized(context);
  await hasPermission(context);

  try {
    const {uid} = data;
    await admin.firestore().collection('status').doc(uid).delete();
    return {
      status: 'success',
      msg: 'Status successfully deleted'
    };
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.changeStatus = functions.https.onCall(async (data, context) => {
  isAuthorized(context);
  await hasPermission(context);

  try {
    const {uid, status} = data;

    if (status === 'Active') {
      await admin.auth().updateUser(uid, {
        disabled: false
      });

      await admin.firestore().collection('users').doc(uid).update({
        status
      });
    } else if (status === 'Inactive') {
      await admin.auth().updateUser(uid, {
        disabled: true
      });

      await admin.firestore().collection('users').doc(uid).update({
        status
      });
    } else {
      return {
        status: 'error',
        msg: 'Oops, something went wrong'
      };
    }

    return {
      status: 'success',
      msg: 'Status changed'
    };
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.editCurrentUser = functions.https.onCall(async (data, context) => {
  isAuthorized(context);

  const {user} = data;
  const {uid} = user;

  try {
    await admin.auth().updateUser(uid, {
      displayName: `${user.firstName} ${user.lastName}`
    });

    await admin.firestore().collection('users').doc(uid).update({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    });

    return await getUserClaims(context);
  } catch (e) {
    throw new HttpsError('cancelled', e.message);
  }
});

exports.getUserClaims = functions.https.onCall(async (data, context) => {
  return getUserClaims(context)
});

async function getUserClaims(context: CallableContext) {
  if (context.auth) {
    const user = await admin.auth().getUser(context.auth.uid);
    return {
      name: user.displayName,
      isAdmin: (user.customClaims as any).isAdmin,
      photoURL: user.photoURL
    }
  } else {
    return null;
  }
}

exports.setProfileImage = functions.https.onCall(async (data, context) => {
  isAuthorized(context);

  if (context.auth) {
    const {uid} = context.auth;
    const {imageURL} = data;
    await admin.firestore().collection('users').doc(uid).update({imageURL});
  }
});

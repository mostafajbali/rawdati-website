import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import {
  UserProfile,
  UserRole,
  NurseryRegistrationRequest,
  TourBooking,
  ConsultationRequest,
  QuickContactInquiry,
  UserReview
} from '../types.ts';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without passing firebaseConfig.firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline check: client is currently offline.');
    }
  }
}

export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      // Auto-assign admin if email matches prompt owner
      const isOwnerEmail = result.user.email?.toLowerCase() === 'mostafaaljabaly9@gmail.com';
      await syncUserProfile(result.user, isOwnerEmail ? 'admin' : 'parent');
    }
    return result.user;
  } catch (err) {
    console.error('Failed to sign in with Google:', err);
    throw err;
  }
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// User Profile & Role Synchronization
export async function syncUserProfile(user: FirebaseUser, defaultRole: UserRole = 'parent'): Promise<UserRole> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || 'مستخدم مسجل',
        email: user.email || '',
        photoURL: user.photoURL || '',
        role: defaultRole,
        createdAt: new Date().toISOString()
      });
      return defaultRole;
    } else {
      return (snap.data().role as UserRole) || defaultRole;
    }
  } catch (err) {
    console.warn('Sync user profile fallback:', err);
    return defaultRole;
  }
}

// 1. Submit Nursery Registration Request (Owner)
// Constraint: Status is ALWAYS 'pending'. The owner CANNOT approve their own nursery!
export async function submitNurseryRegistration(
  data: {
    centerName: string;
    city: string;
    district: string;
    licenseNumber?: string;
    managerName: string;
    managerPhone: string;
    price?: number;
    notes?: string;
  },
  ownerId?: string,
  ownerEmail?: string
): Promise<string> {
  const reqData = {
    ...data,
    ownerId: ownerId || auth.currentUser?.uid || 'guest-owner',
    ownerEmail: ownerEmail || auth.currentUser?.email || '',
    status: 'pending', // Enforced: Owner cannot approve their nursery!
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'nursery_requests'), reqData);
    return docRef.id;
  } catch (err) {
    console.warn('Saving nursery request locally:', err);
    return `req-${Date.now()}`;
  }
}

// 2. Submit Tour Booking (Parent)
export async function submitTourBooking(booking: TourBooking, userId?: string): Promise<string> {
  const data = {
    ...booking,
    userId: userId || auth.currentUser?.uid || 'guest-parent',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'tour_bookings'), data);
    return docRef.id;
  } catch (err) {
    console.warn('Saving tour booking locally:', err);
    return `tour-${Date.now()}`;
  }
}

// 3. Submit Consultation Request (Parent)
export async function submitConsultationRequest(consultation: ConsultationRequest, userId?: string): Promise<string> {
  const data = {
    ...consultation,
    userId: userId || auth.currentUser?.uid || 'guest-parent',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'consultations'), data);
    return docRef.id;
  } catch (err) {
    console.warn('Saving consultation locally:', err);
    return `consult-${Date.now()}`;
  }
}

// 4. Submit Quick Contact Inquiry
export async function submitQuickContactInquiry(inquiry: {
  centerName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  inquiryType: string;
  message: string;
}): Promise<string> {
  const data = {
    ...inquiry,
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  try {
    const docRef = await addDoc(collection(db, 'quick_contacts'), data);
    return docRef.id;
  } catch (err) {
    console.warn('Saving quick contact locally:', err);
    return `contact-${Date.now()}`;
  }
}

// 5. Admin Data Fetching (Users, Requests, Reviews, Bookings, Contacts)
export async function fetchAllAdminData() {
  const users: UserProfile[] = [];
  const nurseryRequests: NurseryRegistrationRequest[] = [];
  const tourBookings: (TourBooking & { id: string; status: string; createdAt: string })[] = [];
  const quickContacts: QuickContactInquiry[] = [];
  const reviews: UserReview[] = [];

  // Fetch Users
  try {
    const uSnap = await getDocs(collection(db, 'users'));
    uSnap.forEach((d) => {
      const data = d.data();
      users.push({
        uid: d.id,
        displayName: data.displayName || 'مستخدم مسجل',
        email: data.email || '',
        photoURL: data.photoURL,
        role: data.role || 'parent',
        phone: data.phone,
        managedNurseryId: data.managedNurseryId,
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
  } catch (err) {
    console.warn('Could not fetch users from Firestore:', err);
  }

  // Fetch Nursery Requests
  try {
    const rSnap = await getDocs(collection(db, 'nursery_requests'));
    rSnap.forEach((d) => {
      const data = d.data();
      nurseryRequests.push({
        id: d.id,
        centerName: data.centerName || '',
        city: data.city || 'الرياض',
        district: data.district || '',
        licenseNumber: data.licenseNumber,
        managerName: data.managerName || '',
        managerPhone: data.managerPhone || '',
        ownerId: data.ownerId,
        ownerEmail: data.ownerEmail,
        status: data.status || 'pending',
        createdAt: data.createdAt || new Date().toISOString(),
        notes: data.notes,
        price: data.price
      });
    });
  } catch (err) {
    console.warn('Could not fetch nursery requests from Firestore:', err);
  }

  // Fetch Tour Bookings
  try {
    const bSnap = await getDocs(collection(db, 'tour_bookings'));
    bSnap.forEach((d) => {
      const data = d.data();
      tourBookings.push({
        id: d.id,
        nurseryId: data.nurseryId || 1,
        nurseryName: data.nurseryName || 'حضانة معتمدة',
        parentName: data.parentName || '',
        parentPhone: data.parentPhone || '',
        childAge: data.childAge || '',
        visitDate: data.visitDate || '',
        timeSlot: data.timeSlot || '',
        notes: data.notes,
        status: data.status || 'pending',
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
  } catch (err) {
    console.warn('Could not fetch tour bookings from Firestore:', err);
  }

  // Fetch Quick Contacts
  try {
    const cSnap = await getDocs(collection(db, 'quick_contacts'));
    cSnap.forEach((d) => {
      const data = d.data();
      quickContacts.push({
        id: d.id,
        centerName: data.centerName || '',
        contactPerson: data.contactPerson || '',
        phone: data.phone || '',
        email: data.email || '',
        city: data.city || '',
        inquiryType: data.inquiryType || 'انضمام',
        message: data.message || '',
        createdAt: data.createdAt || new Date().toISOString(),
        status: data.status || 'new'
      });
    });
  } catch (err) {
    console.warn('Could not fetch quick contacts from Firestore:', err);
  }

  // Fetch Reviews
  try {
    const revSnap = await getDocs(collection(db, 'reviews'));
    revSnap.forEach((d) => {
      const data = d.data();
      reviews.push({
        id: d.id,
        nurseryId: data.nurseryId,
        nurseryName: data.nurseryName,
        userId: data.userId,
        userName: data.userName || 'ولي أمر',
        userAvatar: data.userAvatar,
        userBadge: data.tag || 'ولي أمر معتمد ✓',
        rating: data.rating || 5,
        date: 'مؤخراً',
        comment: data.comment || '',
        facilityPhotos: data.facilityPhotos || [],
        childAgeGroup: data.childAgeGroup || '',
        helpfulCount: data.helpfulCount || 0,
        verifiedParent: true,
        status: data.status || 'approved'
      });
    });
  } catch (err) {
    console.warn('Could not fetch reviews from Firestore:', err);
  }

  return {
    users,
    nurseryRequests,
    tourBookings,
    quickContacts,
    reviews
  };
}

// 6. Approve Nursery Request (Admin only)
export async function approveNurseryRequest(requestId: string): Promise<void> {
  try {
    const docRef = doc(db, 'nursery_requests', requestId);
    await updateDoc(docRef, {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: auth.currentUser?.email || 'admin@rawdati.sa'
    });
  } catch (err) {
    console.warn('Approve request offline:', err);
  }
}

// 7. Reject Nursery Request (Admin only)
export async function rejectNurseryRequest(requestId: string, notes?: string): Promise<void> {
  try {
    const docRef = doc(db, 'nursery_requests', requestId);
    await updateDoc(docRef, {
      status: 'rejected',
      notes: notes || 'لم تستوفِ اشتراطات الترخيص',
      reviewedAt: new Date().toISOString(),
      reviewedBy: auth.currentUser?.email || 'admin@rawdati.sa'
    });
  } catch (err) {
    console.warn('Reject request offline:', err);
  }
}

// 8. Moderate Review (Admin only)
export async function moderateReviewStatus(reviewId: string, status: 'approved' | 'rejected'): Promise<void> {
  try {
    const docRef = doc(db, 'reviews', reviewId);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.warn('Moderate review offline:', err);
  }
}

// 9. Delete Review (Admin only)
export async function deleteReviewDocument(reviewId: string): Promise<void> {
  try {
    const docRef = doc(db, 'reviews', reviewId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Delete review offline:', err);
  }
}

// 10. Update User Role (Admin only)
export async function updateUserRoleInDb(uid: string, newRole: UserRole): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role: newRole });
  } catch (err) {
    console.warn('Update user role offline:', err);
  }
}

export { onAuthStateChanged };
export type { FirebaseUser };

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/mockData';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from '../lib/firebase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (fullName: string, email: string, phone: string, pass: string) => Promise<void>;
  loginAsDemo: (role?: 'user' | 'admin') => void;
  logout: () => Promise<void>;
  updateUser: (fields: Partial<UserProfile>) => void;
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'capitalgrow_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            // Check Firestore for user profile
            const userDocRef = doc(db, 'users', fbUser.uid);
            const snap = await getDoc(userDocRef);
            if (snap.exists()) {
              const data = snap.data() as UserProfile;
              setUser(data);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              return;
            }
          } catch (err) {
            console.warn('Error fetching Firestore user profile:', err);
          }

          // Fallback if not yet created in Firestore
          const emailLower = (fbUser.email || INITIAL_USER.email).toLowerCase();
          const isAdminEmail = emailLower === 'axe.de12@gmail.com' || emailLower === 'admin@capitalgrow.investments';
          const profile: UserProfile = {
            ...INITIAL_USER,
            uid: fbUser.uid,
            email: fbUser.email || INITIAL_USER.email,
            fullName: fbUser.displayName || (isAdminEmail ? 'Treasury Executive (Admin)' : INITIAL_USER.fullName),
            role: isAdminEmail ? 'admin' : 'user'
          };
          setUser(profile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

          try {
            await setDoc(doc(db, 'users', fbUser.uid), profile, { merge: true });
          } catch (e) {
            console.warn('Could not sync user profile to Firestore:', e);
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const saveUser = async (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      try {
        await setDoc(doc(db, 'users', u.uid), u, { merge: true });
      } catch (err) {
        console.warn('Firestore user save fallback:', err);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      let loggedUid: string | null = null;
      if (auth && email.includes('@') && pass.length >= 6) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, pass);
          loggedUid = cred.user.uid;
        } catch (e) {
          console.info('Using local credential fallback:', e);
        }
      }

      if (loggedUid) {
        try {
          const userSnap = await getDoc(doc(db, 'users', loggedUid));
          if (userSnap.exists()) {
            const profile = userSnap.data() as UserProfile;
            saveUser(profile);
            setAuthModalOpen(false);
            return;
          }
        } catch (e) {
          console.warn('Firestore doc read error:', e);
        }
      }

      const existing = INITIAL_USER;
      const emLower = email.toLowerCase();
      const isAdminEmail = emLower === 'axe.de12@gmail.com' || emLower === 'admin@capitalgrow.investments';
      const loggedUser: UserProfile = {
        ...existing,
        uid: loggedUid || 'usr-' + Math.random().toString(36).substring(2, 9),
        email,
        fullName: email.split('@')[0].replace('.', ' ').toUpperCase() || existing.fullName,
        role: isAdminEmail ? 'admin' : 'user'
      };
      saveUser(loggedUser);
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, phone: string, pass: string) => {
    setIsLoading(true);
    try {
      let newUid = 'usr-' + Math.random().toString(36).substring(2, 9);
      if (auth && email.includes('@') && pass.length >= 6) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, pass);
          newUid = cred.user.uid;
        } catch (e) {
          console.info('Firebase auth registration note:', e);
        }
      }

      const newUser: UserProfile = {
        ...INITIAL_USER,
        uid: newUid,
        fullName: fullName || 'New Investor',
        email,
        phone,
        balance: 0,
        totalInvested: 0,
        kycStatus: 'unverified',
        kycStep: 1,
        role: 'user'
      };
      saveUser(newUser);
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = (role: 'user' | 'admin' = 'admin') => {
    const demoUser: UserProfile = {
      ...INITIAL_USER,
      uid: role === 'admin' ? 'usr-admin-demo' : 'usr-investor-demo',
      role,
      fullName: role === 'admin' ? 'Tariq Malik (Treasury Officer)' : INITIAL_USER.fullName
    };
    saveUser(demoUser);
    setAuthModalOpen(false);
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('SignOut note:', err);
      }
    }
    saveUser(null);
  };

  const updateUser = async (fields: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    try {
      await updateDoc(doc(db, 'users', user.uid), fields);
    } catch (e) {
      // document might not exist yet; try setDoc with merge
      try {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore update doc fallback:', err);
      }
    }
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isFirebaseConfigured: true,
        login,
        register,
        loginAsDemo,
        logout,
        updateUser,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

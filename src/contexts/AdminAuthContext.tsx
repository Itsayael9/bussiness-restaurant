import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type User,
} from "firebase/auth";
import { ADMIN_EMAIL, ADMIN_USERNAME } from "@/lib/adminConstants";
import { firebaseAuth } from "@/lib/firebase";

type AdminAuthContextValue = {
  ready: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!firebaseAuth) {
      setReady(true);
      return;
    }

    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      ready,
      user,
      async login(username, password) {
        if (!firebaseAuth) throw new Error("Firebase Auth is not configured.");
        if (username.trim().toLowerCase() !== ADMIN_USERNAME) {
          throw new Error("Invalid username.");
        }
        await signInWithEmailAndPassword(firebaseAuth, ADMIN_EMAIL, password);
      },
      async logout() {
        if (!firebaseAuth) return;
        await signOut(firebaseAuth);
      },
      async changePassword(currentPassword, newPassword) {
        if (!firebaseAuth?.currentUser?.email) {
          throw new Error("You must be logged in to update the password.");
        }
        const credential = EmailAuthProvider.credential(
          firebaseAuth.currentUser.email,
          currentPassword
        );
        await reauthenticateWithCredential(firebaseAuth.currentUser, credential);
        await updatePassword(firebaseAuth.currentUser, newPassword);
      },
    }),
    [ready, user]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return ctx;
}

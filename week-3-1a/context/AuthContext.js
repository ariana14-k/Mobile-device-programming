import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const ref = doc(db, "users", firebaseUser.uid);
                const snap = await getDoc(ref);

                const firestoreData = snap.exists() ? snap.data() : {};

                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    createdAt: firebaseUser.metadata.creationTime,
                    ...firestoreData,
                });

            } else {
                setUser(null);
                router.replace("/login");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth)
            router.replace("/login");
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
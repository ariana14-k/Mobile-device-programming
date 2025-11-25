import { createContext, useContext, useEffect, useState } from "react"
import {onAuthStateChanged, signOut} from "firebase/auth"
import {auth, db} from "../firebase"
import { doc, getDoc } from "firebase/firestore";
import {router} from "expo-router" 
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,  async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const data = await getDoc(userRef);
                const updatedUser = data.exists() ? data.data() : {}
                setUser({
                    id: user.uid,
                    email: user.email,
                    image: user.image || null,
                    ...updatedUser
                })
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
                router.replace("/(auth)/login");
            }
        })

        return () => unsubscribe();
    }, [])

    const logout = async () => {
        try {
        await signOut(auth);
        router.replace("/login")
    } catch (error) {
      console.log(error)
    }
    }

    return (
        <AuthContext.Provider value={{user, logout, loading, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
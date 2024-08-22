// Creating users context API here.
import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "../Database/firebaseConfig";
import { doc, setDoc} from "firebase/firestore";


// Create Context
export const userContext = createContext();

// Custom hooks to use user context
export function useUserContext(){
    return useContext(userContext);
}

// Creating Custom provider component
export function CustomUserContext({ children }){
    // States
    const [signedUser, setSignedUser] = useState('');
    let   [isSignIn, setIsSignIn] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();

    // Checking if user is signin or not and setting isSign and signedUser state
    useEffect(() => {
        // Set up Firebase Auth observer to persist authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setSignedUser(user.uid);
                setIsSignIn(true);
            } else {
                // No user is signed in
                setIsSignIn(false);
                setSignedUser('');
            }
        });
    
        // Clean up the observer when the component unmounts
        return () => unsubscribe();
    }, [auth]);
    
    const handleSignUp = async () => {
        try {
            // Perform signup
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
    
            // Update user profile with additional data
            await updateProfile(user, {
                name
            });
    
            // Save user details to the database
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: user.email,
            });

            // Automatically signin after signup
            handleSignIn();
    
            // Clear form fields
            setName('');
            setEmail('');
            setPassword('');
    
            toast.success('User signed up successfully!');
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };


    // For signin a user
    const handleSignIn = async() => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('User signed in successfully!');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // For logout the user
    const handleLogout = async() => {
        try {
            await signOut(auth);
            toast.success('User signed out successfully!');
        } catch (error) {
            console.log(error); 
            toast.error(error.message);
        }
    }

    // Returning Here
    return(
        // Default Provider
        <userContext.Provider value={{
            isSignIn,
            signedUser,
            name,
            setName,
            email,
            setEmail,
            password,
            setPassword,
            handleSignUp,
            handleSignIn,
            handleLogout
            }}>
            {children}
        </userContext.Provider>
    )
}
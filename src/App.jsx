import './App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


function App() {
  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');
  const [user, SetUser] = useState(null);

  useEffect(() => {
    // Chec the User's authentication state when on loading
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is Logged In
        setUser(currentUser);
      } else {
        // User Logged Out
        setUser(null)  
      }
    })

    return () => unsubscribe();
  })

  useEffect(() => {
    async function testFirestore() {
      const docRef = doc(db, "testCollection", "testDocument");
      const docSnap = await getDoc(docRef);

      // Updates Specific Field
      await updateDoc(docRef, {
        age: "3500",
        name: "Leto II"
      })

      if (docSnap.exists()) {
        console.log("Updated Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    }

    testFirestore();
  }, []);


  // Sign Up
  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      SetUser(userCredential.user);
      console.log('User signed up:', userCredential.user);
    })
    .catch(error =>{
      console.error('Error signing up:', error);
    });
  }

  // Sign In
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then(userCrendtial => {
      setUser(userCredintial.user);
      console.log("User has already Logged In ")
    })
    .catch(error => {
      console.error('Error Logging In:', error);
    });
  }

  // Sign Out
  const logOut = () => {
    signOut(auth)
    .then(() => {
      setUser(null);
      console.log('User is Logged Out');
    })
    .catch(error => {
      console.error('Error Logging Out:', error);
    });
  } 



  return (
    <>
    <p>Firestore Authentication</p>

    <div>
      {
        !user && (
        <>
          <input type="text" placeholder= 'Email' value={email} onChange={(event) => setEmail(event.target.value)} />
          <input type="password" placeholder='Password' value={password} onChange={(event) => setPasword(event.target.value)} />
          <button onClick={signUp}>Sign Up</button>
          <button onClick={signIn}>Log In</button>
        </>
        )
      }
    </div>

    {
      user && (
        <div>
          <p>Logged in As: {user.email}</p>
          <button onClick={logOut}>Log Out</button>
        </div>
      )
    }
    </>
  )
}

export default App

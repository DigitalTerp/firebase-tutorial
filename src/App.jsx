import './App.css';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { db, auth, app} from './lib/firebase';
import Todo from './components/Todo';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPasword] = useState('');
  const [user, SetUser] = useState(null);

  useEffect(() => {
    // Check the User's authentication state when on loading
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is Logged In
        SetUser(currentUser);
      } else {
        // User Logged Out
        SetUser(null)  
      }
    })

    return () => unsubscribe();
  })


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
      SetUser(userCrendtial.user);
      console.log('User has already Logged In:', userCrendtial.user);
    })
    .catch(error => {
      console.error('Error Logging In:', error);
    });
  }

  // Sign Out
  const logOut = () => {
    signOut(auth)
    .then(() => {
      SetUser(null);
      console.log('User is Logged Out');
    })
    .catch(error => {
      console.error('Error Logging Out:', error);
    });
  } 



  return (
    <>
    <div>
      {
        !user && (
        <>
          <h1>Firestore Authentication</h1>
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
          <Todo />
          <p>Logged in As: {user.email}</p>
          <button onClick={logOut}>Log Out</button>
        </div>
      )
    }
    </>
  )
}

export default App

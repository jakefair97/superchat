import './App.css';
import { useRef, useState } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut} from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, getDocs, orderBy, query, limit, serverTimestamp} from "firebase/firestore"

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDWKPuP7LlO3olmIm6wEJVDjZAhJ6WO1E",
  authDomain: "practice-75708.firebaseapp.com",
  projectId: "practice-75708",
  storageBucket: "practice-75708.appspot.com",
  messagingSenderId: "311156684251",
  appId: "1:311156684251:web:e11e98598b70a412d4e3fe",
  measurementId: "G-XKSCPV8GS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth();

function App() {
  
  const [user] = useAuthState(auth);
  
  return (
    <div className='App'>
      <header>
        <SignOut />

        <div>
          {user ? `Hello, ${user.displayName.split(" ")[0]}!` : ''}
        </div>
      </header>

      <section>
        {user? <ChatRoom /> : <SignIn/> }

      </section>

    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }

  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => signOut(auth)}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messageRef = collection(db, "messages");
  const q = query(messageRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(q, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid} = auth.currentUser;

    await addDoc(messageRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid
    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior:'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message ={msg} />)}

        <div ref={dummy}></div>
      </main>


      <form onSubmit={sendMessage}>
        <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">🐦</button>
      </form>
    </>
  )

}

function ChatMessage(props) {
  const { text, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className = {`message ${messageClass}`}>
      <p>{text}</p>
    </div> 
  )
}

export default App

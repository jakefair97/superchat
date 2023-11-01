import './App.css';
import { useState } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, getDocs, orderBy, query, limit} from "firebase/firestore"

import { useCollectionData } from 'react-firebase-hooks/firestore';

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

function App() {

  return (
    <div className='App'>
      <header>

      </header>

      <section>
        <ChatRoom />
      </section>

    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

function ChatRoom() {
  const messageRef = collection(db, "messages");
  const q = query(messageRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(q, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message ={msg} />)}
      </div>

      <form onSubmit={sendMessage}>
        <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">🐦</button>
      </form>
    </>
  )

}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  // const messageClass = uid === auth.current.uid ? 'sent' : 'received';

  return (
    <div className = {`message ${messageClass}`}>
      <img src={photoURL} alt="user photo" />
      <p>{text}</p>
    </div> 
  )
}

export default App

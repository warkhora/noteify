import { useState } from "react";
import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginEmail() {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function registerEmail() {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function loginGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function loginAnon() {
    await signInAnonymously(auth);
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input 
        placeholder="Email" 
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input 
        placeholder="Password" 
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={loginEmail}>Log in with Email</button>
      <button onClick={registerEmail}>Register</button>
      <button onClick={loginGoogle}>Log in with Google</button>
      <button onClick={loginAnon}>Continue without account</button>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

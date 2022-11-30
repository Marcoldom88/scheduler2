import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCv3Rt1mS1pw8R1VaF1dBNqgy7lBtos-Y0",
  authDomain: "nysl-react-66a6a.firebaseapp.com",
  databaseURL: "https://nysl-react-66a6a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nysl-react-66a6a",
  storageBucket: "nysl-react-66a6a.appspot.com",
  messagingSenderId: "848603065691",
  appId: "1:848603065691:web:c7b389c440fe3970e77e7e",
  measurementId: "G-L5WXZZ6T6H"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);


      export const useData = (path, transform) => {
        const [data, setData] = useState();
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState();
      
        useEffect(() => {
          const dbRef = ref(database, path);
          const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
          if (devMode) { console.log(`loading ${path}`); }
          return onValue(dbRef, (snapshot) => {
            const val = snapshot.val();
            if (devMode) { console.log(val); }
            setData(transform ? transform(val) : val);
            setLoading(false);
            setError(null);
          }, (error) => {
            setData(null);
            setLoading(false);
            setError(error);
          });
        }, [path, transform]);
      
        return [data, loading, error];
};
      
export const setData = (path, value) => (
  set(ref(database, path), value)
);

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};
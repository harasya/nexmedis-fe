import { auth, db } from './firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export async function registerUser(email: string, password: string, username: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      createdAt: serverTimestamp(),
    })

    console.log('User registered & saved in Firestore:', user.uid)
    return user
  } catch (error) {
    if (error instanceof Error) {
      console.error('Registration error:', error.message)
    } else {
      console.error('Unknown error:', error)
    }
    throw error
  }
}

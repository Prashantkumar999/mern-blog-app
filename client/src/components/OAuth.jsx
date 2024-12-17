import React from 'react';
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import {useNavigate} from 'react-router-dom'
const OAuth = () => {
    const dispatch = useDispatch();
    const auth = getAuth(app);
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            // console.log(resultFromGoogle)
            //send result form google to backend

            const res = await fetch('/api/auth/google',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: resultFromGoogle.user.displayName,
                        email: resultFromGoogle.user.email,
                        gmailPhotoUrl: resultFromGoogle.user.photoURL,
                    })
                })
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate('/')
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <button onClick={handleGoogleClick} className='flex gap-3 items-center justify-center text-md font-semibold  px-3 w-full py-2 rounded-md dark:bg-black bg-yellow-300 dark:hover:bg-gray-800 hover:bg-yellow-400  transition-all duration-200 '>
            <p>
                Sign In With Google
            </p> <FaGoogle />
        </button>
    );
}

export default OAuth;

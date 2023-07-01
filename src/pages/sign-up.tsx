import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {auth} from '../../firebase'
import {createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged} from 'firebase/auth';

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false)
  const [registrationFailure, setRegistrationFailure] = useState(false)

  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.emailVerified) {
        console.log("User's email is verified.");
        router.push('/login')
      } else {
        console.log("User's email is not verified.");
      }
    } else {
      console.log("User is not signed in.");
    }
  });

  const handleVerifyPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    e.preventDefault()
    setVerifyPassword(e.target.value)
    const verificationPassword = e.target.value
    if(verificationPassword === password){
      setPasswordVerified(true)
    }else{
      setPasswordVerified(false)
    }
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await sendEmailVerification(user);

    } catch (error) {
      console.error("Error registering user: ", error);
      //throw error here
      setRegistrationFailure(true)
    }

  };

  return (
    <div className='w-full h-screen flex items-center'>
      
      <div className={`w-[500px] h-[400px] px-14 py-10 mx-auto shadow-lg border-4 
    rounded-lg border-orange-600 `}>
      <h2 className='w-max text-4xl mx-auto font-extrabold text-gray-800'>Sign Up</h2>
      <form onSubmit={handleSubmit}
      className={`h-full flex flex-col justify-evenly items-center`}>
        <div className='w-full flex bg-orange-200 rounded-lg border-b-4 border-b-orange-600'>
          <label htmlFor="name" 
          className='block px-4 py-2 font-semibold rounded-l-md'>
            Name:</label>
          <input type="text" id="name" value={name} onChange={event => setName(event.target.value)}
          className='w-max px-4 py-2 bg-orange-200 outline-none rounded-r-lg'
          />
        </div>
        <div className='w-full flex bg-orange-200 rounded-lg border-b-4 border-b-orange-600'>
          <label htmlFor="email" 
          className='block px-4 py-2 font-semibold rounded-l-md'>
            Email:</label>
          <input type="email" id="email" value={email} onChange={event => setEmail(event.target.value)}
          className='w-max px-4 py-2 bg-orange-200 outline-none rounded-r-lg '
          />
        </div>
        <div className='w-full flex bg-orange-200 rounded-lg border-b-4 border-b-orange-600'>
          <label htmlFor="username"
          className='block px-4 py-2 font-semibold rounded-l-md'
          >Username:</label>
          <input type="text" id="username" value={username} onChange={event => setUsername(event.target.value)}
          className='w-max px-4 py-2 bg-orange-200 outline-none rounded-r-lg '
          />
        </div>
        <div className='w-full flex bg-orange-200 rounded-lg border-b-4 border-b-orange-600'>
          <label htmlFor="password"
          className='block px-4 py-2 font-semibold rounded-l-md'
          >Password:</label>
          <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)}
          className='w-max px-4 py-2 bg-orange-200 outline-none rounded-r-lg '
          />
        </div>
        <div className='w-full flex bg-orange-200 rounded-lg border-b-4 border-b-orange-600'>
          <label htmlFor="password1"
          className='w-full block pl-4 py-2 font-semibold rounded-l-md'
          >Verify Password:</label>
          <input type="password" id="password1" value={verifyPassword} onChange={(e) => handleVerifyPassword(e)}
          className='w-max px-4 py-2 bg-orange-200 outline-none rounded-r-lg '
          />
        </div>
        {verifyPassword && <div>{passwordVerified && <p>password matched</p>}{!passwordVerified && <p>password does not match</p>}</div>}
        <button type="submit"
        className='border px-3 py-2 rounded-xl border-orange-700 bg-white text-orange-700 font-semibold hover:text-lg'
        >Sign Up</button>
      </form>
      </div>
    </div>
  );
};

export default SignUpForm;



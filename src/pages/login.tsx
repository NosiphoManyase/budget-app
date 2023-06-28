import { fetchData } from '@/data/data';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [userExists, setUserExists] = useState(false);
    const [invalidDetails, setInvalidDetails] = useState(true)
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const data = await fetchData(username, 'Users');
            if (data) {
              setUserExists(true);
              Cookies.set('username', username)
              router.push('/')
            }
        } catch (err) {
            console.log('in error')
            console.error('Error: ',err);
            // Reset email/password
            setInvalidDetails(false);
        }
    
    }

  return (
    <div className='w-full h-screen flex items-center'>
    <div className={`w-[500px] h-[400px] px-14 py-10 mx-auto shadow-lg border-4 
    rounded-lg border-orange-600 bg-orange-300`}>
        <h2 className='w-max text-4xl mx-auto font-extrabold text-gray-800 '>Log In</h2>
        <form onSubmit={handleSubmit}
        className={`h-full flex flex-col justify-evenly items-center`}>
            <div className='w-full flex border-2 border-orange-600 rounded-lg'>
            <label htmlFor="email" className='block px-4 py-2 bg-orange-600 text-white font-semibold rounded-l-md'>Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} 
            className='w-full px-4 py-2 outline-none rounded-r-lg '/>
            </div>
            <div className='w-full flex border-2 border-orange-600 rounded-lg'>
            <label htmlFor="username" className='block w-1/7 px-4 py-2 bg-orange-600 text-white font-semibold rounded-l-md'>Username:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} 
            className='w-full px-4 py-2 outline-none rounded-r-lg '/>
            </div>
            <button type="submit"
            className='border-2 px-3 py-2 rounded-xl border-orange-700 bg-white text-orange-700 font-semibold hover:text-lg'>log in</button>
        </form>
        </div>
    </div>
  )
}

export default Login;

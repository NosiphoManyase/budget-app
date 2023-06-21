import { fetchData } from '@/data/data';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const login = () => {
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
            console.error(err);
            // Reset email/password
            setInvalidDetails(false);
        }
    
    }

  return (
        <div>
        <h2>Log in</h2>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <button type="submit">log in</button>
        </form>
        </div>
  )
}

export default login;

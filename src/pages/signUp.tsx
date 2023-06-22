import { updateData } from '@/data/data';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userDetails= [username, name, email]

    //add user details to google sheet
    updateData(userDetails, 'Users')
    router.push('/login')
  };

  return (
    <div className='w-full h-screen flex items-center'>
      <div className={`w-[500px] h-[400px] px-14 py-10 mx-auto shadow-lg border-4 
    rounded-lg border-orange-600 bg-orange-300`}>
      <h2 className='w-max text-4xl mx-auto font-extrabold text-gray-800'>Sign Up</h2>
      <form onSubmit={handleSubmit}
      className={`h-full flex flex-col justify-evenly items-center`}>
        <div className='w-full flex border-2 border-orange-600 rounded-lg'>
          <label htmlFor="name" 
          className='block px-4 py-2 bg-orange-600 text-white font-semibold rounded-l-md'>
            Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange}
          className='w-full px-4 py-2 outline-none rounded-r-lg'
          />
        </div>
        <div className='w-full flex border-2 border-orange-600 rounded-lg'>
          <label htmlFor="email" 
          className='block px-4 py-2 bg-orange-600 text-white font-semibold rounded-l-md'>
            Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange}
          className='w-full px-4 py-2 outline-none rounded-r-lg '
          />
        </div>
        <div className='w-full flex border-2 border-orange-600 rounded-lg'>
          <label htmlFor="username"
          className='block px-4 py-2 bg-orange-600 text-white font-semibold rounded-l-md'
          >Username:</label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange}
          className='w-full px-4 py-2 outline-none rounded-r-lg '
          />
        </div>
        <button type="submit"
        className='border px-3 py-2 rounded-xl border-orange-700 bg-white text-orange-700 font-semibold hover:text-lg'
        >Sign Up</button>
      </form>
      </div>
    </div>
  );
};

export default SignUpForm;



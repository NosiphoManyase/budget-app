import React from 'react'
import { useRouter } from 'next/dist/client/router'

const emailVerified = () => {
  const router = useRouter()

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-[500px] h-[300px] border-4'>
          <p>Your email has be verified</p>
          <button onClick={() => router.push('/login')}>Login</button>
      </div>
    </div>
  )
}

export default emailVerified
import MainContent from '@/Components/MainContent'
import NavBar from '@/Components/NavBar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    //if user is signed in
    <div className='bg-gray-50'>
      <NavBar />
      <div>
        <MainContent />
      </div>
    </div>
  )
}

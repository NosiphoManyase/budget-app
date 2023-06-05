import MainContent from '@/Components/MainContent'
import NavBar from '@/Components/NavBar'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <NavBar />
      <div>
        <MainContent />
      </div>
    </>
  )
}

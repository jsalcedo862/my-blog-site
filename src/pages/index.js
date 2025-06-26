import Navbar from '@/components/Navbar'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center p-8 space-y-6">
        <Image
          src="/images/3klogo.jpg"
          alt="3k Records Logo"
          width={800}
          height={400}
          className="w-32 sm:w-48 md:w-60 h-auto rounded"
        />


        <h1 className="text-3xl text-center">Underground Electronic Music Hub</h1>
      </main>
    </>
  );
}

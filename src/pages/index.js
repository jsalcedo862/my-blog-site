import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center p-8 space-y-6">
        <Image
          src="/images/3klogo.jpg"
          alt="3k Records Logo"
          width={800}
          height={400}
          className="w-32 sm:w-48 md:w-60 h-auto rounded"
        />

        <h1 className="text-3xl text-center">
          Electronic Music Hub
        </h1>

        <p>Welcome, currently only our spotlight feature is available. Click below to explore!</p>

        {/* 🚀 Spotlight Button */}
        <a
          href="/spotlight"
          className="mt-6 inline-block bg-[#495361] text-white px-6 py-2 rounded-md text-lg hover:bg-blue-700 transition"
        >
          Spotlight
        </a>

      </main>

      <Footer />
    </div>
  );
}

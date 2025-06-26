import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-blue-50 p-8">
        <h1 className="text-5xl font-bold text-center">Welcome to My Blog: 3k Records</h1>
      </main>
    </>
  );
}

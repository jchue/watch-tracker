import Head from 'next/head';
import Link from 'next/link';
import Search from './Search';

export default function Layout({ children }) {
  return (
    <>
      <Head>
          <title>Watch Tracker</title>
      </Head>

      <div className="font-sans text-gray-800 h-full flex flex-col">
        <header className="bg-white py-4 shadow-sm">
          <div className="max-w-5xl mx-auto">
            <Link href="/"><span className="font-bold mr-8">Watch Tracker</span></Link>
            <Search />
          </div>
        </header>
        <main className="pt-16 flex-grow">
          <div className="max-w-5xl mx-auto h-full">
          {children}
          </div>
        </main>
        <footer className="bg-gray-600 mt-16 py-8 text-sm text-white">
          <div className="max-w-5xl mx-auto text-center">
            Watch Tracker
          </div>
        </footer>
      </div>
    </>
  )
};

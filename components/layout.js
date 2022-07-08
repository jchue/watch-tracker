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
        <header className="bg-white fixed py-4 shadow-sm top-0 w-full z-10">
          <div className="max-w-5xl mx-auto">
            <Link href="/"><a className="font-bold mr-8">Watch Tracker</a></Link>
            <Search />
          </div>
        </header>

        <main className="grow mt-16 pt-16">
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

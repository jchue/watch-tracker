import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="h-full flex flex-col justify-center">
      <span className="text-6xl tracking-tight font-extrabold text-gray-800">Track Your Watch Activity</span>

      <p className="text-lg text-gray-500">Start by searching for a show or movie above.</p>
    </div>
  )
}

export default Home

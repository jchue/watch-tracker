import React from 'react';
import { useRouter } from 'next/router';

class NotFound extends React.Component {
  render() {
    return (
      <div className="h-full flex flex-col justify-center">
        <h1 className="font-bold text-4xl mb-4">404 Not Found</h1>

        <p className="text-lg text-gray-500">Sorry, but the page you requested could not be found. <Back /></p>
      </div>
    );
  }
}

function Back() {
  const router = useRouter();

  return (
    <span onClick={() => router.back()} className="cursor-pointer text-indigo-600 hover:text-indigo-500">Go back.</span>
  );
}

export default NotFound;

import { StarIcon } from '@heroicons/react/solid';

function Score({ score }) {
  return (
    <span><StarIcon className="inline h-5 w-5 -mt-1/2 text-gray-500" /> {score}</span>
  );
}

export default Score;

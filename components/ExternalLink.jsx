import { ExternalLinkIcon } from '@heroicons/react/solid';

function ExternalLink({ text, url }) {
  return (
    <a href={url} className="font-bold flex-shrink-0 inline ml-4 px-3 py-1.5 text-indigo-600 text-xs hover:text-indigo-500">{text} <ExternalLinkIcon className="inline h-5 w-5 -mt-1" /></a>
  );
}

export default ExternalLink;

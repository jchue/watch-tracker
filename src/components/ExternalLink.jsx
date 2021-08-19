import React from 'react';
import { ExternalLinkIcon } from '@heroicons/react/solid';

class ExternalLink extends React.Component {
  render() {
    return (
      <a href={this.props.url} className="font-bold flex-shrink-0 inline ml-4 px-3 py-1.5 text-indigo-500 text-xs">{this.props.text} <ExternalLinkIcon className="inline h-5 w-5 -mt-1" /></a>
    );
  }
}

export default ExternalLink;

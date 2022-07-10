import { useEffect, useState } from 'react';

function Checkbox({ id, mediaType, watched, onIndicatorClick, className }) {
  return (
    <input type="checkbox" checked={watched ? 'checked' : ''} onChange={onIndicatorClick} className={'h-6 w-6 border-gray-300 rounded cursor-pointer text-indigo-800 focus:ring-indigo-800 hover:text-indigo-500 ' + className} />
  );
}

export default Checkbox;

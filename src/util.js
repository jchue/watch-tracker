import HTTPError from './error';

const debug = require('debug')('api:server');

/**
 * Translate media type parameter to DB field
 */
function translateMediaType(mediaTypeParam) {
  let mediaType;
  switch (mediaTypeParam) {
    case 'movie':
      mediaType = 'movie';
      break;
    case 'show':
      mediaType = 'tv';
      break;
    default: {
      debug(`Invalid media type URL parameter '${mediaTypeParam}'`);
      throw new HTTPError(404);
    }
  }

  return mediaType;
}

export { translateMediaType };

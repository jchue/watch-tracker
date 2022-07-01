/**
 * Translate media type parameter to DB field
 */
function translateMediaType(mediaTypeParam) {
  let mediaType;
  switch (mediaTypeParam) {
    case 'movies':
      mediaType = 'movie';
      break;
    case 'shows':
      mediaType = 'tv';
      break;
    default: {
      console.error(`Invalid media type URL parameter '${mediaTypeParam}'`);
      throw new Error('Not Found');
    }
  }

  return mediaType;
}

export { translateMediaType };

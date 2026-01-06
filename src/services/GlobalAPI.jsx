import React, { useEffect, useRef, memo } from 'react';
import { searchPhoto } from './imageService';

function GlobalAPI({ name, address, onPhotoFetched, type = 'place', city = '' }) {
  const lastFetchedName = useRef(null);
  const onPhotoFetchedRef = useRef(onPhotoFetched);

  useEffect(() => {
    onPhotoFetchedRef.current = onPhotoFetched;
  }, [onPhotoFetched]);

  useEffect(() => {
    if (!name) return;
    
    if (name === lastFetchedName.current) return;
    
    lastFetchedName.current = name;

    const fetchPhoto = async () => {
      try {
        const photoUrl = await searchPhoto(name, { type, city });
        onPhotoFetchedRef.current(photoUrl || '/placeholder.svg');
      } catch (error) {
        console.error('Error fetching photo:', error);
        onPhotoFetchedRef.current('/placeholder.svg');
      }
    };

    fetchPhoto();
  }, [name, type, city]);

  return null;
}

export default memo(GlobalAPI);

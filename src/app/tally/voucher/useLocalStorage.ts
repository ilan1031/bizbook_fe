// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Check if we are in the browser
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      setValue(storedValue ? JSON.parse(storedValue) : initialValue);
    }
  }, [key, initialValue]);

  const setLocalStorageValue = (newValue) => {
    setValue(newValue);
    // Check if we are in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setLocalStorageValue];
}
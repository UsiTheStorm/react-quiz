import { useState, useEffect } from 'react';

export function useFetchQuestions(dispatch, url) {
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await res.json();
        dispatch({ type: 'dataReceived', payload: data });
      } catch (err) {
        dispatch({ type: 'dataFailed' });
        console.error(err);
      }
    }

    fetchData();
  }, [dispatch, url]);

  return null;
}

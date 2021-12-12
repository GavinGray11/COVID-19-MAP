// new file src/hooks/useTracker.js
// this will be empty for now

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_HOST = 'https://corona.lmao.ninja/v2';

const ENDPOINTS = [
  {
    id: 'all',
    path: '/all',
    isDefault: true
  },
  {
    id: 'countries',
    path: '/countries'
  }
]

const defaultState = {
  data: null,
  state: 'ready'
}

const useTracker = ({ api = 'all' }) => {

  const [tracker = {}, updateTracker] = useState(defaultState)

  // fetchTracker() function MUST be async due to 
  //     await keword  on (below) axios.get()
  async function fetchTracker() {   
    let route = ENDPOINTS.find(({ id } = {}) => id === api);

    if ( !route ) {
      route = ENDPOINTS.find(({ isDefault } = {}) => !!isDefault);
    }

    let response;

    try {
      updateTracker((prev) => {
        return {
          ...prev,
          state: 'loading'
        }
      });
      // axios.get() MUST have await keyword, AND
      //     (enclosing) fetchTracker() MUST have async keyword
      response = await axios.get(`${API_HOST}${route.path}`);
    } catch(e) {
      updateTracker((prev) => {
        return {
          ...prev,
          state: 'error',
          error: e
        }
      });
      return;
    }

    const { data } = response;

    updateTracker((prev) => {
      return {
        ...prev,
        state: 'ready',
        data
      }
    });

  }

  useEffect(() => {
    fetchTracker()
  }, [api])

  return {
    fetchTracker,
    ...tracker
  }
};

export default useTracker;

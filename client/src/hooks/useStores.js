import { useState, useEffect } from 'react';
import storesService from '../services/storesService';

export default function useStores({ q='', sort='name', order='asc', page=1, limit=50, enabled=true } = {}) {
  const [data, setData] = useState({ stores: [], loading: false, error: null });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      setData(d => ({ ...d, loading:true }));
      try {
        const res = await storesService.listStores({ q, sort, order, page, limit });
        if (!cancelled) setData({ stores: res.stores || [], loading:false, error:null });
      } catch (err) {
        if (!cancelled) setData({ stores: [], loading:false, error: err });
      }
    })();
    return ()=> { cancelled = true; };
  }, [q, sort, order, page, limit, enabled]);

  return data;
}

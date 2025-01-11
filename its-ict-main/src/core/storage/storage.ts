// Storage

import { MMKV } from 'react-native-mmkv';

const MMKV_STORAGE = 'MMKV_STORAGE';
const FAVORITE_CARTS_KEY = 'favorite_carts';

const mmkv = new MMKV({
  id: MMKV_STORAGE,
});

export const storage = {
  setItem: (key: string, value: string) => {
    // Se voglio salvare ad esempio una data di nascita
    // const formattedDateOfBirth
    // mmkv.set(key, formattedDateOfBirth);
    mmkv.set(key, value);
  },
  getItem: (key: string) => {
    const value = mmkv.getString(key);
    return value ?? null;
  },
  removeItem: (key: string) => {
    return mmkv.delete(key);
  },
};
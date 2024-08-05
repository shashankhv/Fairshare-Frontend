import { store } from './store'; // Ensure the correct path to your store
import { resetState } from './reducers/groupReducer'; // Ensure the correct path to your reducer
import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAppData = async () => {
  try {
    await AsyncStorage.clear();
    store.dispatch(resetState());
    console.log('App data cleared');
  } catch (e) {
    console.error('Failed to clear app data', e);
  }
};

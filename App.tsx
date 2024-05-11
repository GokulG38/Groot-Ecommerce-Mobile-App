import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import store from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <>
        <StatusBar backgroundColor='#ffafaf' barStyle='dark-content' />
        <StackNavigator />
      </>
    </Provider>
  );
}

import { AppRegistry } from 'react-native';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  return <LoginScreen />;
}


AppRegistry.registerComponent('main', () => App);
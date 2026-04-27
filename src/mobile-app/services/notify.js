import { Alert, Platform } from 'react-native';

export const showMessage = (title, message, onClose) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.alert === 'function') {
    window.alert(`${title}\n\n${message}`);
    if (typeof onClose === 'function') {
      onClose();
    }
    return;
  }

  if (typeof onClose === 'function') {
    Alert.alert(title, message, [{ text: 'Aceptar', onPress: onClose }]);
    return;
  }

  Alert.alert(title, message);
};

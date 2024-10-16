import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';

export default function CustomKeyboardView({ children }) {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true} // S'assure que cela fonctionne également sur Android
      extraHeight={150} // Ajustez ceci si nécessaire pour plus de défilement
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

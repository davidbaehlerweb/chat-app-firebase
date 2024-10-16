import { View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Loading({ size }) {
    return (
        <View style={{ height: size, width: size }}>
            <LottieView
                source={require('../assets/animations/loading2.json')} // Utilise un fichier Lottie valide pour tester
                autoPlay
                loop
                style={{ width: size, height: size }}
            />
        </View>
    );
}

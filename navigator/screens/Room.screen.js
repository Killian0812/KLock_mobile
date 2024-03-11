import { Text, View } from 'react-native';

export default function RoomScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={() => navigation.navigate('Home')}>Room screen</Text>
        </View>
    );
}
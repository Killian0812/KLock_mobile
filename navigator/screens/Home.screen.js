import { Text, View, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={() => alert("THIS IS HOMEEEE")}>Home screen</Text>
        </View>
    );
}
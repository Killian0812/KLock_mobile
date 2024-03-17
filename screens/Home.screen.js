import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    layout: {
        flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "grey"
    }
});


export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.layout}>
            <Text onPress={() => alert("THIS IS HOMEEEE")}>Home screen</Text>
        </View>
    );
}
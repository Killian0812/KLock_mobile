import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, FlatList } from 'react-native';
import AdIcons from 'react-native-vector-icons/AntDesign';

const screenWidth = Dimensions.get('window').width;

const DATA = [
    {
        id: 1,
        title: 'First Item',
        description: 'First Desciption',
    },
    {
        id: 2,
        title: 'Second Item',
        description: 'Second Desciption',
    },
    {
        id: 3,
        title: 'Third Item',
        description: 'Third Desciption',
    },
];
const Item = ({ item }) => (
    <View style={styles.row}>
        <Text style={styles.cell}>{item.id}</Text>
        <Text style={styles.cell}>{item.title}</Text>
        <Text style={styles.cell}>{item.description}</Text>
    </View>
);

const RoomScreen = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleRoomPress = (room) => {
        if (selectedRoom === room) {
            setSelectedRoom(null);
            return;
        }
        setSelectedRoom(room);
    };

    const handleClose = () => {
        setSelectedRoom(null);
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                scrollEnabled={true}
                // scrollEnabled={!selectedRoom} // Disable scrolling when a room is selected
                showsVerticalScrollIndicator={true}
                scrollEventThrottle={16}
            >

                {ROOMS.map((room) => (
                    <TouchableOpacity
                        key={room.id}
                        style={[
                            styles.roomButton,
                            selectedRoom === room ? styles.selectedRoom : null,
                        ]}
                        onPress={() => handleRoomPress(room)}
                    >
                        <Text style={styles.roomButtonText}>{room.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={selectedRoom ? styles.roomInfoWrapper : { display: "none" }}>
                {selectedRoom && (
                    <>
                        <TouchableOpacity style={styles.minimizeBtn} onPress={() => handleClose()}>
                            <AdIcons name="down-square-o" style={{ color: "white" }} size={30}></AdIcons>
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Text style={styles.heading}>Image</Text>
                            <Text style={styles.heading}>Name</Text>
                            <Text style={styles.heading}>Time</Text>
                        </View>
                        <View></View>
                        <FlatList style={styles.roomInfo}
                            data={DATA}
                            renderItem={({ item }) => <Item item={item} />}
                            keyExtractor={item => item.id}
                        />
                    </>
                )}
            </View>
        </View>
    );
};

const ROOMS = [
    { id: 1, name: 'Room 1', info: 'Information about Room 1' },
    { id: 2, name: 'Room 2', info: 'Information about Room 2' },
    { id: 3, name: 'Room 3', info: 'Information about Room 3' },
    { id: 4, name: 'Room 4', info: 'Information about Room 4' },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#969696"
    },
    scrollViewContent: {
        paddingTop: 20,
        paddingBottom: 100,
    },
    roomButton: {
        backgroundColor: '#666666',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        height: 50,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center'
    },
    selectedRoom: {
        backgroundColor: '#bababa',
    },
    roomButtonText: {
        fontWeight: 'bold',
        fontSize: 15
    },
    roomInfoWrapper: {
        position: 'absolute',
        top: 300,
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#8c8c8c',
    },
    roomInfo: {
        position: 'absolute',
        top: 90,
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#8c8c8c',
    },
    minimizeBtn: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: "center",
        width: screenWidth,
        height: 50,
        backgroundColor: '#595959',
    },
    roomInfoText: {
        fontSize: 16,
    },
    header: {
        top: 35,
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 10,
        backgroundColor: '#8c8c8c',
        flex: 1
    },
    heading: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 1,
        elevation: 1,
        padding: 10,
        backgroundColor: "#c1c1c1",
        borderColor: "black",
        borderTopWidth: 2,
    },
    cell: {
        fontSize: 15,
        textAlign: 'left',
        flex: 1
    }
});

export default RoomScreen;

import { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Alert,
    StyleSheet, Dimensions, FlatList, Image, Modal
} from 'react-native';
import AdIcons from 'react-native-vector-icons/AntDesign';
import { ref, getDownloadURL } from 'firebase/storage';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useFirebase from '../hooks/useFirebase';
import { formatDate } from '../tools/date.formatter';

const screenWidth = Dimensions.get('window').width;

const Item = ({ item, storage }) => {

    const [imageUrl, setImageUrl] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const url = await getDownloadURL(ref(storage, item.image));
                setImageUrl(url);
            } catch (error) {
                console.error('Error fetching image URL:', error);
            }
        };
        fetchImageUrl();

        // Cleanup function
        return () => {
            setImageUrl(null); // Clear the image URL when component unmounts
        };
    }, [item.image, storage]);

    const handleImageClick = () => {
        setModalVisible(true);
    };

    return (
        <>
            <View style={styles.row}>
                <TouchableOpacity onPress={handleImageClick}>
                    <Image source={{ uri: imageUrl }} style={{ width: 70, height: 70, marginRight: 20 }} />
                </TouchableOpacity>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{formatDate(item.createdAt)}</Text>
            </View>

            {/* Image Preview */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}>
                <View style={styles.imagePrevewContainer}>
                    <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
}

const RoomScreen = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [data, setData] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const { storage } = useFirebase();

    // fetch rooms
    useEffect(() => {
        axiosPrivate.get(`/api/home/rooms`).then((res) => {
            console.log(res.data);
            setRooms(res.data);
        })
    }, [axiosPrivate]);


    const handleRoomPress = (room) => {
        if (selectedRoom === room) {
            setData(null);
            setSelectedRoom(null);
            return;
        }

        // fetch room entries
        async function fetchRoomEntries() {
            const allEntries = await axiosPrivate.get(`/api/home/roomEntries?mac=${room.mac}`);
            setData(allEntries.data.reverse());
        }
        fetchRoomEntries();

        setSelectedRoom(room);
    };

    const handleRoomUnregister = async (room) => {
        Alert.alert(
            'Unregister as manager?',
            `You will no longer be able to recieve notification from ${room.name} or access its entry history.`,
            [
                {
                    text: 'Yes, confirm action',
                    onPress: () => {
                        axiosPrivate.post(`/api/home/roomUnregister`, { roomId: room._id })
                            .then(() => {
                                axiosPrivate.get(`/api/home/rooms`).then((res) => {
                                    setRooms(res.data);
                                })
                                alert(`You are no longer ${room.name}'s manager`);
                            })
                            .catch((err) => {
                                alert('Unexpected error');
                                console.log("Error unregistering as manager:", err);
                            })
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    }

    const handleClose = () => {
        setData(null);
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

                {rooms.map((room) => (
                    <TouchableOpacity
                        key={room._id}
                        style={[
                            styles.roomButton,
                            selectedRoom === room ? styles.selectedRoom : null,
                        ]}
                        onPress={() => handleRoomPress(room)}
                        onLongPress={() => handleRoomUnregister(room)}
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
                            data={data}
                            renderItem={({ item }) => <Item item={item} storage={storage} />}
                            keyExtractor={item => item._id}
                        />
                    </>
                )}
            </View>
        </View>
    );
};

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
        fontWeight: 'bold'
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
    },
    imagePrevewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    imagePreview: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        bottom: 150,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default RoomScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { formatDate } from '../tools/date.formatter';
import { getDownloadURL, ref } from "firebase/storage";
import useAuth from '../hooks/useAuth';
import useFirebase from '../hooks/useFirebase';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useNotification from '../hooks/useNotification';

function PendingRequest({ data, storage }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [show, setShow] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const url = await getDownloadURL(ref(storage, data.image));
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
    }, [data.image, storage]);

    async function handleClick(status) {
        // send request to server
        await axiosPrivate.post("/home/approveEntry", {
            id: data._id,
            MAC: data.room.mac,
            image: data.image,
            status: status
        });

        // remove from ui
        setShow(false);
    }

    const handleImageClick = () => {
        setModalVisible(true);
    };

    return (
        <>

            {!show ? <></> :
                <View style={styles.requestContainer}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={handleImageClick}>
                            <Image source={imageUrl ? { uri: imageUrl } : require('../assets/loadingFace.png')} style={styles.image} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.roomText}>Room: {data.room.name}</Text>
                        <Text style={styles.timeText}>Time arrived: {formatDate(data.createdAt)}</Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.allowButton]}
                            onPress={() => handleClick("Allow")}
                        >
                            <Text style={styles.buttonText}>Allow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.denyButton]}
                            onPress={() => handleClick("Deny")}
                        >
                            <Text style={styles.buttonText}>Deny</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
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

function NewRequest({ data, storage }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [show, setShow] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const url = await getDownloadURL(ref(storage, data.filename));
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
    }, [data.filename]);

    const handleClick = async (status) => {
        try {
            // Send request to server
            await axiosPrivate.post("/home/approveEntry", {
                id: data.id,
                MAC: data.room.mac,
                image: data.filename,
                status: status
            });

            // Remove from UI
            setShow(false);
        } catch (error) {
            console.error('Error handling click:', error);
        }
    };

    const handleImageClick = () => {
        setModalVisible(true);
    };

    return (
        <>
            {!show ? <></> :
                <View style={styles.requestContainer}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={handleImageClick}>
                            <Image source={imageUrl ? { uri: imageUrl } : require('../assets/loadingFace.png')} style={styles.image} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.roomText}>Room: {data.room.name}</Text>
                        <Text style={styles.timeText}>Time arrived: {formatDate(data.newRequest.createdAt)}</Text>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.allowButton]}
                            onPress={() => handleClick("Allow")}
                        >
                            <Text style={styles.buttonText}>Allow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.denyButton]}
                            onPress={() => handleClick("Deny")}
                        >
                            <Text style={styles.buttonText}>Deny</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

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

export default function Home() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const { newRequests, setNewRequests } = useNotification();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const { storage } = useFirebase();

    useEffect(() => {
        // fetch all pending requests from database
        axiosPrivate.get(`/home/pendingRequests?username=${auth.username}`).then((res) => {
            if (res.data)
                setPendingRequests(res.data);
        })
    }, [auth, axiosPrivate]);

    useEffect(() => {
        // clean up
        return () => {
            setNewRequests([]);
        }
    }, [setNewRequests]);

    return (
        <View style={styles.container}>
            <View style={styles.roomsSection}>
                <Text style={styles.heading}>Pending Entry Request</Text>
                <View style={styles.whiteLine}></View>
                <ScrollView
                    contentContainerStyle={styles.roomsList}
                    scrollEnabled={true}
                    // scrollEnabled={!selectedRoom} // Disable scrolling when a room is selected
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                >
                    {/* render new request recieved from web socket */}
                    {newRequests.map((newRequest, index) => {
                        return <NewRequest key={index} data={newRequest}
                            storage={storage}></NewRequest>
                    }).reverse()}
                    {/* render pending request recieved from database */}
                    {pendingRequests.map((pendingRequest, index) => {
                        return <PendingRequest key={index} data={pendingRequest}
                            storage={storage}></PendingRequest>
                    }).reverse()}

                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#969696"
    },
    roomsSection: {
        borderRadius: 20,
        width: '90%',
        maxWidth: '50vw',
        minHeight: 400,
        maxHeight: 600,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 16,
        backgroundColor: '#4f4f4f',
    },
    roomsList: {
        flexGrow: 1,
        paddingBottom: 16,
        alignItems: "center"
    },
    heading: {
        fontFamily: "Quicksand-Regular",
        fontSize: 20,
        color: "#fff",
        textAlign: "center",
        marginBottom: 5
    },
    whiteLine: {
        backgroundColor: "#fff",
        width: "100%",
        height: 1,
        marginBottom: 20
    },
    // pending requests
    requestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        marginTop: 30,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    imageContainer: {
        marginRight: 15,
    },
    image: {
        height: 80,
        width: 80,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    roomText: {
        marginBottom: 5,
        textAlign: 'left',
        color: 'white',
    },
    timeText: {
        textAlign: 'left',
        color: 'white',
    },
    buttonsContainer: {
        marginTop: 13,
        marginLeft: 'auto',
        alignItems: 'center',
    },
    button: {
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        cursor: 'pointer',
        fontSize: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    allowButton: {
        backgroundColor: '#4CAF50',
    },
    denyButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: 'white',
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

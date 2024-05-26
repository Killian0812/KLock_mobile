import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, ScrollView } from 'react-native';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import debounce from 'lodash.debounce';

function SelectedRoom({ room, handleClick }) {
    return (
        <View style={{ marginLeft: 5, marginTop: 5, backgroundColor: '#898989', padding: 10, borderRadius: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text>{room.name}</Text>
                <TouchableOpacity onPress={() => handleClick()}
                    style={{ marginLeft: 10, borderWidth: 1, borderColor: 'black', borderRadius: 3 }}>
                    <Entypo name='cross' size={20} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

function RoomRegisterTab() {

    const searchRef = useRef();
    const [keyword, setKeyword] = useState('');
    const [rooms, setRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (searchRef.current !== undefined)
            searchRef.current.focus();
    }, [])

    const handleSearching = debounce((e) => {
        setKeyword(e);
    }, 300);

    useEffect(() => {
        if (!keyword.trim()) {
            setRooms([]);
            return;
        }
        axiosPrivate.get('/api/home/findRooms/', {
            params: {
                keyword: keyword
            }
        }).then(response => {
            setRooms(response.data);
        }).catch(error => {
            console.error('Error fetching rooms:', error);
        });
    }, [keyword, axiosPrivate]);

    const handleAddRoom = (room) => {
        setSelectedRooms(prevRooms => prevRooms.some(currentRoom => currentRoom._id === room._id) ? prevRooms : [...prevRooms, room])
    }

    const handleRemoveRoom = (room) => {
        setSelectedRooms(prevRooms => prevRooms.filter(currentRoom => currentRoom._id !== room._id));
    }

    const handleSubmit = () => {
        Alert.alert(
            'Are you absolutely sure?',
            'You may want to contact Administrator for confirmation and approval to register as room manager.',
            [
                {
                    text: 'Yes, confirm action',
                    onPress: () => {
                        axiosPrivate.post(`/api/home/roomRegister`, selectedRooms)
                            .then(() => {
                                alert('Request sent to Admin');
                                setSelectedRooms([]);
                            })
                            .catch((err) => {
                                alert('Unexpected error');
                                console.log("Error registering as manager:", err);
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

    return (
        <View style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{
                        width: 40, backgroundColor: "#434343", borderTopLeftRadius: 5,
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <EvilIcons name='search' style={{ color: 'white' }} size={34} />
                    </View>
                    <TextInput
                        style={{
                            flex: 1, fontSize: 16,
                            padding: 10, backgroundColor: "#434343", color: "#fff"
                        }}
                        ref={searchRef}
                        onChangeText={(text) => handleSearching(text)}
                        placeholder='Search for room'
                    />
                </View>
                <View style={{ backgroundColor: "#494949", marginTop: 4, color: "#fff", height: 150 }}>
                    <ScrollView
                        contentContainerStyle={{
                            display: 'flex', flexDirection: 'column',
                        }}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                        scrollEventThrottle={16}
                    >

                        {rooms.map((room) => (
                            <TouchableOpacity
                                key={room._id}
                                style={{ padding: 10, borderBottomColor: '#404040', borderBottomWidth: 1 }}
                                onPress={() => handleAddRoom(room)}
                            >
                                <Text style={{ fontSize: 16, textAlign: 'center' }} >{room.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: 'black', paddingTop: 10 }}>
                    <Text style={{ fontSize: 16 }} >Selected rooms:</Text>
                    <View style={{ marginTop: 20, marginLeft: 24, flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            selectedRooms.map((selectedRoom) => (
                                <SelectedRoom
                                    room={selectedRoom}
                                    key={selectedRoom._id}
                                    handleClick={() => handleRemoveRoom(selectedRoom)}
                                />
                            ))
                        }
                    </View>
                    {
                        selectedRooms.length > 0 && (
                            <View style={{
                                backgroundColor: '#898989', alignSelf: 'center', borderRadius: 5, marginTop: 20, padding: 5
                            }}>
                                <Button title="Submit" color="#000000" onPress={handleSubmit} />
                            </View>
                        )
                    }
                </View>
            </View>
        </View>
    );
}

export default RoomRegisterTab;

import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { useState } from 'react';

import ProfileTab from './tabs/Profile.tab';
import ChangePasswordTab from './tabs/ChangePassword.tab';

export default function ProfileScreen({ navigation }) {

    const [activeTab, setActiveTab] = useState("profileTab"); // profile tab by default

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <View style={styles.layout}>
            <View style={{ alignItems: 'center', position: 'absolute', top: 30 }}>
                <Image source={require('../assets/default_avatar.jpg')} style={{ width: 150, height: 150, borderRadius: 125 }} />
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <TouchableOpacity onPress={() => handleTabChange("profileTab")}
                        style={[styles.tabButton, activeTab === "profileTab" && styles.activeTab]}>
                        <Text style={{ fontSize: 14, color: activeTab === "profileTab" ? "#fff" : "#000" }}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabChange("roomRegisterTab")}
                        style={[styles.tabButton, activeTab === "roomRegisterTab" && styles.activeTab]}>
                        <Text style={{ fontSize: 14, color: activeTab === "roomRegisterTab" ? "#fff" : "#000" }}>Register as Room Manager</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabChange("changePasswordTab")}
                        style={[styles.tabButton, activeTab === "changePasswordTab" && styles.activeTab]}>
                        <Text style={{ fontSize: 14, color: activeTab === "changePasswordTab" ? "#fff" : "#000" }}>Change Password</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tabContent}>
                    {activeTab === "profileTab" && <ProfileTab navigation={navigation}></ProfileTab>}
                    {/* {activeTab === "roomRegisterTab" && <RoomRegisterTab />} */}
                    {activeTab === "changePasswordTab" && <ChangePasswordTab />}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    layout: {
        flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "grey"
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#3d3d3d',
        borderLeftWidth: 1
    },
    activeTab: {
        backgroundColor: '#4f4f4f',
    },
    tabContent: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#4f4f4f',
        width: screenWidth,
        height: screenHeight,
        padding: 30,
    },
});
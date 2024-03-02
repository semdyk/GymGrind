import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { getFirestore, doc, setDoc, where, collection, addDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';

import { handleCreateClennie } from '../classes/CreateHandler';

const ClenniePage = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [clennieName, setClennieName] = useState('');

    const [clennies, setClennies] = useState([]);

    const fetchData = async () => {
        try {
            const q = query(collection(db, 'clennies'));
            const querySnapshot = await getDocs(q);
            const clenniesPromise = querySnapshot.docs.map(async (doc) => {
                const clennieData = {
                    id: doc.id,
                    ...doc.data(),
                };

                // Assuming 'verkopen' documents have a 'clennieId' field for the relation
                const verkopenQuery = query(collection(db, 'verkopen'), where('clennieid', '==', doc.id));
                const verkopenSnapshot = await getDocs(verkopenQuery);
                const verkopen = verkopenSnapshot.docs.map(doc => doc.data());

                // Here, calculate or determine the 'poff' value based on 'verkopen'
                // For this example, let's just count the number of 'verkopen'
                const poff = verkopen.reduce((acc, curr) => acc + Number(curr.poff), 0);

                return {
                    ...clennieData,
                    poff, // Add the calculated 'poff' value
                };
            });

            // Wait for all promises to resolve since we're inside a map that returns promises
            const clennies = await Promise.all(clenniesPromise);

            setClennies(clennies);
        } catch (error) {
            console.error('Error fetching clennies:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // Function to handle creating a new clennie


    const handleHome = () => {
        navigation.navigate('Home'); // This will navigate to the previous screen in the stack
    };

    const handleVerkopen = () => {
        navigation.navigate('Verkopen'); // This will navigate to the previous screen in the stack
    };


    const handleClennie = (clennie) => {
        navigation.navigate('ClennieDetails', { clennie: clennie }); // This will navigate to the previous screen in the stack
    };

    const handleSettings = () => {
        navigation.navigate('Settings'); // This will navigate to the previous screen in the stack
    };

    const handleInkopen = () => {
        navigation.navigate('Inkopen'); // This will navigate to the previous screen in the stack
    };

    const handleCreate = async () => {
        await handleCreateClennie(clennieName)

        setModalVisible(false);
        // Reset the clennie name input
        setClennieName('');

        fetchData();
    };

    const [searchQuery, setSearchQuery] = useState('');

    // Filter users based on search query
    const filteredClennies = clennies.filter(clennie =>
        clennie.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    // You might have state variables and functions to handle the logic here
    return (
        <View style={styles.container}>
            <Text style={styles.header}>JunkieLijst</Text>
            <Text style={styles.subsubheader}>Clennies</Text>
            <TouchableOpacity onPress={handleSettings} style={styles.settingsbutton}>
                <FontAwesome name="cog" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.card} contentContainerStyle={{ paddingBottom: 30 }}>
                <Text style={styles.subheader}>Clennie Lijst</Text>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Zoeken..."
                    placeholderTextColor="#fff"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {/* Adjusted View for a custom layout with maximum of 2 rows */}
                <ScrollView style={{ height: "35%", marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        {filteredClennies.map((clennie, index) => ( // Adjusted to slice the first 10 users

                            <TouchableOpacity onPress={() => handleClennie(clennie)} key={index} style={[styles.userItem, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
                                <Text style={{ color: "white", fontWeight: "bold", flex: 1, marginLeft: 10 }}>{clennie.name}</Text>

                                {clennie.poff > 0 && <Ionicons name="alert-circle" color={clennie.poff >= 50 ? "red" : "orange"} size={24} style={{ marginRight: 10 }} />}


                            </TouchableOpacity>

                        ))}
                    </View>
                </ScrollView>
            </View>

            <View style={styles.card}>

                <Text style={styles.subheader}>Clennie Toevoegen</Text>
                <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.quickAction}>
                        <Text style={styles.quickText}>Voeg Clennie Toe</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.footerButton, { borderBottomColor: '#fff', borderBottomWidth: 4, borderRadius: 5 }]}>
                    <FontAwesome5 name="user-alt" size={24} color="white" />
                    <Text style={styles.footerText}>Clennies</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHome} style={[styles.footerButton]}>
                    <FontAwesome5 name="home" size={24} color="white" />
                    <Text style={[styles.footerText, {}]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleInkopen} style={styles.footerButton}>
                    <FontAwesome5 name="coins" size={24} color="white" />
                    <Text style={styles.footerText}>Inkopen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleVerkopen} style={styles.footerButton}>
                    <FontAwesome5 name="wallet" size={24} color="white" />
                    <Text style={styles.footerText}>Verkopen</Text>
                </TouchableOpacity>

            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Clennie Toevoegen</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Naam"
                            placeholderTextColor={"#bbbbbb"}
                            value={clennieName}
                            onChangeText={text => setClennieName(text)}
                        />
                        <TouchableOpacity onPress={() => handleCreate()} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Voeg Toe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#cd3131' }]}>
                            <Text style={styles.modalButtonText}>Annuleer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111518',
        paddingBottom: 50, // Adjust this value as needed to avoid overlap with the footer
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1C2227',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        width: '80%',
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center",
        color: '#fff',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        color: '#fff',
        backgroundColor: '#111518',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: '#12af3f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    settingsbutton: {
        position: 'absolute',
        top: 55, // Adjust the value as needed
        right: 20, // Adjust the value as needed
        zIndex: 10, // Make sure the button is clickable by setting zIndex
    },
    card: {
        backgroundColor: '#1C2227',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        width: '90%', // Adjust the width as per your design
        alignSelf: 'center',
    },
    subsubheader: {
        color: '#fff',
        fontSize: 20,
        marginTop: -20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 10,
        textAlign: 'center',
    },
    quickAction: {
        backgroundColor: '#111518',
        width: "100%",
        height: 50,
        borderRadius: 20,
        marginVertical: 4,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    quickText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    searchInput: {
        // Add styles for the search input
        height: 40,
        backgroundColor: '#111518',
        borderRadius: 20,
        borderColor: 'white',
        borderWidth: 1,
        color: "#fff",
        paddingLeft: 10,
    },
    userItem: {
        backgroundColor: '#111518',
        width: "48%",
        height: 50,
        borderRadius: 20,
        marginHorizontal: 2,
        marginVertical: 4,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    list: {
        // Styles for the list container if needed
    },
    header: {
        color: '#fff',
        fontSize: 24,
        marginTop: 50,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subheader: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    dataColumn: {
        alignItems: 'center',
    },
    label: {
        color: '#9a9a9d',
        fontSize: 18,
    },
    value: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    money: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    winLossRow: {
        alignItems: 'center',
        marginBottom: 20,
    },
    loss: {
        color: '#fff',
        fontSize: 18,
    },
    profitValue: {
        color: 'lightgreen',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    lossValue: {
        color: 'red',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },

    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 10,
        backgroundColor: '#1C2227',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
    },
    footerButton: {
        alignItems: 'center',
    },
    footerIcon: {
        color: '#fff',
        fontSize: 22, // Adjust size for actual icons
        marginBottom: 5,
    },
    footerText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
    },
});

export default ClenniePage;
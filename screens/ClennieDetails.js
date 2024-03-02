import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { getFirestore, doc, setDoc, collection, updateDoc, addDoc, getDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';

import RNPickerSelect from 'react-native-picker-select';
import { handleClennieUpdate, handleCreateVerkoop, handleRemoveClennie } from '../classes/CreateHandler';

const ClennieDetails = ({ route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [product, setProduct] = useState("");
    const [hoeveel, setHoeveel] = useState("");
    const [verkoopprijs, setVerkoopPrijs] = useState("");
    const [inkoopprijs, setInkoopPrijs] = useState("");
    const [poff, setPoff] = useState("");

    const [clennieVerkopen, setClennieVerkopen] = useState("");
    const [clenniePoff, setClenniePoff] = useState("");
    const [clennieWinst, setClennieWinst] = useState("");

    const [huidigeDrugs, setHuidigeDrugs] = useState("3MMC");

    const [druggies, setDrugs] = useState([]);

    const [clennieName, setClennieName] = useState("");



    const navigation = useNavigation();
    const handleClennie = () => {
        navigation.navigate('Clennie'); // This will navigate to the previous screen in the stack
    };

    const handleHome = () => {
        navigation.navigate('Home'); // This will navigate to the previous screen in the stack
    };

    const handleInkopen = () => {
        navigation.navigate('Inkopen'); // This will navigate to the previous screen in the stack
    };

    const handleVerkopen = () => {
        navigation.navigate('Verkopen'); // This will navigate to the previous screen in the stack
    };


    const handleSettings = () => {
        navigation.navigate('Settings'); // This will navigate to the previous screen in the stack
    };



    const { clennie } = route.params;

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }


    const fetchData = async () => {
        try {
            // Initialize variables for clennieVerkopen and clenniePoff
            let clennieVerkopen = 0;
            let clenniePoff = 0;
            let clennieInkopen = 0;

            // Query the "verkopen" collection for the given clennieId
            const verkopenRef = collection(db, 'verkopen');

            const querySnapshot = await getDocs(verkopenRef);
            // Loop through each document in the "verkopen" collection
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Check if the verkopen document belongs to the clennie
                if (data.clennieid === clennie.id) {
                    // Increment clennieVerkopen by the sales amount
                    clennieVerkopen += data.verkoopprijs;

                    clennieInkopen += data.inkoopprijs;

                    // Increment clenniePoff by the profit amount
                    clenniePoff += data.poff;
                }
            });

            const q2 = query(collection(db, 'snoepsettings'));
            const querySnapshot2 = await getDocs(q2);
            const druggies = querySnapshot2.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Loop through each "verzoek" to check if it's paid

            setDrugs(druggies);

            setClennieName(clennie.name);
            // Calculate clenniewinst
            const clennieWinst = (clennieVerkopen - clennieInkopen);

            // Set the state values
            setClennieVerkopen(clennieVerkopen);
            setClenniePoff(clenniePoff);
            setClennieWinst(clennieWinst);

        } catch (error) {
            console.error('Error fetching clennie info:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerkoop = async () => {
        await handleCreateVerkoop(clennie, product, hoeveel, verkoopprijs, inkoopprijs, poff)

        setModalVisible(false);
        // Reset the clennie name input
        setHoeveel('');
        setVerkoopPrijs('');
        setInkoopPrijs('');
        setPoff('');

        fetchData();
    };

    const handleRemove = async () => {
        await handleRemoveClennie(clennie.id)
        navigation.navigate("Home")
    };

    const handleUpdate = async () => {
        await handleClennieUpdate(clennie.id, clennieName)

        setClennieName(clennieName);
        // Optional: You can navigate back to the home screen or perform any other action upon update.
        setModal2Visible(false)
    };


    // You might have state variables and functions to handle the logic here
    return (
        <View style={styles.container}>
            <Text style={styles.header}>JunkieLijst</Text>
            <Text style={styles.subsubheader}>Clennie Details</Text>
            <TouchableOpacity onPress={handleSettings} style={styles.settingsbutton}>
                <FontAwesome name="cog" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.subheader}>Details</Text>
                <View style={styles.dataRow}>
                    <View style={styles.dataColumn}>
                        <Text style={styles.label}>Naam</Text>
                        <Text style={styles.value}>{clennieName}</Text>
                    </View>
                </View>
                <View style={styles.dataRow}>
                    <View style={styles.dataColumn}>
                        <Text style={styles.label}>Verkopen</Text>
                        <Text style={styles.money}>€{clennieVerkopen}</Text>
                    </View>
                    <View style={styles.dataColumn}>
                        <Text style={styles.label}>Poff</Text>
                        <Text style={styles.money}>€{clenniePoff}</Text>
                    </View>
                </View>
                <View style={styles.winLossRow}>
                    <Text style={styles.loss}>Winst</Text>
                    <Text style={styles.profitValue}>€{clennieWinst}</Text>
                </View>
            </View>

            <View style={styles.card}>

                <Text style={styles.subheader}>Snelle Acties</Text>
                <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => setModal2Visible(true)} style={styles.quickAction}>
                        <Text style={styles.quickText}>Bewerk Clennie</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.quickAction}>
                        <Text style={styles.quickText}>Voeg Verkoop Toe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRemove()} style={[styles.quickAction, { marginTop: 20, backgroundColor: "#ee2424" }]}>
                        <Text style={styles.quickText}>Verwijder Clennie</Text>
                    </TouchableOpacity>

                </View>

            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleClennie} style={[styles.footerButton, { borderBottomColor: '#fff', borderBottomWidth: 4, borderRadius: 5 }]}>
                    <FontAwesome5 name="user-alt" size={24} color="white" />
                    <Text style={styles.footerText}>Clennies</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHome} style={styles.footerButton}>
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
                        <Text style={styles.modalHeader}>Verkoop Toevoegen</Text>
                        <View style={[styles.pickerContainer, {}]}>

                            <RNPickerSelect
                                onValueChange={(value) => setProduct(value)}
                                style={{
                                    ...styles.picker, // Assuming you have other styles here
                                    iconContainer: {
                                        top: '50%',
                                        right: 10,
                                        transform: [{ translateY: -10 }], // Adjust as needed
                                    },
                                    inputIOS: {
                                        color: 'white', // Sets text color for iOS
                                        paddingRight: 30, // to ensure the text is never behind the icon
                                    },
                                    inputAndroid: {
                                        color: 'white', // Sets text color for Android
                                        paddingRight: 30, // to ensure the text is never behind the icon
                                    },
                                    inputWeb: {
                                        color: 'white', // Sets text color for web
                                        paddingRight: 30, // to ensure the text is never behind the icon
                                    },
                                }} // Ensure this style is correctly defined in your StyleSheet
                                items={druggies.length > 0 ? druggies.map(drug => ({
                                    label: drug.product,
                                    value: drug.product
                                })) : []}
                                useNativeAndroidPickerStyle={false} // Disables the native Android style
                                Icon={() => {
                                    return <Ionicons name="chevron-down-outline" size={20} color="white" />;
                                }}
                                placeholder={{
                                    label: 'Selecteer Product...',
                                    value: null,
                                }}// Setting an empty object removes the default placeholder
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Hoeveel..."
                            placeholderTextColor={"#bbbbbb"}
                            value={hoeveel}
                            onChangeText={text => setHoeveel(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Verkoopprijs..."
                            placeholderTextColor={"#bbbbbb"}
                            value={verkoopprijs}
                            onChangeText={text => setVerkoopPrijs(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Inkoopprijs..."
                            placeholderTextColor={"#bbbbbb"}
                            value={inkoopprijs}
                            onChangeText={text => setInkoopPrijs(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Poff..."
                            placeholderTextColor={"#bbbbbb"}
                            value={poff}
                            onChangeText={text => setPoff(text)}
                        />
                        <TouchableOpacity onPress={handleVerkoop} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Voeg Toe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#cd3131' }]}>
                            <Text style={styles.modalButtonText}>Annuleer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal2Visible}
                onRequestClose={() => {
                    setModal2Visible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>Clennie Bewerken</Text>
                        <Text style={styles.label}>Naam</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Naam..."
                            placeholderTextColor={"#bbbbbb"}
                            value={clennieName}
                            onChangeText={text => setClennieName(text)}
                        />
                        <TouchableOpacity onPress={handleUpdate} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Bewerk</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModal2Visible(false)} style={[styles.modalButton, { backgroundColor: '#cd3131' }]}>
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
    settingsbutton: {
        position: 'absolute',
        top: 55, // Adjust the value as needed
        right: 20, // Adjust the value as needed
        zIndex: 10, // Make sure the button is clickable by setting zIndex
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
    pickerContainer: {
        height: 50, // Adjust height as needed
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        borderRadius: 5, // Rounded corners
        backgroundColor: '#111518', // Background color
        paddingHorizontal: 10, // Padding horizontal (might need to adjust or remove)
        justifyContent: 'center', // Centers the picker vertically
    },
    picker: {
        width: '100%', // Ensure the picker fills the container
        height: '100%', // Ensure the picker fills the container
        color: '#FFFFFF',
        backgroundColor: 'transparent', // Ensure the picker background is transparent
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
    subsubheader: {
        color: '#fff',
        fontSize: 20,
        marginTop: -20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 10,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#1C2227',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        width: '90%', // Adjust the width as per your design
        alignSelf: 'center',
    },
    quickAction: {
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
    quickText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
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

export default ClennieDetails;
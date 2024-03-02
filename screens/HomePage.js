import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import { getFirestore, doc, setDoc, collection, addDoc, getDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';

import RNPickerSelect from 'react-native-picker-select';

import { handleCreateClennie, handleCreateVerkoop } from '../classes/CreateHandler';

const HomePage = () => {
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [huidigeDrugs, setHuidigeDrugs] = useState("3MMC");

    const [druggies, setDrugs] = useState([]);

    const [clennies, setClennies] = useState([]);
    const [clennie, setClennie] = useState('');
    const [product, setProduct] = useState("");
    const [hoeveel, setHoeveel] = useState("");
    const [verkoopprijs, setVerkoopPrijs] = useState("");
    const [inkoopprijs, setInkoopPrijs] = useState("");
    const [poff, setPoff] = useState("");

    const [clennieName, setClennieName] = useState('');


    // variabelen
    const isFocused = useIsFocused();

    const [totaalClennies, setTotaalClennies] = useState(0);
    const [totaalWinst, setTotaalWinst] = useState(0);
    const [totaalClennieWinst, setTotaalClennieWinst] = useState(0);
    const [totaalVerkoop, setTotaalVerkoop] = useState(0);
    const [totaalPoff, setTotaalPoff] = useState(0);
    const [totaalInkoop, setTotaalInkoop] = useState(0);
    const [totaalClennieInkoop, setTotaalClennieInkoop] = useState(0);

    const fetchData = async () => {
        try {

            // Loop through each document in the "verkopen" collection
            const q = query(collection(db, 'verkopen'));
            const querySnapshot = await getDocs(q);
            const verkopenData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Calculate total sales
            const clverkopen = verkopenData.reduce((acc, curr) => acc + Number(curr.verkoopprijs), 0);
            const clinkopen = verkopenData.reduce((acc, curr) => acc + Number(curr.inkoopprijs), 0);
            const clpoff = verkopenData.reduce((acc, curr) => acc + Number(curr.poff), 0);

            // Calculate clenniewinst
            const clennieWinst = (clverkopen - clinkopen);

            // Set the state values
            setTotaalVerkoop(clverkopen);
            setTotaalPoff(clpoff);
            setTotaalClennieInkoop(clinkopen);

            setTotaalClennieWinst(clennieWinst)

            const q2 = query(collection(db, 'inkopen'));
            const querySnapshot2 = await getDocs(q2);
            const inkopenData = querySnapshot2.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const totaalink = inkopenData.reduce((acc, curr) => acc + Number(curr.prijs), 0);

            setTotaalInkoop(totaalink);

            const totwinst = (totaalVerkoop - totaalInkoop);

            setTotaalWinst(totwinst)

            console.log(totwinst)

            const q3 = query(collection(db, 'clennies'));
            const querySnapshot3 = await getDocs(q3);
            const clennieData = querySnapshot3.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setClennies(clennieData)

            const totaalcl = clennieData.length;

            setTotaalClennies(totaalcl);

            const q4 = query(collection(db, 'snoepsettings'));
            const querySnapshot4 = await getDocs(q4);
            const druggies = querySnapshot4.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Loop through each "verzoek" to check if it's paid

            setDrugs(druggies);

        } catch (error) {
            console.error('Error fetching clennie info:', error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);


    const handleClennie = () => {
        navigation.navigate('Clennie'); // This will navigate to the previous screen in the stack
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


    const handleCreate = async () => {
        await handleCreateClennie(clennieName)

        setModalVisible(false);
        // Reset the clennie name input
        setClennieName('');

        fetchData();
    };

    const handleVerkoop = async () => {
        navigation.navigate("Clennie")
        /*await handleCreateVerkoop(clennie, product, hoeveel, verkoopprijs, inkoopprijs, poff)

        setModalVisible(false);
        // Reset the clennie name input
        setHoeveel('');
        setVerkoopPrijs('');
        setInkoopPrijs('');
        setPoff('');

        fetchData();*/
    };

    const handleInkoop = async () => {
        navigation.navigate("Inkopen")
        /*await handleCreateVerkoop(clennie, product, hoeveel, verkoopprijs, inkoopprijs, poff)

        setModalVisible(false);
        // Reset the clennie name input
        setHoeveel('');
        setVerkoopPrijs('');
        setInkoopPrijs('');
        setPoff('');

        fetchData();*/
    };

    // You might have state variables and functions to handle the logic here
    return (
        <View style={styles.container}>
            <Text style={styles.header}>JunkieLijst</Text>
            <Text style={styles.subsubheader}>Home</Text>
            <TouchableOpacity onPress={handleSettings} style={styles.settingsbutton}>
                <FontAwesome name="cog" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.subheader}>Totaal</Text>
                <View style={styles.dataRow}>
                    <View style={styles.dataColumn}>
                        <Text style={styles.label}>Clennies</Text>
                        <Text style={styles.value}>{totaalClennies}</Text>
                    </View>
                    <View style={styles.dataColumn}>
                        <Text style={styles.label}>Poff</Text>
                        <Text style={styles.value}>€{totaalPoff}</Text>
                    </View>
                </View>
                <View style={styles.dataRow}>
                    <View style={styles.dataColumn}>
                        <Text style={styles.label}>Verkopen</Text>
                        <Text style={styles.money}>€{totaalVerkoop}</Text>
                    </View>
                    <View style={styles.dataColumn}>
                        <Text style={styles.label}>Inkopen</Text>
                        <Text style={styles.money}>€{totaalInkoop}</Text>
                    </View>
                </View>

                <View style={styles.winLossRow}>
                    <Text style={[styles.loss, { fontWeight: "bold" }]}>Clennie Winst / Winst</Text>
                    <Text style={styles.profitValue}>
                        <Text style={totaalClennieWinst < 0 ? styles.lossvalue : styles.profitValue}>
                            €{totaalClennieWinst.toString()}
                        </Text>
                        <Text> / </Text>
                        <Text style={totaalWinst < 0 ? styles.lossvalue : styles.profitValue}>
                            €{totaalWinst.toString()}
                        </Text>
                    </Text>
                </View>

            </View>

            <View style={styles.card}>

                <Text style={styles.subheader}>Snelle Acties</Text>
                <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.quickAction}>
                        <Text style={styles.quickText}>Voeg Clennie Toe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleVerkoop()} style={styles.quickAction}>
                        <Text style={styles.quickText}>Voeg Verkoop Toe</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleInkopen} style={styles.quickAction}>
                        <Text style={styles.quickText}>Voeg Inkoop Toe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <Text style={[styles.quickText, { textDecorationLine: 'line-through', }]}>Voeg Poff Toe</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleClennie} style={styles.footerButton}>
                    <FontAwesome5 name="user-alt" size={24} color="white" />
                    <Text style={styles.footerText}>Clennies</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerButton, { borderBottomColor: '#fff', borderBottomWidth: 4, borderRadius: 5 }]}>
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

    subsubheader: {
        color: '#fff',
        fontSize: 20,
        marginTop: -20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 10,
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
    lossvalue: {
        color: '#e43d3d',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
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

export default HomePage;
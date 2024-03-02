import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Switch, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { getFirestore, doc, setDoc, collection, deleteDoc, addDoc, getDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';

const SettingsPage = ({ }) => {
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

    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const [isEnabled2, setIsEnabled2] = useState(false);
    const toggleSwitch2 = () => setIsEnabled2(previousState => !previousState);

    const [poffLimiet, setPoffLimiet] = useState('');
    const [autoLock, setAutomaticLock] = useState('');

    const [drugs, setDrugs] = useState([]);

    const [inkooplijst, setInkoopLijst] = useState([]);

    const [drugName, setNewDrugName] = useState('');

    const [inkoopLijstText, setNewInkoopLijst] = useState('');

    const handleNewDrug = async () => {
        try {
            const docRef = await addDoc(collection(db, "snoepsettings"), {
                product: drugName,
                createdAt: new Date()
            });
            // Close the modal
            setModalVisible(false);
            // Reset the clennie name input
            setNewDrugName('');

            fetchData();
        } catch (error) {
            console.error('Error creating clennie:', error);

        }


    };

    const handleInkoopToevoegen = async () => {
        try {
            const docRef = await addDoc(collection(db, "inkooplijst"), {
                product: inkoopLijstText,
                createdAt: new Date()
            });
            // Close the modal
            setModal2Visible(false);
            // Reset the clennie name input
            setNewInkoopLijst('');

            fetchData();
        } catch (error) {
            console.error('Error creating clennie:', error);

        }


    };

    const removeProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'snoepsettings', id));
            fetchData();

        } catch (error) {
            console.error('Error removing idea:', error);
        }
    };

    const removeInkoopProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'inkooplijst', id));
            fetchData();

        } catch (error) {
            console.error('Error removing idea:', error);
        }
    };


    const fetchData = async () => {
        try {
            const q = query(collection(db, 'snoepsettings'));
            const querySnapshot = await getDocs(q);
            const druggies = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setDrugs(druggies);

            const q2 = query(collection(db, 'inkooplijst'));
            const query2Snapshot = await getDocs(q2);
            const inkooplijst = query2Snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Loop through each "verzoek" to check if it's paid

            setInkoopLijst(inkooplijst);
        } catch (error) {
            console.error('Error fetching clennies:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        fetchData();
    }, []);


    // You might have state variables and functions to handle the logic here
    return (
        <View style={styles.container}>
            <Text style={styles.header}>JunkieLijst</Text>
            <Text style={styles.subsubheader}>Instellingen</Text>
            <View style={styles.settingsbutton}>
                <FontAwesome name="cog" size={24} color="white" />
            </View>
            <View style={styles.card}>
                <Text style={styles.subheader}>Instellingen</Text>
                <View style={styles.settingItem}>
                    <Text style={styles.label}>Notificaties</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#767577" }}
                        thumbColor={isEnabled ? "lightgreen" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.label}>Automatisch Slot</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#767577" }}
                        thumbColor={isEnabled2 ? "lightgreen" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch2}
                        value={isEnabled2}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.label}>Poff Limiet</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPoffLimiet}
                        placeholderTextColor={"#fff"}
                        value={poffLimiet}
                        placeholder="0"
                        keyboardType="numeric" // This prop ensures only numeric keyboard is displayed
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.label}>Automatisch Slot Tijd</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setAutomaticLock}
                        placeholderTextColor={"#fff"}
                        value={autoLock}
                        placeholder="0"
                        keyboardType="numeric" // This prop ensures only numeric keyboard is displayed
                    />
                </View>
                <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.quickAction]}>
                        <Text style={styles.quickText}>Drugs Lijst</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModal2Visible(true)} style={[styles.quickAction]}>
                        <Text style={styles.quickText}>Inkoop Lijst</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.card}>

                <Text style={styles.subheader}>Database</Text>
                <View style={{ flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center' }}>
                    <TouchableOpacity style={[styles.quickAction, { backgroundColor: "#44b63a" }]}>
                        <Text style={styles.quickText}>Importeer Database</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.quickAction, { backgroundColor: "#ee2424" }]}>
                        <Text style={styles.quickText}>Exporteer Database</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleClennie} style={styles.footerButton}>
                    <FontAwesome5 name="user-alt" size={24} color="white" />
                    <Text style={styles.footerText}>Clennies</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHome} style={[styles.footerButton, { borderBottomColor: '#fff', borderBottomWidth: 4, borderRadius: 5 }]}>
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
                        <Text style={styles.modalHeader}>Drug Lijst</Text>
                        <View style={styles.modaltextCont}>

                            <ScrollView style={{ height: "80%", marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {console.log(drugs)}
                                    {drugs.map((drug, index) => ( // Adjusted to slice the first 10 users
                                        <TouchableOpacity key={index} style={[styles.userItem, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]} >
                                            <Text style={{ color: "white", fontWeight: "bold", flex: 1, marginLeft: 10 }}>{drug.product}</Text>
                                            <Ionicons onPress={() => removeProduct(drug.id)} name="trash" color="red" size={24} style={{ marginRight: 10 }} />

                                        </TouchableOpacity>

                                    ))}
                                </View>
                            </ScrollView>

                            <TextInput
                                style={[styles.input, { width: "70%", marginTop: 20 }]}
                                placeholder="Product"
                                placeholderTextColor={"#bbbbbb"}
                                value={drugName}
                                onChangeText={text => setNewDrugName(text)}
                            />
                        </View>


                        <TouchableOpacity onPress={handleNewDrug} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Voeg Toe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#cd3131' }]}>
                            <Text style={styles.modalButtonText}>Annuleer</Text>
                        </TouchableOpacity>
                    </View>
                </View >
            </Modal >

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
                        <Text style={styles.modalHeader}>Inkopen Lijst</Text>
                        <View style={styles.modaltextCont}>

                            <ScrollView style={{ height: "80%", marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    {inkooplijst.map((inkoop, index) => ( // Adjusted to slice the first 10 users

                                        <TouchableOpacity key={index} style={[styles.userItem, { width: "88%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
                                            <Text style={{ color: "white", fontWeight: "bold", flex: 1, marginLeft: 10 }}>{inkoop.product}</Text>
                                            <Ionicons onPress={() => removeInkoopProduct(inkoop.id)} name="trash" color="red" size={24} style={{ marginRight: 10 }} />

                                        </TouchableOpacity>

                                    ))}
                                </View>
                            </ScrollView>

                            <TextInput
                                style={[styles.input, { width: "70%", marginTop: 20 }]}
                                placeholder="Product"
                                placeholderTextColor={"#bbbbbb"}
                                value={inkoopLijstText}
                                onChangeText={text => setNewInkoopLijst(text)}
                            />
                        </View>


                        <TouchableOpacity onPress={handleInkoopToevoegen} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Voeg Toe</Text>
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
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
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
    modalContainer: {
        flex: 1,
        height: "50%",
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1C2227',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        height: "60%",
        width: '80%',
    },
    modaltextCont: {
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between', // Pushes children to start and end
        flex: 1,
        width: '100%', // Ensure it takes the full width of its parent
        height: "30%",
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
    subsubheader: {
        color: '#fff',
        fontSize: 20,
        marginTop: -20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: "center",
        textAlign: "center",
        padding: 10,
        color: "#fff",
        borderRadius: 5,
        width: '30%', // Adjust as needed
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

export default SettingsPage;
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import RNPickerSelect from 'react-native-picker-select';

import { Picker } from '@react-native-picker/picker';

import TableHandler from '../classes/TableHandler';

import { getFirestore, doc, setDoc, collection, addDoc, getDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';

import { handleCreateInkoop } from '../classes/CreateHandler';




const InkopenPage = () => {
    const navigation = useNavigation();


    // variabelen

    const [totaalVerkoop, setTotaalVerkoop] = useState(0);
    const [totaalInkoop, setTotaalInkoop] = useState(0);

    const [verkopen, setVerkopen] = useState([]);
    const [inkopen, setInkopen] = useState([]);

    const [inkooplijst, setInkoopLijst] = useState([]);

    const [huidigeDrugs, setHuidigeDrugs] = useState("3MMC");
    const [inkoper, setInkoper] = useState("");

    const [jaar, setJaar] = useState("2024");

    const [modalVisible, setModalVisible] = useState(false);
    const [clennieName, setClennieName] = useState('');

    const [product, setProduct] = useState("");
    const [hoeveel, setHoeveel] = useState("");
    const [inkoopprijs, setInkoopPrijs] = useState("");
    const [poff, setPoff] = useState("");

    const [druggies, setDrugs] = useState([]);



    const filteredInkopen = inkopen.filter(inkoop => {
        // Assuming createdAt is a Firestore timestamp; convert to JavaScript Date object
        const inkoopJaar = inkoop.createdAt.toDate().getFullYear();

        // Check if the product matches and the year is the desired year
        return inkoop.product.toLowerCase().includes(huidigeDrugs.toLowerCase()) && inkoopJaar === parseInt(jaar);
    });

    const fetchData = async (drug, huidigeJaar) => {
        try {
            // Fetch verkopen data
            const q = query(collection(db, 'inkopen'));
            const querySnapshot = await getDocs(q);
            const inkopenData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setInkopen(inkopenData);

            // Calculate total sales
            const filteredInkopenForDrugs = inkopenData.filter(inkoop => {
                // Assuming createdAt is a Firestore timestamp; convert to JavaScript Date object
                const verkoopJaar = inkoop.createdAt.toDate().getFullYear();
                console.log(inkoop.product.toLowerCase().includes(huidigeDrugs.toLowerCase()))
                // Check if the product matches and the year is the desired year
                return inkoop.product.toLowerCase().includes(drug.toLowerCase()) && verkoopJaar === parseInt(huidigeJaar);
            });
            const totalSalesForHuidigeDrugs = filteredInkopenForDrugs.reduce((acc, curr) => acc + Number(curr.prijs), 0);
            setTotaalVerkoop(totalSalesForHuidigeDrugs);

            const q2 = query(collection(db, 'snoepsettings'));
            const querySnapshot2 = await getDocs(q2);
            const druggies = querySnapshot2.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Loop through each "verzoek" to check if it's paid

            setDrugs(druggies);

            const q3 = query(collection(db, 'inkooplijst'));
            const querySnapshot3 = await getDocs(q3);
            const inkoopding = querySnapshot3.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Loop through each "verzoek" to check if it's paid

            setInkoopLijst(inkoopding);

        } catch (error) {
            console.error('Error fetching clennie info:', error);
        }
    };


    useEffect(() => {
        fetchData(huidigeDrugs, jaar);
    }, [huidigeDrugs, jaar]);

    const handleClennie = () => {
        navigation.navigate('Clennie'); // This will navigate to the previous screen in the stack
    };

    const handleHome = () => {
        navigation.navigate('Home'); // This will navigate to the previous screen in the stack
    };

    const handleVerkopen = () => {
        navigation.navigate('Verkopen'); // This will navigate to the previous screen in the stack
    };

    const handleSettings = () => {
        navigation.navigate('Settings'); // This will navigate to the previous screen in the stack
    };

    const handleInkoopToevoegen = async () => {
        await handleCreateInkoop(inkoper, product, hoeveel, inkoopprijs)

        setModalVisible(false);
        // Reset the clennie name input

        fetchData(huidigeDrugs, jaar);
    };

    // You might have state variables and functions to handle the logic here
    return (
        <View style={styles.container}>
            <Text style={styles.header}>JunkieLijst</Text>
            <Text style={styles.subsubheader}>Inkopen</Text>
            <TouchableOpacity onPress={handleSettings} style={styles.settingsbutton}>
                <FontAwesome name="cog" size={24} color="white" />
            </TouchableOpacity>

            <View style={{ flexDirection: "row" }}>
                <View style={[styles.pickerContainer, {}]}>
                    <RNPickerSelect
                        onValueChange={(value) => setHuidigeDrugs(value)}
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
                        value={huidigeDrugs} // This should match one of the item's value exactly
                        items={druggies.length > 0 ? druggies.map(drug => ({
                            label: drug.product,
                            value: drug.product
                        })) : []}
                        useNativeAndroidPickerStyle={false} // Disables the native Android style
                        Icon={() => {
                            return <Ionicons name="chevron-down-outline" size={20} color="white" />;
                        }}
                        placeholder={{}} // Setting an empty object removes the default placeholder
                    />
                </View>
                <View style={[styles.pickerContainer, { marginLeft: 30, }]}>
                    <RNPickerSelect
                        onValueChange={(value) => setJaar(value)}
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
                        value={jaar} // This should match one of the item's value exactly
                        items={[
                            { label: '2022', value: '2022' },
                            { label: '2023', value: '2023' },
                            { label: '2024', value: '2024' },
                        ]}
                        useNativeAndroidPickerStyle={false} // Disables the native Android style
                        Icon={() => {
                            return <Ionicons name="chevron-down-outline" size={20} color="white" />;
                        }}
                        placeholder={{}} // Setting an empty object removes the default placeholder
                    />
                </View>
            </View>



            <View style={[styles.card, { height: "65%" }]}>
                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>

                        <Text style={styles.subheader}>Inkoop {huidigeDrugs}</Text>

                        <Text style={styles.subheader}>€{totaalVerkoop}</Text>
                        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", alignItems: 'center' }}>
                            {filteredInkopen.length > 0 && filteredInkopen.map((inkoop) => (
                                <TouchableOpacity
                                    key={inkoop.id}
                                    style={[styles.clennieItem, { width: "48%", flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }]}
                                >
                                    <Text style={[styles.quickText, { marginLeft: 10 }]}>{inkoop.clennieName}</Text>
                                    <Text style={[styles.quickText, { marginRight: 10 }]}>€{inkoop.prijs}</Text>
                                </TouchableOpacity>
                            ))}

                        </View>

                    </View>

                </View>




            </View>
            <View style={styles.addInkopenCont}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addInkopen}>
                    <FontAwesome name="plus" size={24} color="white" />
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
                        <Text style={styles.modalHeader}>Inkoop Toevoegen</Text>
                        <View style={[styles.pickerContainer2, {}]}>

                            <RNPickerSelect
                                onValueChange={(value) => setInkoper(value)}
                                style={{
                                    ...styles.picker2, // Assuming you have other styles here
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
                                items={inkooplijst.length > 0 ? inkooplijst.map(inkooplijst => ({
                                    label: inkooplijst.product,
                                    value: inkooplijst.product
                                })) : []}
                                useNativeAndroidPickerStyle={false} // Disables the native Android style
                                Icon={() => {
                                    return <Ionicons name="chevron-down-outline" size={20} color="white" />;
                                }}
                                placeholder={{
                                    label: 'Selecteer Inkoper...',
                                    value: null,
                                }}// Setting an empty object removes the default placeholder
                            />
                        </View>
                        <View style={[styles.pickerContainer2, {}]}>

                            <RNPickerSelect
                                onValueChange={(value) => setProduct(value)}
                                style={{
                                    ...styles.picker2, // Assuming you have other styles here
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
                            placeholder="Inkoopprijs..."
                            placeholderTextColor={"#bbbbbb"}
                            value={inkoopprijs}
                            onChangeText={text => setInkoopPrijs(text)}
                        />
                        <TouchableOpacity onPress={() => handleInkoopToevoegen()} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Voeg Toe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.modalButton, { backgroundColor: '#cd3131' }]}>
                            <Text style={styles.modalButtonText}>Annuleer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <View style={styles.footer}>
                <TouchableOpacity onPress={handleClennie} style={styles.footerButton}>
                    <FontAwesome5 name="user-alt" size={24} color="white" />
                    <Text style={styles.footerText}>Clennies</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHome} style={styles.footerButton}>
                    <FontAwesome5 name="home" size={24} color="white" />
                    <Text style={[styles.footerText, {}]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerButton, { borderBottomColor: '#fff', borderBottomWidth: 4, borderRadius: 5 }]}>
                    <FontAwesome5 name="coins" size={24} color="white" />
                    <Text style={styles.footerText}>Inkopen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleVerkopen} style={[styles.footerButton]}>
                    <FontAwesome5 name="wallet" size={24} color="white" />
                    <Text style={styles.footerText}>Verkopen</Text>
                </TouchableOpacity>
            </View>
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
    addInkopenCont: {
        borderRadius: 20, // Rounded corners for the container
        padding: 10, // Add some padding to create space around the TouchableOpacity
        position: 'absolute',
        bottom: 140, // Adjust the value as needed
        right: 30, // Adjust the value as needed
        zIndex: 10, // Ensure the container and its child are clickable
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
    addInkopen: {
        alignItems: 'center', // Center the icon inside the TouchableOpacity
        justifyContent: 'center', // Center the icon vertically
        height: 50, // Specify height for the TouchableOpacity
        width: 50, // Specify width for the TouchableOpacity
        borderRadius: 25, // Make it a circle: half of height or width
        backgroundColor: '#111518', // Different background color for the button to stand out
    },

    yearpicker: {
        backgroundColor: '#111518',
        color: "#fff",
        borderRadius: 20,
        width: "50%",
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    tab: {
        height: 30,
        paddingHorizontal: 16,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    selectedTab: {
        borderBottomColor: '#4e8df5',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    clennieItem: {
        backgroundColor: '#111518',
        height: 50,
        width: 130,
        borderRadius: 20,

        marginVertical: 4,
        justifyContent: "center"
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
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subheader: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    pickerContainer: {
        width: '40%', // Adjust width as needed
        height: 40, // Adjust height as needed
        borderWidth: 1,
        borderColor: '#ccc',
        marginLeft: 20,
        marginBottom: 10,
        borderRadius: 10, // Rounded corners
        backgroundColor: '#1C2227', // Background color
        paddingHorizontal: 10, // Padding horizontal (might need to adjust or remove)
        justifyContent: 'center', // Centers the picker vertically
    },
    picker: {
        width: '100%', // Ensure the picker fills the container
        height: '100%', // Ensure the picker fills the container
        color: '#FFFFFF',
        backgroundColor: 'transparent', // Ensure the picker background is transparent
    },
    pickerContainer2: {
        height: 50, // Adjust height as needed
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        borderRadius: 5, // Rounded corners
        backgroundColor: '#111518', // Background color
        paddingHorizontal: 10, // Padding horizontal (might need to adjust or remove)
        justifyContent: 'center', // Centers the picker vertically
    },
    picker2: {
        width: '100%', // Ensure the picker fills the container
        height: '100%', // Ensure the picker fills the container
        color: '#FFFFFF',
        backgroundColor: 'transparent', // Ensure the picker background is transparent
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

export default InkopenPage;
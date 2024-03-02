import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import RNPickerSelect from 'react-native-picker-select';

import { Picker } from '@react-native-picker/picker';

import TableHandler from '../classes/TableHandler';

import { getFirestore, doc, setDoc, collection, addDoc, getDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';

const VerkopenPage = () => {
    const navigation = useNavigation();


    // variabelen

    const [totaalVerkoop, setTotaalVerkoop] = useState(0);
    const [totaalInkoop, setTotaalInkoop] = useState(0);

    const [verkopen, setVerkopen] = useState([]);
    const [inkopen, setInkopen] = useState([]);

    const [huidigeDrugs, setHuidigeDrugs] = useState("3MMC");

    const [druggies, setDrugs] = useState([]);

    const [jaar, setJaar] = useState("2024");


    const filteredVerkopen = verkopen.filter(verkoop => {
        // Assuming createdAt is a Firestore timestamp; convert to JavaScript Date object
        const verkoopJaar = verkoop.createdAt.toDate().getFullYear();

        // Check if the product matches and the year is the desired year
        return verkoop.product.toLowerCase().includes(huidigeDrugs.toLowerCase()) && verkoopJaar === parseInt(jaar);
    });

    const fetchData = async (drugs, huidigeJaar) => {
        try {
            // Fetch verkopen data
            const q = query(collection(db, 'verkopen'));
            const querySnapshot = await getDocs(q);
            const verkopenData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setVerkopen(verkopenData);

            // Calculate total sales
            const filteredVerkopenForDrugs = verkopenData.filter(verkoop => {
                // Assuming createdAt is a Firestore timestamp; convert to JavaScript Date object
                const verkoopJaar = verkoop.createdAt.toDate().getFullYear();

                // Check if the product matches and the year is the desired year
                return verkoop.product.toLowerCase().includes(huidigeDrugs.toLowerCase()) && verkoopJaar === parseInt(huidigeJaar);
            });

            const totalSalesForHuidigeDrugs = filteredVerkopenForDrugs.reduce((acc, curr) => acc + Number(curr.verkoopprijs), 0);
            setTotaalVerkoop(totalSalesForHuidigeDrugs);

            // Fetch inkopen data
            const q2 = query(collection(db, 'inkopen'));
            const querySnapshot2 = await getDocs(q2);
            const inkopenData = querySnapshot2.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setInkopen(inkopenData);

            // Calculate total purchases
            const totalPurchases = inkopenData.reduce((acc, curr) => acc + Number(curr.prijs), 0);
            setTotaalInkoop(totalPurchases);

            const q3 = query(collection(db, 'snoepsettings'));
            const querySnapshot3 = await getDocs(q3);
            const druggies = querySnapshot3.docs.map(doc => ({
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
        fetchData(huidigeDrugs, jaar);
    }, [huidigeDrugs, jaar]);

    const handleClennie = () => {
        navigation.navigate('Clennie'); // This will navigate to the previous screen in the stack
    };

    const handleInkopen = () => {
        navigation.navigate('Inkopen'); // This will navigate to the previous screen in the stack
    };

    const handleHome = () => {
        navigation.navigate('Home'); // This will navigate to the previous screen in the stack
    };

    const handleSettings = () => {
        navigation.navigate('Settings'); // This will navigate to the previous screen in the stack
    };


    // You might have state variables and functions to handle the logic here
    return (
        <View style={styles.container}>
            <Text style={styles.header}>JunkieLijst</Text>
            <Text style={styles.subsubheader}>Verkopen</Text>
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

                        <Text style={styles.subheader}>Verkoop {huidigeDrugs}</Text>

                        <Text style={styles.subheader}>€{totaalVerkoop}</Text>
                        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", alignItems: 'center' }}>
                            {filteredVerkopen.length > 0 && filteredVerkopen.map((verkoop) => (
                                <TouchableOpacity
                                    key={verkoop.id}
                                    style={[styles.clennieItem, { flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }]}
                                >
                                    <Text style={[styles.quickText, { marginLeft: 10 }]}>{verkoop.clennieName}</Text>
                                    <Text style={[styles.quickText, { marginRight: 10 }]}>€{verkoop.verkoopprijs}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>

                    {/*}<View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={styles.subheader}>Inkoop</Text>
                        <Text style={styles.subheader}>€{totaalInkoop}</Text>
                        {inkopen.length > 0 && inkopen.map((inkoop) => (
                            <TouchableOpacity
                                key={inkoop.id}
                                style={[styles.clennieItem, { flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }]}
                            >
                                <Text style={[styles.quickText, { marginLeft: 10 }]}>{inkoop.clennieName}</Text>
                                <Text style={[styles.quickText, { marginRight: 10 }]}>€{inkoop.prijs}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                        {*/}

                </View>




            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleClennie} style={styles.footerButton}>
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
                <TouchableOpacity style={[styles.footerButton, { borderBottomColor: '#fff', borderBottomWidth: 4, borderRadius: 5 }]}>
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
        width: "48%",
        borderRadius: 20,
        marginLeft: 2,
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

export default VerkopenPage;
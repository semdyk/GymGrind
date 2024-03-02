import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomBar = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleSocial = () => {
        navigation.navigate('Social'); // This will navigate to the previous screen in the stack
    };

    const handleWorkout = () => {
        navigation.navigate('Workout'); // This will navigate to the previous screen in the stack
    };

    const handleSearch = () => {
        navigation.navigate('Search'); // This will navigate to the previous screen in the stack
    };


    return (
        <View style={[styles.footer, { paddingVertical: insets.bottom > 0 ? 20 : 10 }]}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSearch()}
                style={styles.footerButton}>
                <FontAwesome5 name="search" size={24} color="white" />
                <Text style={styles.footerText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleWorkout()}
                style={styles.footerBigButton}>
                <FontAwesome5 name="dumbbell" size={24} color="white" />
                <Text style={styles.footerText}>Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleSocial()}
                style={styles.footerButton}>
                <FontAwesome5 name="trophy" size={24} color="white" />
                <Text style={styles.footerText}>Social</Text>
            </TouchableOpacity>
        </View>
    );
};

const deviceWidth = Dimensions.get('window').width;
const tabBarHeight = 50;
const bigButtonSize = tabBarHeight * 1.4;

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#323232',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center', // This will vertically center the buttons in the footer


        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    footerButton: {
        flex: 1, // Add this line
        alignItems: 'center',
        justifyContent: 'center',
        height: tabBarHeight,
        width: deviceWidth / 3, // Divide the device width by the number of tabs
    },
    footerBigButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -(bigButtonSize) / 2.5,
        height: bigButtonSize,
        width: bigButtonSize,
        borderRadius: bigButtonSize / 2,
        backgroundColor: "#161616",
        borderWidth: 0.1,
        borderColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    footerText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 12, // Reduced size for better fit
    },
});

export default BottomBar;

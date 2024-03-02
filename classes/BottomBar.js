import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomBar = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleSocial = () => {
        navigation.navigate('Test'); // This will navigate to the previous screen in the stack
    };

    const handleWorkout = () => {
        navigation.navigate('Workout'); // This will navigate to the previous screen in the stack
    };

    const handleWorkoutList = () => {
        navigation.navigate('Workouts'); // This will navigate to the previous screen in the stack
    };


    return (
        <View style={styles.bottomBar}>
            <TouchableOpacity onPress={() => handleWorkoutList()} style={styles.bottomBarButton}>
                <Ionicons name="barbell" size={24} color="#fff" />
                <Text style={styles.statLabel}>Workouts</Text>
            </TouchableOpacity>

            {/* This button will float above the bar */}
            <TouchableOpacity onPress={() => handleWorkout()} style={styles.addButton}>
                <Ionicons name="add-circle" size={48} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSocial()} style={styles.bottomBarButton}>
                <Ionicons name="trophy" size={24} color="#fff" />
                <Text style={styles.statLabel}>Social</Text>
            </TouchableOpacity>
        </View>
    );
};

const deviceWidth = Dimensions.get('window').width;
const tabBarHeight = 50;
const bigButtonSize = tabBarHeight * 1.4;

const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        bottom: 20, // Raise the bar above the bottom of the screen
        left: 10, // Add some left margin
        right: 10, // Add some right margin
        backgroundColor: '#2c2c2e',
        flexDirection: 'row',
        justifyContent: 'space-between', // Changed to 'space-between' to ensure equal spacing

        paddingVertical: 10,
        borderRadius: 30, // Increase border radius for a more rounded look
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10, // For Android shadow effect
        alignItems: 'center', // Center items vertically
    },
    bottomBarButton: {
        flex: 1, // Each button will take equal space
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButton: {
        marginBottom: 1, // Adjust accordingly to your design
    },
    statLabel: {
        color: '#fff',
        fontSize: 14,
        textAlign: "center",
        fontWeight: "bold",
    },
});

export default BottomBar;

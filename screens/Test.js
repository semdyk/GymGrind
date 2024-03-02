import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const Test = () => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                    <Text style={styles.nameText}>Foyez Ahmed K.</Text>
                    <TextInput style={styles.searchBar} placeholder="Search" placeholderTextColor="#999" />
                </View>

                {/* Stats cards */}
                <View style={styles.statsContainer}>
                    {/* Repeat this block for each stat card */}
                    <LinearGradient
                        colors={['#e94a3f3e', '#e234276f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statCard}
                    >
                        <View style={styles.statContent}>
                            <FontAwesome5 name="walking" size={24} color="#fff" />
                            <Text style={styles.statNumber}>280</Text>
                            <Text style={styles.statLabel}>Steps</Text>
                        </View>
                    </LinearGradient>
                    {/* ... other stat cards */}
                </View>

                {/* Programs section */}
                <View style={styles.programsSection}>
                    <View style={styles.programsHeader}>
                        <Text style={styles.programsTitle}>Programs</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeMoreText}>See More</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Program cards */}
                    <View style={styles.programCardContainer}>
                        {/* Repeat this block for each program */}
                        <View style={styles.programCard}>
                            <Image source={require('../assets/gymgrindtransparant.png')} style={styles.programImage} />
                            <View style={styles.programInfo}>
                                <Text style={styles.programTitle}>Arms</Text>
                                <Text style={styles.programRating}>4.4 ★</Text>
                            </View>
                        </View>
                        {/* ... other programs */}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom navigation bar */}

        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    scrollView: {
        marginBottom: 60, // Height of the bottom bar
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    welcomeText: {
        color: '#fff',
        fontSize: 14,
    },
    nameText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    searchBar: {
        width: '90%',
        backgroundColor: '#262626',
        borderRadius: 20,
        padding: 12,
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    statCard: {
        width: '30%',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statContent: {
        alignItems: 'center',
    },
    statNumber: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statLabel: {
        color: '#fff',
        fontSize: 14,
        marginTop: 4,
    },
    programsSection: {
        marginTop: 20,
    },
    programsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    programsTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeMoreText: {
        color: '#f54e4e',
        fontSize: 14,
    },
    programCardContainer: {
        paddingHorizontal: 20,
    },
    programCard: {
        backgroundColor: '#333',
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
    },
    programImage: {
        width: '100%',
        height: 100,
    },
    programInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    programTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    programRating: {
        color: '#fff',
        fontSize: 16,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 20, // Raise the bar above the bottom of the screen
        left: 10, // Add some left margin
        right: 10, // Add some right margin
        backgroundColor: '#2c2c2e',
        flexDirection: 'row',
        justifyContent: 'space-around',
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButton: {
        marginBottom: 30, // Adjust accordingly to your design
    },
    // ... additional styles if needed
});

export default Test;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const TableHandler = ({ data }) => {
    const tableHead = ['Item', 'Price', 'Date', 'Test', 'Date2'];
    const tableData = data.map(purchase => [purchase.item, purchase.price, purchase.date, purchase.test, purchase.date2]);

    return (
        <View style={styles.container}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                <Rows style={{ backgroundColor: "#fff" }} data={tableData} textStyle={styles.text} />
            </Table>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 }
});

export default TableHandler;

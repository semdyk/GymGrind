import React from 'react';
import { getFirestore, doc, setDoc, where, updateDoc, collection, deleteDoc, addDoc, docs, getDocs, query } from "firebase/firestore";
import { db } from '../firebase';

const handleCreateClennie = async (clennieName) => {
    try {
        const docRef = await addDoc(collection(db, "clennies"), {
            name: clennieName,
            createdAt: new Date()
        });
        // Close the modal

    } catch (error) {
        console.error('Error creating clennie:', error);

    }
};

const handleRemoveClennie = async (clennieid) => {
    try {
        await deleteDoc(doc(db, 'clennies', clennieid));
    } catch (error) {
        console.error('Error removing idea:', error);
    }
};

const handleClennieUpdate = async (clennieid, clennieName) => {

    try {
        console.log(clennieid)
        const clenref = doc(db, 'clennies', clennieid);
        await updateDoc(clenref, {
            name: clennieName,
        });

    } catch (error) {
        console.error('Error updating clennie:', error);
    }
};

// Function to handle creating a new clennie
const handleCreateVerkoop = async (clennie, product, hoeveel, verkoopprijs, inkoopprijs, poff) => {
    try {
        console.log(product)

        const docRef = await addDoc(collection(db, "verkopen"), {
            clennieid: clennie.id,
            clennieName: clennie.name,
            product: product,
            hoeveel: parseFloat(hoeveel),
            verkoopprijs: parseFloat(verkoopprijs),
            inkoopprijs: parseFloat(inkoopprijs),
            poff: parseFloat(poff),
            createdAt: new Date()
        });
        // Close the modal

    } catch (error) {
        console.error('Error creating clennie:', error);

    }


};

const handleCreateInkoop = async (name, product, hoeveel, prijs) => {
    try {
        console.log(name, product, hoeveel, prijs)

        const docRef = await addDoc(collection(db, "inkopen"), {
            clennieName: name,
            product: product,
            hoeveel: parseFloat(hoeveel),
            prijs: parseFloat(prijs),
            createdAt: new Date()
        });
        // Close the modal

    } catch (error) {
        console.error('Error creating clennie:', error);

    }


};

export { handleCreateClennie, handleRemoveClennie, handleCreateVerkoop, handleClennieUpdate, handleCreateInkoop }
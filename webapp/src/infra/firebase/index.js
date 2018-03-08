import * as firebase from 'firebase';
import 'firebase/firestore';
import config from 'infra/firebase/config';

firebase.initializeApp(config);
firebase.firestore().enablePersistence()
    .then(function() {
        // Initialize Cloud Firestore through firebase
        const db = firebase.firestore();
        // db.collection("users").get().then((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         console.log(`${doc.id} => ${doc.data()}`);
        //     });
        // });

        db.collection('env').doc('dev').set({})
            .then(function(docRef) {
                db.collection('env/dev/games').add({
                    first: 'Ada',
                    last: 'Lovelace',
                    born: 1815
                });
                console.log('Document written with ID: ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    })
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });
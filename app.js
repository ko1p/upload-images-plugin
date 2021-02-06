import firebase from "firebase/app"
import 'firebase/storage'
import {upload} from './upload'

const firebaseConfig = {
    apiKey: "AIzaSyB5Zzjp5TTzF-lqV_cq8HlEbP7EK9IyTQE",
    authDomain: "fe-upload-f6c78.firebaseapp.com",
    projectId: "fe-upload-f6c78",
    storageBucket: "fe-upload-f6c78.appspot.com",
    messagingSenderId: "410338799200",
    appId: "1:410338799200:web:d9b1a6b08fb6f82a0bdd05"
};

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
    multi: true,
    accept: ['.jpg', '.jpeg', '.png', '.svg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed()+ '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            },  () => {
                console.log('complete')
            })
        })
    }
})
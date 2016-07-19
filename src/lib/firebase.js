import firebase from 'firebase'
import Config from 'react-native-config'

const config = {
    apiKey: Config.API_KEY,
    authDomain: Config.AUTH_DOMAIN,
    databaseURL: Config.DATABASE_URL,
    storageBucket: Config.STORAGE_BUCKET,
};
firebase.initializeApp(config)

export default firebase

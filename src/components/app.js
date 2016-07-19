import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import firebase from '../lib/firebase'

const db = firebase.database();
const ref = db.ref('todos');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    todos: {
        marginTop: 20,
    },
    input: {
        marginTop: 2,
        marginBottom: 2,
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'black',
    },
    add: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});

export default class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
        ref.on('child_added', snapshot => {
            this.setState({
                [snapshot.key]: snapshot.val()
            })
        })
        ref.on('child_removed', snapshot => {
            delete this.state[snapshot.key]
            this.setState(this.state)
        })
    }

    add() {
        const newTodo = ref.push().set({
            todo: 'research Firebase Realtime database',
            isDone: false,
            createdAt: (new Date()).toISOString(),
        })
        console.log(newTodo)
    }

    render() {
        return (
          <View style={styles.container}>
            <View style={styles.todos}>
              <Text>{JSON.stringify(this.state)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.add()}
              style={styles.input}
            >
              <Text style={styles.add}>ADD</Text>
            </TouchableOpacity>
          </View>
        );
    }
}

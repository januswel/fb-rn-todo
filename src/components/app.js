import React from 'react';
import {
    ActivityIndicator,
    ListView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import firebase from '../lib/firebase'
import CheckBox from 'react-native-checkbox'

const db = firebase.database();
const ref = db.ref('todos');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    todos: {
        flex: 35,
        marginTop: 20,
        borderTopWidth: 1,
    },
    cell: {
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkbox: {
        flex: 7,
        padding: 8,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
    },
    deleteLabel: {
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    input: {
        flex: 1,
        height: 36,
        margin: 2,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textinput: {
        flex: 1,
        marginRight: 3,
        borderWidth: 0.5,
        borderColor: '#0f0f0f',
        fontSize: 13,
    },
});

export default class App extends React.Component {
    constructor(props) {
        super(props)

        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })

        this.todos = {}
        this.state = {
            dataSource: dataSource.cloneWithRows(this.todos),
            numofTodos: Object.keys(this.todos).length,
            newTodo: '',
        }
        ref.on('child_added', snapshot => {
            this.todos[snapshot.key] = snapshot.val()
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.todos),
                numofTodos: Object.keys(this.todos).length,
            })
        })
        ref.on('child_changed', snapshot => {
            // http://stackoverflow.com/questions/37367983/react-native-re-render-rows-in-listview-on-state-change
            this.todos = {
                ...this.todos
            }
            this.todos[snapshot.key] = snapshot.val()
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.todos),
            })
        })
        ref.on('child_removed', snapshot => {
            delete this.todos[snapshot.key]
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.todos),
                numofTodos: Object.keys(this.todos).length,
            })
        })
    }

    addTodo(event) {
        ref.push().set({
            todo: this.state.newTodo,
            isDone: false,
            createdAt: (new Date()).toISOString(),
        })
        this.setState({
            newTodo: '',
        })
    }

    setDone(rowId, newValue) {
        ref.child(rowId).update({
            isDone: newValue,
        })
    }

    deleteTodo(rowId) {
        ref.child(rowId).set(null)
    }

    renderRow(rowData, sectionId, rowId) {
        return (
          <View style={styles.cell}>
            <View style={styles.checkbox}>
              <CheckBox
                label={rowData.todo}
                checked={rowData.isDone}
                onChange={() => this.setDone(rowId, !rowData.isDone)}
              />
            </View>
            <TouchableOpacity
              onPress={() => this.deleteTodo(rowId)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteLabel}>Del</Text>
            </TouchableOpacity>
          </View>
        )
    }

    onChangeText(text) {
        this.setState({
            newTodo: text,
        })
    }

    render() {
        return (
          <View style={styles.container}>
            {0 < this.state.numofTodos
              ? <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                enableEmptySections={true}
                style={styles.todos}
              />
              : <ActivityIndicator
                animating={true}
                size="large"
                style={styles.todos}
              />
            }
            <View style={styles.input}>
              <TextInput
                value={this.state.newTodo}
                placeholder="write todo"
                onChangeText={event => this.onChangeText(event)}
                onSubmitEditing={event => this.addTodo(event)}
                blurOnSubmit={true}
                keyboardType="default"
                returnKeyType="done"
                style={styles.textinput}
              />
            </View>
          </View>
        );
    }
}

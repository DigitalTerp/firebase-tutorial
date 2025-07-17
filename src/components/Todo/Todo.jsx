import { useEffect, useState } from 'react';
import { db } from '/src/lib/firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './Todo.css';
 
const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editId, setEditID] = useState(null);
    const [editText, setEditText] = useState('');

    // Fetch To-Dos from FireStore
    useEffect(() => {
        const fetchTodos = async () => {
            const querySnapshot = await getDocs(collection(db, "todos"));
            setTodos(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id})))
        };
        fetchTodos();
    }, []); // RUNS ONCE

    // ADD A NEW TO-DO
    const addToDo = async () => {
        if (newTodo.trim() === '') return;
        const docRef = await addDoc(collection(db, "todos"), {
            text: newTodo,
            completed: false
        });
        setTodos([...todos, { text: newTodo, completed: false, id: docRef.id }]);
        setNewTodo('');
    }
    
    
    // DELETE A TO-DO
    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, "todos", id));
        setTodos(todos.filter(todo => todo.id !== id));
    }

    // START EDITING TO-DO
    const startEdit = (id, currentText) => {
        setEditID(id);
        setEditText(currentText);
    };

    // SAVE THE EDIT
    const saveEdit = async (id) => {
        const docRef = doc(db, "todos", id);
        await updateDoc(docRef, {
            text: editText
        });
        setTodos(todos.map(todo => todo.id === id ? { ...todo, text: editText } : todo))
        setEditID(null); // EXIT EDIT MODE
        setEditText('') // CLEAR THE EDIT TEXT
    }

    return (
        <>
            <div>
            <h1>To-Do</h1>
            <input type="text" value={newTodo} onChange={(event) => setNewTodo(event.target.value)} />
            <button onClick={addToDo}>ADD TO-DO</button>
            </div>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {
                            editId === todo.id ? (
                                <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(event) => setEditText(event.target.value)}
                                />
                                  <button className='save' onClick={() => saveEdit(todo.id, todo.text)}>Save</button>
                                </>
                            ) : (
                                <>
                                {todo.text}
                                <button onClick={() => startEdit(todo.id, todo.text)}>Edit</button>
                                <button className='delete' onClick={() => deleteTodo(todo.id)}>Delete</button>
                                </>
                            )
                        }
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Todo;
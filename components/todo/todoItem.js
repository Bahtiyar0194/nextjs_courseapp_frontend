import { useDispatch } from "react-redux";
import {toggleTodoComplete, removeTodo} from "../../store/slices/todo/todoSlice"
const todoItem = ({ todo }) => {
    const dispatch = useDispatch();

    const toggleTodoHandler = (id) => {
        dispatch(toggleTodoComplete(id))
    }

    const removeTodoHandler =(id) => {
        dispatch(removeTodo(id))
    }
    return (
        <div className="card flex justify-between items-center">
            <div className={`text-xl ${todo.done === true ? "line-through" : ""}`}>{todo.title}</div>
            <div className="flex">
                <button className="btn btn-outline-success" onClick={() => toggleTodoHandler(todo.id)}><i className="fa-solid fa-check"></i></button>
                <button className="btn btn-outline-danger ml-2" onClick={() => removeTodoHandler(todo.id)}><i className="fa-solid fa-xmark"></i></button>
            </div>
        </div>
    )
}

export default todoItem
import MainLayout from "../components/layouts/main_layout/MainLayout";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../store/slices/todo/todoSlice";
import TodoItem from "../components/todo/todoItem";

export default function Index() {
    const dispatch = useDispatch()
    const [todoTitleValue, setTodoTitleValue] = useState('')

    const todos = useSelector((state) => state.todo.todos)


    const addTodoHandler = (e) => {
        e.preventDefault()
        const todoItem = {
            id: Date.now(),
            title: todoTitleValue,
            done: false
        }

        dispatch(addTodo(todoItem))
        setTodoTitleValue('')
    }

    return (
        <MainLayout title="Home">
            <div className="custom-container">
                <form onSubmit={addTodoHandler}>
                    <div className="form-group">
                        <label>Название задачи</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={todoTitleValue}
                                onChange={e => setTodoTitleValue(e.target.value)}
                                placeholder="Введите название задачи"
                                required
                            />
                            <button className="btn btn-primary ml-2" type="submit"><i className="fa-solid fa-plus"></i> <span>Добавить</span></button>
                        </div>
                    </div>
                </form>

                <div className="mb-4 text-xl corp-font-medium">{todos.length > 0 ? 'Записей: ' + todos.length : 'Записей пока нет'}</div>

                {
                    todos?.map(todo => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))
                }
            </div>
        </MainLayout>
    );
}
document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const addTodoForm = document.getElementById('add-todo-form');
    const taskInput = document.getElementById('task');

    // タスク一覧を取得して表示する関数
    async function fetchTodos() {
        try {
            const response = await fetch('/data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const todos = await response.json();
            todoList.innerHTML = ''; // 既存のリストをクリア
            todos.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${item.id}, タスク: ${item.task}, 完了: ${item.done ? '✔️' : '❌'}`;
                todoList.appendChild(listItem);
            });
        } catch (error) {
            console.error('タスクの取得に失敗しました:', error);
            todoList.innerHTML = '<li>タスクの取得に失敗しました。</li>';
        }
    }

    // タスク追加フォームの送信イベントリスナー
    addTodoForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // デフォルトのフォーム送信をキャンセル

        const task = taskInput.value;

        try {
            const response = await fetch('/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: task, done: false }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // フォームをクリア
            taskInput.value = '';

            // タスク一覧を再読み込み
            await fetchTodos();

        } catch (error) {
            console.error('タスクの追加に失敗しました:', error);
            alert('タスクの追加に失敗しました。');
        }
    });

    // 初期タスクの読み込み
    fetchTodos();
});
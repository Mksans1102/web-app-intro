document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const addTodoForm = document.getElementById('add-todo-form');
    const taskInput = document.getElementById('task');
    const dueInput = document.getElementById('due');

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
                listItem.innerHTML = `
                    <span style="cursor:pointer;" class="toggle-done" data-id="${item.id}">
                        ${item.done ? '✔️' : '❌'}
                    </span>
                    <span class="task-text" style="margin-left:8px;${item.done ? 'text-decoration:line-through;color:#aaa;' : ''}">
                        ${item.task}
                    </span>
                    <span class="due-text" style="margin-left:16px;color:#ee8320;">
                        ${item.due ? '期限: ' + item.due : ''}
                    </span>
                    <button class="delete-btn" data-id="${item.id}" style="float:right;">削除</button>
                `;
                todoList.appendChild(listItem);
            });

            // 完了マーク切り替えイベント
            document.querySelectorAll('.toggle-done').forEach(el => {
                el.addEventListener('click', async (e) => {
                    const id = el.getAttribute('data-id');
                    const todo = todos.find(t => t.id == id);
                    if (!todo) return;
                    // doneを反転
                    const updated = { ...todo, done: !todo.done };
                    await fetch(`/data/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updated)
                    });
                    fetchTodos();
                });
            });

            // 削除ボタンイベント
            document.querySelectorAll('.delete-btn').forEach(el => {
                el.addEventListener('click', async (e) => {
                    const id = el.getAttribute('data-id');
                    await fetch(`/data/${id}`, { method: 'DELETE' });
                    fetchTodos();
                });
            });

        } catch (error) {
            console.error('タスクの取得に失敗しました:', error);
            todoList.innerHTML = '<li>タスクの取得に失敗しました。</li>';
        }
    }

    // タスク追加フォームの送信イベントリスナー
    addTodoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const task = taskInput.value;
        const due = dueInput.value; 
        try {
            const response = await fetch('/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: task, done: false, due: due }), // 追加
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // フォームをクリア
            taskInput.value = '';
            dueInput.value = '';

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
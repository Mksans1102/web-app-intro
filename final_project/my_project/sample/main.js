document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('task-input');
    const list = document.getElementById('todo-list');

    // タスク一覧を取得して表示
    function fetchTodos() {
        fetch('/api/todos')
            .then(res => res.json())
            .then(todos => {
                list.innerHTML = '';
                todos.forEach(todo => {
                    const li = document.createElement('li');
                    li.textContent = todo;
                    list.appendChild(li);
                });
            });
    }

    // 新しいタスクを追加
    form.addEventListener('submit', e => {
        e.preventDefault();
        const task = input.value.trim();
        if (!task) return;
        fetch('/api/todos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({task})
        }).then(() => {
            input.value = '';
            fetchTodos();
        });
    });

    fetchTodos();
});
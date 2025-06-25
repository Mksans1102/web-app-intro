from fastapi import FastAPI, Response, HTTPException
from fastapi.responses import HTMLResponse, PlainTextResponse
from pydantic import BaseModel
from typing import List, Optional

import sqlite3
import os
import uvicorn

app = FastAPI()

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "data.db")


class TodoItem(BaseModel):
    id: Optional[int] = None
    task: str
    done: bool = False
    due: Optional[str] = None  # 追加


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT 0,
            due TEXT
        )
        """
    )
    conn.commit()
    conn.close()


@app.get("/data", response_model=List[TodoItem])
def read_todos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, task, done, due FROM data")
    rows = cursor.fetchall()
    conn.close()
    return [
        TodoItem(id=row["id"], task=row["task"], done=bool(row["done"]), due=row["due"])
        for row in rows
    ]


@app.post("/data", response_model=TodoItem, status_code=201)
def create_todo(item: TodoItem):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO data (task, done, due) VALUES (?, ?, ?)",
        (item.task, int(item.done), item.due),
    )
    conn.commit()
    item_id = cursor.lastrowid
    conn.close()
    return TodoItem(id=item_id, task=item.task, done=item.done, due=item.due)


@app.delete("/data/{item_id}", status_code=204)
def delete_todo(item_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM data WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return Response(status_code=204)


@app.patch("/data/{item_id}", response_model=TodoItem)
def update_todo(item_id: int, item: TodoItem):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE data SET task = ?, done = ? WHERE id = ?",
        (item.task, item.done, item_id),
    )
    conn.commit()
    updated = cursor.execute("SELECT * FROM data WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    if updated is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return TodoItem(**dict(updated))


# ここから下は書き換えない
@app.get("/", response_class=HTMLResponse)
async def read_html():
    html_file_path = os.path.join(BASE_DIR, "client.html")
    with open(html_file_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/style.css")
def read_css():
    css_file_path = os.path.join(BASE_DIR, "style.css")
    with open(css_file_path, "r", encoding="utf-8") as f:
        css_content = f.read()
    return Response(content=css_content, media_type="text/css")


@app.get("/script.js", response_class=PlainTextResponse)
def read_js():
    js_file_path = os.path.join(BASE_DIR, "script.js")
    with open(js_file_path, "r", encoding="utf-8") as f:
        js_content = f.read()
    return PlainTextResponse(
        content=js_content, status_code=200, media_type="application/javascript"
    )


@app.get("/favicon.ico")
def read_favicon():
    favicon_path = os.path.join(BASE_DIR, "favicon.ico")
    with open(favicon_path, "rb") as f:
        favicon_content = f.read()
    return Response(content=favicon_content, media_type="image/x-icon")


if __name__ == "__main__":
    initialize_db()
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)

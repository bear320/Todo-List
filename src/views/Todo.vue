<template>
    <section class="container todo-container">
        <span class="logout" @click="logout">登出</span>
        <h1>我的待辦事項</h1>
        <div class="input">
            <input
                type="text"
                name="todo"
                id="todo"
                placeholder="輸入待辦事項"
                v-model.trim="input"
                @keyup.enter="addTodo"
            />
            <button class="btn-style" @click="addTodo">新增</button>
        </div>
        <ul class="todo-wrap">
            <li class="todo-card" :class="{ done: list.done }" v-for="(list, index) in todos" :key="list.id">
                <input type="checkbox" v-model="list.done" id="list.id" @input="toggoleDone(index, list.id)" />
                <label for="list.id" class="label">{{ list.content }}</label>
                <button class="btn-style delete" @click="deleteTodo(index, list.id)">刪除</button>
            </li>
        </ul>
    </section>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get, remove } from "firebase/database";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDUsz3Bk2fejDwoxiAd9U7uLP_349BCE6c",
    authDomain: "todolist-2395c.firebaseapp.com",
    databaseURL: "https://todolist-2395c-default-rtdb.firebaseio.com",
    projectId: "todolist-2395c",
    storageBucket: "todolist-2395c.appspot.com",
    messagingSenderId: "860096240753",
    appId: "1:860096240753:web:4b10b51bb174ad2c090fd0",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default {
    components: {},
    data() {
        return {
            isLogIn: localStorage.getItem("isLogIn"),
            uid: localStorage.getItem("uid"),
            input: "",
            todos: [],
        };
    },
    methods: {
        getTodo() {
            // 引用 firebase 數據庫 db
            const dbRef = ref(db);
            // 使用 get() 獲取 user/${this.uid} 路徑下之數據
            // ${this.uid} 為當前用戶之 uid
            // 獲取成功，執行 then 區塊；獲取失敗，則執行 catch 區塊
            get(child(dbRef, `users/${this.uid}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        // 該節點下有資料
                        // 定義一個名為 fbTodos 的空陣列
                        const fbTodos = [];
                        // 使用 forEach() 遍歷 snapshot 中的資料
                        snapshot.forEach((item) => {
                            // 將 item 之值賦值給 todo
                            const todo = item.val();
                            // 將 todo 新增至 fbTodos 之陣列
                            fbTodos.push(todo);
                        });
                        // 將 fbTodos 賦值給 this. todos
                        this.todos = fbTodos;
                    } else {
                        // 該節點下沒有資料
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        addTodo() {
            // 如果待辦事項內容為空則 return
            if (!this.input) {
                alert("待辦事項不可為空！");
                return;
            }
            // 定義一個名為 newTodo 的物件，內容分別有 id, content, done
            const newTodo = {
                // id 為現在時間
                id: Math.floor(Date.now()),
                // content 為 this.input 之值
                content: this.input.trim(),
                // done 為完成狀態（預設為 false）
                done: false,
            };
            // 將 newTodo 新增至 this.todos 的陣列中
            this.todos.push(newTodo);
            // 使用 set() 將 newTodo 新增至路徑 users/${this.uid}/${newTodo.id}
            // ${this.uid} 為當前用戶之 uid
            // ${newTodo.id} 為該 newTodo 的 id 之值
            set(ref(db, `users/${this.uid}/${newTodo.id}`), newTodo);
            // 清空 this.input 之值
            this.input = "";
            // 獲取 todo
            this.getTodo();
        },
        deleteTodo(index, val) {
            // 第一個參數： v-for 之 index
            // 第二個參數： 該 todo 的 id

            // 從 this.todos 陣列中第 index 個位置刪除一個元素
            this.todos.splice(index, 1);
            // 使用 remove() 刪除資料庫路徑 users/${this.uid}/${val} 的 todo
            // ${this.uid} 為當前用戶之 uid
            // ${val} 為該 todo 之 id
            remove(ref(db, `users/${this.uid}/${val}`));
            // 獲取 todo
            this.getTodo();
        },
        toggoleDone(index, val) {
            // 第一個參數： v-for 之 index
            // 第二個參數： 該 todo 的 id

            // 定義 boolean 為 this.todos 陣列中第 index 個物件的完成狀態
            let boolean = this.todos[index].done;

            // 檢查 boolean 之值
            if (!boolean) {
                // 若 boolean 為 false，則將它設為 true
                boolean = !boolean;
                // 使用 set() 將資料庫中該 todo 的完成狀態設為 true
                set(ref(db, `users/${this.uid}/${val}/done`), true);
            } else if (boolean) {
                // 若 boolean 為 true，則將它設為 false
                boolean = !boolean;
                // 使用 set() 將資料庫中該 todo 的完成狀態設為 false
                set(ref(db, `users/${this.uid}/${val}/done`), false);
            } else {
                // 若 boolean 不為 true 或 false，則直接 return
                return;
            }
            // 獲取 todo
            this.getTodo();
        },
        logout() {
            // 使用 signOut() 登出使用者
            // 登出成功，執行 then 區塊；登出失敗，則執行 catch 區塊
            signOut(auth)
                .then(() => {
                    // 移除 localStorage 中的 isLogIn 和 uid
                    localStorage.removeItem("isLogIn");
                    localStorage.removeItem("uid");
                    // 使用 $router.push 將使用者重新導向 / 路由
                    this.$router.push("/");
                })
                .catch((error) => {
                    alert("登出失敗，請再次嘗試！");
                    return;
                });
        },
    },
    created() {
        this.getTodo();
    },
};
</script>

<style lang="scss" scoped>
.todo-container {
    width: 80%;
    height: 80%;
    overflow: scroll;

    // Scrollbar
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    .logout {
        position: absolute;
        top: 0;
        right: 0;
        padding: 1.5rem;

        &:hover {
            cursor: pointer;
            font-weight: bold;
            transform: scale(1.05);
        }
    }

    .input {
        display: flex;
        column-gap: 1rem;
        height: 2.5rem;
        margin-bottom: 2rem;

        input {
            flex-grow: 1;
            outline: none;
            border-radius: 0.5rem;
            border: 1px solid #0007;
            padding: 0 0.5rem;
        }

        button {
            width: 4rem;
            outline: none;
            border-radius: 0.5rem;
            border: none;
            background-color: #4682b4;
            color: #fff;
        }
    }

    .todo-wrap {
        width: 100%;
        padding-left: 0;

        .todo-card {
            padding: 1.5rem 1.5rem;
            display: flex;
            column-gap: 1rem;
            height: 2.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 0 10px #0003;

            &:hover {
                transform: scale(1.02);
                box-shadow: 0 0 10px #0005;
            }

            input[type="checkbox"] {
                align-self: center;
                width: 1.5rem;
                height: 1.5rem;

                &:checked {
                    background-color: pink;
                }
            }

            .label {
                margin: 0;
                text-align: left;
                line-height: 2.5rem;
                flex-grow: 1;
                font-size: 1.5rem;
                font-weight: bold;
            }

            .delete {
                background-color: #ff6347;
            }

            & + .todo-card {
                margin-top: 2rem;
            }
        }

        .done {
            background-color: #3cb37140;

            .label {
                text-decoration: line-through;
            }
        }
    }
}
</style>

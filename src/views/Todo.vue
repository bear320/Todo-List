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
            const dbRef = ref(db);
            get(child(dbRef, `users/${this.uid}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const fbTodos = [];
                        snapshot.forEach((item) => {
                            const todo = item.val();
                            fbTodos.push(todo);
                        });
                        this.todos = fbTodos;
                    } else {
                        console.log("No data available");
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        addTodo() {
            if (!this.input) {
                alert("待辦事項不可為空！");
                return;
            }
            const newTodo = {
                id: Math.floor(Date.now()),
                content: this.input.trim(),
                done: false,
            };
            this.todos.push(newTodo);
            set(ref(db, `users/${this.uid}/${newTodo.id}`), newTodo);
            this.input = "";
            this.getTodo();
        },
        deleteTodo(index, val) {
            this.todos.splice(index, 1); // 刪？
            remove(ref(db, `users/${this.uid}/${val}`));
            this.getTodo();
        },
        toggoleDone(index, val) {
            let boolean = this.todos[index].done;

            if (!boolean) {
                boolean = !boolean;
                set(ref(db, `users/${this.uid}/${val}/done`), true);
            } else if (boolean) {
                boolean = !boolean;
                set(ref(db, `users/${this.uid}/${val}/done`), false);
            } else {
                return;
            }
            this.getTodo();
        },
        logout() {
            signOut(auth)
                .then(() => {
                    localStorage.removeItem("isLogIn");
                    localStorage.removeItem("uid");
                    this.$router.push("/");
                    alert("登出成功，歡迎再次登入！");
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
                // color: #0007;
                text-decoration: line-through;
            }
        }
    }
}
</style>

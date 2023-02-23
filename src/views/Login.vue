<template>
    <section class="container login-container">
        <h1>立即登入<br />開始使用 Todo List</h1>
        <div class="btn-wrap">
            <button @click="googleLogin">使用 Google 帳號登入</button>
            <button>使用 Facebook 帳號登入</button>
            <button>使用 Github 帳號登入</button>
        </div>
    </section>
</template>

<script>
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/auth";
const provider = new GoogleAuthProvider();

export default {
    components: {},
    data() {
        return {
            user: null,
            uid: null,
        };
    },
    computed: {},
    methods: {
        googleLogin() {
            // 使用 signInWithPopup() 跳出登入彈窗
            // 第一個參數： firebase auth 實例
            // 第二個參數： google 登入提供者
            // 登入成功，執行 then 區塊；登入失敗，則執行 catch 區塊
            signInWithPopup(auth, provider)
                .then((result) => {
                    // 使用 GoogleAuthProvider.credentialFromResult() 獲取使用者認證和存取權杖
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;

                    // 將 user 和 uid 分別賦值給 this.user 和 this. uid
                    this.user = result.user;
                    this.uid = result.user.uid;
                    // 使用 $router.push 將使用者重新導向 /todo 路由
                    this.$router.push("/todo");
                    // 將 localStorage 中的 isLogIn 和 uid 分別設定為 true 和當前用戶之 uid
                    localStorage.setItem("isLogIn", "true");
                    localStorage.setItem("uid", `${result.user.uid}`);
                })
                .catch((error) => {
                    // const errorCode = error.code;
                    // const errorMessage = error.message;
                    // const email = error.customData.email;
                    // const credential = GoogleAuthProvider.credentialFromError(error);
                    console.log(error);
                    alert("登入失敗，請再次嘗試！");
                });
        },
    },
    created() {},
};
</script>

<style lang="scss" scoped>
.login-container {
    width: fit-content;

    h1 {
        line-height: 2;
        margin: 0 0 1rem;
    }

    .btn-wrap {
        button {
            width: 100%;
            outline: none;
            border: none;
            border-radius: 1rem;
            padding: 1rem;
            box-shadow: 0 0 10px #0004;
            display: block;
            margin: auto;
            color: #fff;

            &:hover {
                cursor: pointer;
                transform: scale(1.05);
            }

            &:nth-child(1) {
                background-color: #c94130;
            }

            &:nth-child(2) {
                background-color: #4267b2;
                cursor: not-allowed;
            }

            &:nth-child(3) {
                background-color: #24292f;
                cursor: not-allowed;
            }

            & + button {
                margin-top: 1.5rem;
            }
        }
    }
}
</style>

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
            signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;
                    this.user = result.user;
                    this.uid = result.user.uid;
                    this.$router.push("/todo");
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

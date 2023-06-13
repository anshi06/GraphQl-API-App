import "./Auth.css";
import { useContext, useRef, useState } from "react";
import AuthContext from "../context/auth-context";
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const emailEl = useRef();
  const passwordEl = useRef();

  const contextType = useContext(AuthContext);
  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
            query Login($email: String!, $password: String!){
              login(email: $email, password: $password) {
                userId
                token
                tokenExpiration
              }
            }
          `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!isLogin) {
      requestBody = {
        query: `
              mutation CreateUser($email: String!, $password: String!){
                createUser(userInput: {email: $email, password: $password}) {
                  _id
                  email
                }
              }
            `,
        variables: {
          email: email,
          password: password,
        },
      };
    }

    await fetch("http://localhost:9000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          contextType.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.expiration
          );
        }
        console.log({ resData });
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" ref={emailEl}></input>
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl}></input>
      </div>
      <div className="form-actions">
        <button type="button" onClick={switchModeHandler}>
          Switch to {isLogin ? "Signup" : "Login"}
        </button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

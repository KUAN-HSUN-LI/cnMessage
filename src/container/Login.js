import React, { useRef } from "react"
import Button from "../component/Button"
import { Redirect } from "react-router-dom"
import { useMutation } from "react-apollo"
// import { Context } from '../context';
import "./Login.css"
import "./Input.css"

import { LOGIN_USER_MUTATION } from "../graphql"

const Login = (props) => {
  // const { dispatch } = useContext(Context);
  const name = useRef(null)
  const pwd = useRef(null)
  const [loginUserMutation, { loading: mutationLoading }] = useMutation(
    LOGIN_USER_MUTATION,
    {
      async onCompleted(data) {
        await localStorage.setItem("name", name)
        await localStorage.setItem(
          "friends",
          JSON.stringify(data.loginUser.friends)
        )
        props.history.push({ pathname: "/chatroom" })
        return <Redirect to={{ pathname: "/chatroom" }} />
      },
      onError(err) {
        console.error(err)
      },
    }
  )
  const handleKeypress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !pwd) return
    loginUserMutation({
      variables: {
        name: name.current.value,
        pwd: pwd.current.value,
      },
    })
  }
  return (
    <div className="login-base">
      <h1 className="title">Message Box Login</h1>
      <div type="label" className="white-word">
        User Name
      </div>
      <div>
        <input
          className="input-base"
          type="text"
          onKeyPress={(e) => handleKeypress(e)}
          ref={name}
        ></input>
      </div>
      <div type="label" className="white-word">
        Password
      </div>
      <div>
        <input
          className="input-base"
          type="password"
          onKeyPress={(e) => handleKeypress(e)}
          ref={pwd}
        ></input>
      </div>
      <Button name="submit" onClick={handleSubmit}></Button>
      <Button
        name="register"
        onClick={(e) => {
          e.preventDefault()
          props.history.push({ pathname: "/register" })
          return <Redirect to={{ pathname: "/register" }} />
        }}
      ></Button>
    </div>
  )
}

export default Login

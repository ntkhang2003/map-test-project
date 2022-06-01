import './register.css'
import {Room, Cancel} from "@material-ui/icons"	
import * as React from 'react'
import axios from "axios"

export default function Register({setShowRegister}) {
    const [success, setSuccess] = React.useState(false)
    const [error, setError] = React.useState(false)
    const nameRef = React.useRef()
    const emailRef = React.useRef()
    const passwordRef = React.useRef()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        try {
            await axios.post("api/users/register", newUser)
            setError(false)
            setSuccess(true)
        } catch (err) {
            setError(true)
        }
    }   
    return (
        <div className='registerContainer'>
            <div className='logo'>
                <Room/>
                Travel Plan
            </div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='username' ref={nameRef}/>
                <input type='email' placeholder='email' ref={emailRef}/>
                <input type='password' placeholder='password' ref={passwordRef}/>
                <button className='registerBtn'>Register</button>
                {success &&     
                    <span className="success">Successfull. You can login now!</span>
                }
                {error && 
                    <span className="failure">Something went wrong!</span>
                }
            </form>
            <Cancel className='registerCancel' onClick={() => setShowRegister(false)}/>
        </div>
    )
}
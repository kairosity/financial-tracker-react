import { useState } from 'react'

import styles from './Signup.module.css'

export default function Signup() {

    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(displayName, email, password)
        setDisplayName('')
        setEmail('')
        setPassword('')
    }
    
    return (
        <form
            className={styles['signup-form']}
            onSubmit={handleSubmit}
        >
            <h2>Sign Up</h2>
            <label>
                <span>display name:</span>
                <input 
                    type="text"
                    onChange={(e) => {setDisplayName(e.target.value)}}
                    value={displayName}
                />
            </label>
            <label>
                <span>email:</span>
                <input 
                    type="text"
                    onChange={(e) => {setEmail(e.target.value)}}
                    value={email}
                />
            </label>
            <label>
                <span>password:</span>
                <input 
                    type="text"
                    onChange={(e) => {setPassword(e.target.value)}}
                    value={password}
                />
            </label>
            <button 
                className='btn'
                type='submit'
            >Sign Up!</button>
        </form>
    )
}
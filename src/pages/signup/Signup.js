import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'

import styles from './Signup.module.css'

export default function Signup() {

    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signup, error, isPending} = useSignup()

    const handleSubmit = (e) => {
        e.preventDefault()

        // signup function from useSignup
        signup(email, password, displayName)
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
                    type="email"
                    onChange={(e) => {setEmail(e.target.value)}}
                    value={email}
                />
            </label>
            <label>
                <span>password:</span>
                <input 
                    type="password"
                    onChange={(e) => {setPassword(e.target.value)}}
                    value={password}
                />
            </label>
            {!isPending && <button 
                className='btn'
                type='submit'
            >Sign Up!</button>}
            {isPending && <button className='btn' disabled>Loading...</button>}
            {error && <p>{error}</p>}
        </form>
    )
}


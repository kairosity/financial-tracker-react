import { Link } from 'react-router-dom'

// styles 
import styles from './Navbar.module.css'

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul>
                <li className={styles.title}>My Money</li>
                <li><Link to='/login'>Login</Link></li>
                <li><Link to='/signup'>Sign Up</Link></li>
            </ul>
        </nav>
    )
}

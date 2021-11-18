import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// components
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Navbar from './components/Navbar'

function App() {

  const { authIsReady, user } = useAuthContext()

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={(!user && <Navigate to='/login'/>) || (user && <Home />)} />
            <Route path='/login' element={(user && <Navigate to='/'/>) || (!user && <Login />)} />
            <Route path='/signup' element={(user && <Navigate to='/'/>) || (!user && <Signup />)} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App

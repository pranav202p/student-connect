import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Singup from './Pages/Singup';
import Home from './Pages/Home';
import { AuthProvider } from './Authentication/AuthContext';
import CreateGroup from './components/CreateGroup';

function App() {
  
  return (
    <AuthProvider>
    <Routes>
      <Route path='/signup' element={<Singup />}/>
      <Route path='/create-group' element={<CreateGroup/>}/>
      <Route path='/' element={<Home/>}/>
    </Routes>
    </AuthProvider>
  
  
  )
}

export default App

import './App.sass'
import './components/login/page'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/login/page';

import Mappage from './components/mappage/page';
function App() {

  return (
   <BrowserRouter>
   <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/Mappage' element={<Mappage/>}></Route>
   </Routes>
   </BrowserRouter>
  )
}

export default App

import React from 'react'
 import {Route,Routes} from "react-router"
 import HomePage from './pages/HomePage'
 import NoteDetailPage from './pages/NoteDetailPage'
 import CreatePage from './pages/CreatePage'
const App = () => {
  return (
    <>
   <Routes>
    <Route path="/" element={<HomePage/>}/>
     <Route path="/Create" element={<CreatePage/>}/>
      <Route path="/note/:id" element={<NoteDetailPage/>}/>
  
   </Routes>
    </>
  )
}

export default App
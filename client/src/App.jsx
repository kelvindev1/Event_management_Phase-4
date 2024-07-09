import './App.css'
import EventBookmark from './components/EventBookmark'
import Events from './components/Events'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {

  return (
    <>
    <h1>Fullstack application</h1>
    <Events/>
    <EventBookmark/>
    <Signup/>
    <Login/>
    </>
  )
}

export default App

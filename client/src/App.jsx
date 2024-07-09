import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import EventBookmark from './components/EventBookmark'
import Events from './components/Events'
import Home from "./components/Home";
import HomeLayout from "./components/HomeLayout";

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element = {<HomeLayout/>}/>
        <Route path="/home" element = {<Home/>} />
        <Route path="/home/events" element = {<Events/>}/>
        <Route path="/home/eventbookmark" element = {<EventBookmark/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App

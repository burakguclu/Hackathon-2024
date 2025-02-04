import './App.css'
import RouterConfig from './config/RouterConfig'
import Sidebar from './components/Sidebar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className='app-container'>
      <Sidebar className="sidebar" />
      <RouterConfig className="main-content" />
      <ToastContainer position='top-center' autoClose={2000}/>
    </div>
  )
}

export default App

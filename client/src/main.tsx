import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from './App.tsx'
import Login from "./components/login.tsx"
import Register from "./components/register.tsx"

const root = document.getElementById("root")

ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />}/>
    </Routes>
  </BrowserRouter>
)
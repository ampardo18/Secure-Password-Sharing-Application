import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from './App.tsx'
import Login from "./components/login.tsx"
import Register from "./components/register.tsx"
import Dashboard from "./components/dashboard.tsx"
import NewPasswordForm from "./components/newPasswordForm.tsx"
import { EncryptionKeyProvider } from './lib/EncryptionKeyContext'

const root = document.getElementById("root")

ReactDOM.createRoot(root!).render(
  <EncryptionKeyProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/new-password' element={<NewPasswordForm />}/>
      </Routes>
    </BrowserRouter>
  </EncryptionKeyProvider>
)
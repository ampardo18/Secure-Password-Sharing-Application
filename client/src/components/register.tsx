import { useNavigate } from "react-router-dom"
import React, {useState} from 'react'
import { MoveLeft } from "lucide-react"

function Register(){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        encryption_key: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name] : value
        })
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        try{
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    encryption_key: formData.encryption_key
                })
            })

            const data = await response.json()
            if (response.ok){
                navigate('/login', {replace: true})
            } else{
                console.log(data.message)
            }

        }catch(error){
            console.error(error)
        }
    }

    return(
        <div className='min-h-screen select-none px-4 py-6'>
            <div
                onClick={() => navigate('/', {replace: true})}
                className='back-button'
            >
                <MoveLeft/>
                <span className='hidden md:inline'>Back</span>
            </div>
            <form onSubmit={handleRegister} className='flex flex-col space-y-4 p-4 bg-gray-700 rounded-lg shadow-md max-w-md w-full mx-auto mt-2'>
                <h2 className='font-bold text-xl text-center'>Register</h2>
                <div className="flex flex-col">
                    <label>Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border-2 rounded p-1"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Password</label>
                    <input 
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full border-2 rounded p-1"
                    />
                </div>
                <div className="flex flex-col">
                    <label>First Name</label>
                    <input 
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="w-full border-2 rounded p-1"
                    />
                </div>
                <div className='flex flex-col'>
                    <label>Last Name</label>
                    <input 
                        type='text'
                        name='last_name'
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className='w-full border-2 rounded p-1'
                    />
                </div>
                <div className="flex flex-col">
                    <label>Encryption Key</label>
                    <input 
                        type="password"
                        name="encryption_key"
                        value={formData.encryption_key}
                        onChange={handleChange}
                        required
                        className="w-full border-2 rounded p-1"
                    />
                </div>
                <button type='submit' className='main-buttons'>Register</button>

            </form>

        </div>
    )
}

export default Register
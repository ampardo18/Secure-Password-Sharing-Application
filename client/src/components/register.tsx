import { useNavigate } from "react-router-dom"
import React, {useState} from 'react'

function Register(){
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        encryption_key: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name] : value
        })
    }

    return(
        <div className='min-h-screen select-none px-4 py-6'>
            <form className='flex flex-col space-y-4 p-4 bg-gray-700 rounded-lg shadow-md max-w-md w-full mx-auto mt-20'>
                <h2 className='font-bold text-l text-center'>Register</h2>
                <div className="flex flex-col">
                    <label>Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-1"
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
                        className="w-full border rounded p-1"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Name</label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-1"
                    />
                </div>
                <div className="flex flex-col">
                    <label>Encryption Key</label>
                    <input 
                        type="password"
                        name="firstname"
                        value={formData.encryption_key}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-1"
                    />
                </div>
                <button type='submit' className='main-buttons'>Register</button>

            </form>

        </div>
    )
}

export default Register
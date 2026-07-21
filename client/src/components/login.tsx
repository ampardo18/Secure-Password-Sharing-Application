import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react'
import '../styles/globals.css'

function Login(){
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name] : value
        })
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try{
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await response.json()
            if (response.ok) {
                navigate('/dashboard', { replace: true })
            } else {
                alert(data.message || 'Login failed')
            }
        } catch (error) {
            console.error(error)
            alert('Login failed')
        }
    }

    return(
        <div className='min-h-screen select-none px-4 py-6'>
            <form onSubmit={handleLogin} className='flex flex-col space-y-4 p-4 bg-gray-700 rounded-lg shadow-md max-w-md w-full mx-auto mt-20'>
                <h2 className='text-xl font-bold text-center'>Log-in</h2>
                <div className='flex flex-col'>
                    <label>Email</label>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='w-full border-2 rounded p-1'
                    />
                </div>
                <div className='flex flex-col'>
                    <label>Password</label>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className='w-full border-2 rounded p-1'
                    />
                </div>
                <button type='submit' className='main-buttons'>Sign-in</button>
                <div className="flex items-center my-2">
                    <div className="flex-1 h-px bg-white" />
                    <span className="px-2 text-sm text-white">or</span>
                    <div className="flex-1 h-px bg-white" />
                </div>
                <Link to='/register' className='text-blue-500 hover:text-blue-400 underline text-center'>Don't have an account? Register Now</Link>
            </form>
        </div>
    )
}

export default Login
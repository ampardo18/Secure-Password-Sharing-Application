import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react'
import '../styles/globals.css'
import { useEncryptionKey } from '../lib/EncryptionKeyContext'
import { MoveLeft } from 'lucide-react'

function Login(){
    const navigate = useNavigate()
    const [ errorOccured, setErrorOccured ] = useState<{ email?: string; password?: string; encryption_key?: string; general?: string}>({})
    const { setEncryptionKey } = useEncryptionKey()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        encryption_key: ''
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
                    password: formData.password,
                    encryption_key: formData.encryption_key
                })
            })

            const data = await response.json()
            if (response.ok) {
                setEncryptionKey(formData.encryption_key)
                navigate('/dashboard', { replace: true })
            } else {
                console.log(data.errors)
                setErrorOccured(data.errors)
            }
        } catch (error) {
            console.error(error)
            setErrorOccured({ general: "Network error. Please try again." })
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
            <form onSubmit={handleLogin} className='flex flex-col space-y-4 p-4 bg-gray-700 rounded-lg shadow-md max-w-md w-full mx-auto mt-10 md:mt-15'>
                <h2 className='text-xl font-bold text-center'>Log-in</h2>
                { errorOccured?.general && (
                    <p className='error-handling'>{errorOccured.general}</p>
                )}   
                <div className='flex flex-col mb-1'>
                    <label>Email</label>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full border-2 rounded p-1 focus:outline-none ${
                            errorOccured?.email ? 'border-red-500 focus:outline-none' : ''
                        }`}
                    />
                </div>
                { errorOccured?.email && (
                    <p className='error-handling'>{errorOccured.email}</p>
                )}   
                <div className='flex flex-col mb-1'>
                    <label>Password</label>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`w-full border-2 rounded p-1 focus:outline-none ${
                            errorOccured?.password ? 'border-red-500 focus:outline-none' : ''
                        }`}
                    />
                </div>
                { errorOccured?.password && (
                    <p className='error-handling'>{errorOccured.password}</p>
                )}   
                <div className='flex flex-col mb-1'>
                    <label>Encryption Key</label>
                    <input
                        type='password'
                        name='encryption_key'
                        value={formData.encryption_key}
                        onChange={handleChange}
                        required
                        className={`w-full border-2 rounded p-1 focus:outline-none ${
                            errorOccured?.encryption_key ? 'border-red-500 focus:outline-none' : ''
                        }`}
                    />
                </div>
                { errorOccured?.encryption_key && (
                    <p className='error-handling'>{errorOccured.encryption_key}</p>
                )}   
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
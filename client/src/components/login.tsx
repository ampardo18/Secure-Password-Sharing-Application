import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react'
import '../styles/globals.css'
import { useEncryptionKey } from '../lib/EncryptionKeyContext'
import { MoveLeft, Eye, EyeOff } from 'lucide-react'

function Login(){
    const navigate = useNavigate()
    const [ errorOccured, setErrorOccured ] = useState<{ email?: string; password?: string; encryption_key?: string; general?: string}>({})
    const [ showPassword, setShowPassword ] = useState(false)
    const [ showEncryptionKey, setShowEncryptionKey] = useState(false)
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
        setErrorOccured({})
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
                    <span className='error-handling text-center'>{errorOccured.general}</span>
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
                    <span className='error-handling mb-0'>{errorOccured.email}</span>
                )}   
                <div className='flex flex-col mb-1'>
                    <label>Password</label>
                    <div className='relative'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={`w-full border-2 rounded p-1 pr-10 focus:outline-none ${
                                errorOccured?.password ? 'border-red-500 focus:outline-none' : ''
                            }`}
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword((prev) => !(prev))}
                            className='absolute inset-y-0 right-0 flex items-center pr-3 text-white md:cursor-pointer'
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
                { errorOccured?.password && (
                    <span className='error-handling mb-0'>{errorOccured.password}</span>
                )}   
                <div className='flex flex-col mb-0'>
                    <label>Encryption Key</label>
                    <div className='relative'>
                        <input
                            type={showEncryptionKey ? 'text' : 'password'}
                            name='encryption_key'
                            value={formData.encryption_key}
                            onChange={handleChange}
                            required
                            className={`w-full border-2 rounded p-1 focus:outline-none ${
                                errorOccured?.encryption_key ? 'border-red-500 focus:outline-none' : ''
                            }`}
                        />
                        <button
                            type='button'
                            onClick={() => setShowEncryptionKey((prev) => !(prev))}
                            className='absolute inset-y-0 right-0 flex items-center pr-3 text-white md:cursor-pointer'
                            aria-label={showEncryptionKey ? 'Hide encryption key' : 'Show encryption key'}
                        >
                            {showEncryptionKey ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
                { errorOccured?.encryption_key && (
                    <span className='error-handling'>{errorOccured.encryption_key}</span>
                )}   
                <button type='submit' className={`main-buttons ${errorOccured?.encryption_key ? 'mt-0' : 'mt-4'}`}>Sign-in</button>
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
import '../styles/globals.css'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { MoveLeft, Eye, EyeOff } from 'lucide-react'

function NewPasswordForm(){
    const navigate = useNavigate()
    const [ showPassword, setShowPassword ] = useState(false)
    const [ showEncryptionKey, setShowEncryptionKey] = useState(false)

    const [formData, setFormData] = useState({
        url: '',
        label: '',
        password: '',
        encryption_key: ''
    })

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name] : value
        })
    }

    const handleNewPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        try{
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_HOST}/passwords/save`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    url: formData.url,
                    label: formData.label,
                    password: formData.password,
                    encryption_key: formData.encryption_key
                })
            })

            const data = await response.json()
            if(response.ok){
                navigate('/dashboard', {replace: true})
            }else{
                alert(data.message || 'Registration failed')
            }

        }catch(error){
            console.error(error)
        }
    }

    return(
        <div className='min-h-screen select-none px-4 py-6'>
            <div
                onClick={() => navigate('/dashboard', {replace: true})}
                className='back-button'
            >
                <MoveLeft/>
                <span className='hidden md:inline'>Back</span>
            </div>
            <form onSubmit={handleNewPassword} className='flex flex-col space-y-4 p-4 bg-gray-700 rounded-lg shadow-md max-w-md w-full mx-auto mt-10'>
                <h2 className='font-bold text-xl text-center'>Save Password</h2>
                <div className='flex flex-col'>
                    <label>URL</label>
                    <input 
                        type='text'
                        name='url'
                        value={formData.url}
                        onChange={handleChange}
                        required
                        className='w-full border-2 rounded p-1 focus:outline-none'
                    />
                </div>
                <div className='flex flex-col'>
                    <label>Label Your Password</label>
                    <input 
                        type='text'
                        name='label'
                        value={formData.label}
                        onChange={handleChange}
                        required
                        className='w-full border-2 rounded p-1 focus:outline-none'
                    />
                </div>
                <div className='flex flex-col'>
                    <label>Password</label>
                    <div className='relative'>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className='w-full border-2 rounded p-1 focus:outline-none'
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
                <div className='flex flex-col'>
                    <label>Encryption Key</label>
                    <div className='relative'>
                        <input 
                            type={showEncryptionKey ? 'text' : 'password'}
                            name='encryption_key'
                            value={formData.encryption_key}
                            onChange={handleChange}
                            required
                            className='w-full border-2 rounded p-1 focus:outline-none'
                        />
                        <button
                            type='button'
                            onClick={() => setShowEncryptionKey((prev) => !(prev))}
                            className='absolute inset-y-0 right-0 flex items-center pr-3 text-white md:cursor-pointer'
                            aria-label={showEncryptionKey ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
                <button type='submit' className='main-buttons'>Save</button>
            </form>
        </div>
    )
}

export default NewPasswordForm
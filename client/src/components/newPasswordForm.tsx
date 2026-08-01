import '../styles/globals.css'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { MoveLeft } from 'lucide-react'

function NewPasswordForm(){
    const navigate = useNavigate()

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
            <form onSubmit={handleNewPassword} className='flex flex-col space-y-4 p-4 bg-gray-700 rounded-lg shadow-md max-w-md w-full mx-auto mt-20'>
                <h2 className='font-bold text-xl text-center'>Save Password</h2>
                <div className='flex flex-col'>
                    <label>URL</label>
                    <input 
                        type='text'
                        name='url'
                        value={formData.url}
                        onChange={handleChange}
                        required
                        className='w-full border-2 rounded p-1'
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
                <div className='flex flex-col'>
                    <label>Encryption Key</label>
                    <input 
                        type='password'
                        name='encryption_key'
                        value={formData.encryption_key}
                        onChange={handleChange}
                        required
                        className='w-full border-2 rounded p-1'
                    />
                </div>
                <button type='submit' className='main-buttons'>Save</button>
            </form>
        </div>
    )
}

export default NewPasswordForm
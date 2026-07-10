import '../styles/globals.css'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

function NewPasswordForm(){
    const navgiate = useNavigate()

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

    return(
        <div className='min-h-screen select-none px-4 py-6'>
            <form className='flex flex-col space-y-4 p-4 bg-gray-700 rounded-lg shadow-md max-w-md w-full mx-auto mt-20'>
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
                        name='encryption key'
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
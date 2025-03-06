import React from "react"
import { useState } from 'react'
import mail_icon from '../../assets/mail_icon.svg'
import pwd_icon from '../../assets/pwd_icon.svg'
import { loginUser } from '../../repositories/auth'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const data = await loginUser({ email, password })

            console.log('Logged in successfully:', data)
        } catch (err) {
            setError(err.message || 'Login failed')
        }
    }

  return (
    <div className="flex flex-col justify-center gap-5 rounded-lg container-primary">
        <form className="flex flex-col gap-5">
            <div className="flex flex-col">
                <label htmlFor="emailLog" className="self-start ml-4">Email</label>
                
                <div className="w-full relative">
                    <img src={mail_icon} width="17px" height="17px" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input type="email" placeholder="john.doe@example.co.uk" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border-2 border-slate-200"/>
                </div>
                
            </div>

            <div className="flex flex-col">
                <div className="flex justify-between items-center">
                    <label htmlFor="passwordLog" className="self-start ml-4">Password</label>
                    <a href="#" className="mr-4 text-blue-500">Forgot Password?</a>
                </div>

                <div className="w-full relative">
                    <img src={pwd_icon} width="17px" height="17px" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input type="password" placeholder="••••••••••" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border-2 border-slate-200"/>
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button type="submit" className="p-2 rounded-lg shadow-md bg-green-300 hover:bg-green-200 font-bold text-xl text-white cursor-pointer">Login</button>

            <p className="text-sm">By logging in, you agree to our <a href="#" className="text-blue-500">Terms and Conditions.</a></p>
        </form>
    </div>
  )
}

export default Login
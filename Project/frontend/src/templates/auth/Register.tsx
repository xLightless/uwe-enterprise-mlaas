import React from "react"
import { useState } from 'react'
import mail_icon from '../../assets/mail_icon.svg'
import pwd_icon from '../../assets/pwd_icon.svg'
import pers_icon from '../../assets/pers_icon.svg'
import phone_icon from '../../assets/phone_icon.svg'
import { registerUser, verifyOtp } from '../../repositories/auth'

function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [isOtpSent, setIsOtpSent] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        const userData = { email, password, password2, full_name: fullName, phone_number: phoneNumber }

        try {
            const data = await registerUser(userData)

            console.log('Registered successfully:', data)
            
            setIsOtpSent(true)
        } catch (err) {
            console.error('Error registering:', err)

            setError(err.detail || 'Registration failed')
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const data = await verifyOtp({ phone_number: phoneNumber, otp })

            console.log('OTP verified:', data)
        } catch (err) {
            console.error('OTP error:', err)

            setError(err.detail || 'OTP failed')
        }
    }

  return (
    <div className="flex flex-col justify-center gap-5 rounded-lg container-primary">
        {!isOtpSent ? (
            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                <div className="flex flex-col">
                    <label htmlFor="fullName" className="self-start ml-4">Full Name</label>

                    <div className="w-full relative">
                        <img src={pers_icon} width="17px" height="17px" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="text" placeholder="John Doe" name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border-2 border-slate-200"/>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="emailReg" className="self-start ml-4">Email</label>

                    <div className="w-full relative">
                        <img src={mail_icon} width="17px" height="17px" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="email" placeholder="john.doe@example.co.uk" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border-2 border-slate-200"/>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="passwordReg" className="self-start ml-4">Password</label>

                    <div className="w-full relative">
                        <img src={pwd_icon} width="17px" height="17px" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="password" placeholder="••••••••••" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border-2 border-slate-200"/>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="self-start ml-4">Confirm Password</label>
                    
                    <div className="w-full relative">
                        <img src={pwd_icon} width="17px" height="17px" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="password" placeholder="••••••••••" name="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border-2 border-slate-200"/>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="phoneNumber" className="self-start ml-4">Phone Number</label>

                    <div className="w-full relative">
                        <img src={phone_icon} width="17px" height="17px" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="text" placeholder="7777 777777" name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border-2 border-slate-200"/>
                    </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button type="submit" className="p-2 rounded-lg shadow-md bg-green-300 hover:bg-green-200 font-bold text-xl text-white cursor-pointer">Register</button>

                <p className="text-sm">By signing up, you agree to our <a href="#" className="text-blue-500">Terms and Conditions.</a></p>
            </form>
        ) : (
            <form className="flex flex-col gap-5" onSubmit={handleVerifyOtp}>
                <div className="flex flex-col">
                    <label htmlFor="otp" className="self-start ml-4">Enter OTP</label>

                    <div className="w-full relative">
                        <img src={phone_icon} width="17px" height="17px" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input type="text" placeholder="123456" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border-2 border-slate-200"/>
                    </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button type="submit" className="p-2 rounded-lg shadow-md bg-green-300 hover:bg-green-200 font-bold text-xl text-white cursor-pointer">Verify OTP</button>
            </form>
        )}
    </div>
  )
}

export default Register
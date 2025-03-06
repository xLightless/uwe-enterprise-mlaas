import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthForms from '../../templates/auth/AuthForms'
import close_icon from '../../assets/close.svg'
import burger_icon from '../../assets/burger.svg'

function Nav() {
    const [showAuthForms, setShowAuthForms] = useState(false)
    const [showBurgerMenu, setShowBurgerMenu] = useState(false)

    const toggleAuthForms = () => {
        setShowAuthForms(!showAuthForms)
    };

    const toggleBurgerMenu = () => {
        setShowBurgerMenu(!showBurgerMenu)
    };

    return (
        <>
            <nav className="w-screen p-2 lg:px-52 bg-slate-100">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-5">
                        <div className="h-12 w-12 rounded-lg bg-slate-300"></div>
                        <p className="font-bold text-2xl">Company</p>
                    </div>

                    <div className="hidden md:flex justify-end items-center gap-10">
                        <Link to="/home" className="py-2 border-b-4 border-transparent hover:border-blue-500">Home</Link>
                        <Link to="/contact" className="py-2 border-b-4 border-transparent hover:border-blue-500">Contact</Link>
                        <button onClick={toggleAuthForms} className="hidden md:flex px-4 py-2 rounded-md cursor-pointer text-white bg-blue-500 hover:bg-blue-400">Login</button>
                    </div>

                    <button onClick={toggleBurgerMenu} className="flex md:hidden p-2 rounded-md cursor-pointer"><img src={burger_icon} width="30px" height="30px"/></button>
                </div>
            </nav>

            <div className={`fixed inset-y-0 right-0 bg-slate-100 border-l drop-shadow-lg flex flex-col items-center pt-30 z-50 transition-transform duration-200 ${showBurgerMenu ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: '50%' }}>
                <button onClick={toggleBurgerMenu} className="absolute top-4 right-4"><img src={close_icon} width="30px" height="30px"/></button>
                <Link to="/home" onClick={toggleBurgerMenu} className="text-xl mb-4">Home</Link>
                <Link to="/contact" onClick={toggleBurgerMenu} className="text-xl mb-4">Contact</Link>
                <button onClick={() => { toggleAuthForms(); toggleBurgerMenu(); }} className="px-4 py-2 rounded-md cursor-pointer text-white bg-blue-500 hover:bg-blue-400">Login</button>
            </div>

            {showAuthForms && <AuthForms toggleAuthForms={toggleAuthForms} />}
        </>
    )
}

export default Nav
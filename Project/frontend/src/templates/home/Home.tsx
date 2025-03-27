import React from "react"
import { Link } from 'react-router-dom'
import home_cover from '../../assets/home_cover.jpg'

function Home() {
    return (
        <div className="container-primary">
            <div className="flex justify-end h-[400px] w-screen" style={{backgroundImage: `url(${home_cover})`, backgroundSize: 'cover', backgroundPosition: 'center',}}>
                <div className="flex flex-col justify-center gap-5 p-5 max-w-1/2 bg-gray-500/50 backdrop-blur-sm text-white">
                    <p className="font-bold text-2xl">TITLE</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <Link to="/" className="self-center py-2 px-4 rounded-md text-md text-white bg-blue-500 hover:bg-blue-400">Learn More</Link>
                </div>
            </div>

            <div className="max-w-[1280px] place-self-center">
                <div className="flex flex-col md:flex-row my-10">
                    <div className="flex flex-col items-center justify-start gap-5 p-5">
                        <div className="h-36 w-full border-t-4 border-blue-500 bg-slate-300"></div>
                        <p className="font-bold text-2xl text-blue-500">Section 1</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>

                    <div className="flex flex-col items-center justify-start gap-5 p-5">
                        <div className="h-36 w-full border-t-4 border-blue-500 bg-slate-300"></div>
                        <p className="font-bold text-2xl text-blue-500">Section 2</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>

                    <div className="flex flex-col items-center justify-start gap-5 p-5">
                        <div className="h-36 w-full border-t-4 border-blue-500 bg-slate-300"></div>
                        <p className="font-bold text-2xl text-blue-500">Section 3</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100">
                <div className="w-full max-w-[1280px] place-self-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-20 p-20">
                        <div className="flex flex-col gap-5 text-wrap">
                            <p className="font-bold text-4xl text-blue-500">TITLE</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <Link to="/" className="self-center py-2 px-4 rounded-md text-md text-white bg-blue-500 hover:bg-blue-400">Learn More</Link>
                        </div>

                        <div className="h-64 w-64 rounded-lg bg-slate-300"></div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1280px] place-self-center">
                <div className="flex flex-col md:flex-row gap-10 p-10">
                    <div className="flex flex-col gap-5 bg-slate-100">
                        <div className="h-64 w-full bg-slate-300"></div>
                        <div className="flex flex-col gap-5 p-10">
                            <p className="font-bold text-2xl text-blue-500">TITLE</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <Link to="/" className="self-center py-2 px-4 rounded-md text-md text-white bg-blue-500 hover:bg-blue-400">Learn More</Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 bg-slate-100">
                        <div className="h-64 w-full bg-slate-300"></div>
                        <div className="flex flex-col gap-5 p-10">
                            <p className="font-bold text-2xl text-blue-500">TITLE</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <Link to="/" className="self-center py-2 px-4 rounded-md text-md text-white bg-blue-500 hover:bg-blue-400">Learn More</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
  
  export default Home
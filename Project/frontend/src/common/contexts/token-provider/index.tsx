import React from 'react'
import { faClockRotateLeft, faMailBulk, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { JSX, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Overlay from "../../../components/overlay";
import { loginUser } from "../../../repositories/auth";
import { getUserSessionContext } from "../../../repositories/user";
import { SessionContextProps } from "../../interfaces";
import { checkExpiredSession } from "../../session";
import { useSession } from "../user/session-context";
import { RoleProvider } from '../role';
import { UserProvider } from '../user';

interface TokenProviderProps {
    children: React.ReactNode;
  }

  /**
   * Wraps the application URL's with a provider to monitor session expiration.
   * @param children - The children components to be rendered if session is valid.
   * @returns {JSX.Element} - The wrapped children components.
   */
  const TokenProvider: React.FC<TokenProviderProps> = ({ children }): JSX.Element => {
    const [isTokenExpired, setTokenExpired] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const session = useSession();

    const navigate = useNavigate();

    const validateSessionInterval = 1000; // seconds
    useEffect(() => {
      // Silently listen for session expiration every 5 seconds.
      // If the session is expired, updates the state to trigger the login.
      const interval = setInterval(() => {
        const isSessionTokenExpired = checkExpiredSession();
        // console.log("Session Expired: ", isSessionTokenExpired);
        setTokenExpired(isSessionTokenExpired);

        // console.log("[Session]: ", sessionStorage.getItem("session"));
        // console.log(localStorage.removeItem("session"));

      }, validateSessionInterval);

      return () => clearInterval(interval);
    }, []);
    const [countdown, setCountdown] = useState(0);

    /**
     * Countdown timer of the session expired
     * before redirecting the user to the login page.
     */
    function counter() {
      let current = 3;
      setCountdown(current);
      const timer = setInterval(() => {
        current -= 1;
        setCountdown(current);
        if (current <= 0) {
          clearInterval(timer);
          redirectUser();
        }
      }, 1000);
    }


    function redirectUser() {
      if (isTokenExpired) {
        navigate("/");
      }
    }

    const [isRedirecting, setRedirecting] = useState(false);

    useEffect(() => {
        // Retrieve session state from localStorage on component mount
        const storedSession = sessionStorage.getItem("session");
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          session.updateSessionContext(parsedSession as SessionContextProps);
          setTokenExpired(checkExpiredSession());
        }
    }, []);

    async function reinstateUserSession() {
      try {
          if (isTokenExpired) {
              await loginUser({ email, password });
              setTokenExpired(checkExpiredSession());
              setRedirecting(false);

              if (session.sessionContext === null) {
                  // Clear the old session from localStorage
                  sessionStorage.removeItem("session");

                  // If the token expired, remove the clicked item index from sessionStorage.
                  sessionStorage.removeItem('clickedItemIndex');

                  // Fetch the new session context
                  const userSession = await getUserSessionContext();

                  if (userSession && userSession.data) {
                      // Update the session context
                      session.updateSessionContext(userSession.data as SessionContextProps);

                      // Save the new session context to localStorage
                      sessionStorage.setItem("session", JSON.stringify(userSession.data));
                      console.log("Updated session saved to localStorage:", userSession.data);
                  } else {
                      console.error("Invalid user session data:", userSession);
                  }
              }

              return;
          } else {
              setRedirecting(true);
          }
      } catch (error) {
          console.error("Error reinstating user session:", error);
          setRedirecting(true);
      }
  }

    useEffect(() => {
      // If the session is expired, redirect the user to the home page.
      if (isRedirecting) {
        counter();
      }
    }, [isRedirecting]);


    if (isTokenExpired) {
        return (
          <>
            <Overlay onClose={() => redirectUser()} className='max-w-2xl'>
              <form className="bg-white rounded flex flex-col justify-center items-center p-4 h-fit space-y-12 rounded-md" onSubmit={(e) => {
                e.preventDefault();
                reinstateUserSession();
              }}>
                <div className=''><FontAwesomeIcon icon={faClockRotateLeft} className='text-7xl'/></div>
                <div><h1 className='font-bold text-lg'>Your session has expired, please login again.</h1></div>

                <div className="flex flex-col space-y-4">
                  <div className='h-8'><p className='text-red-400 font-bold'>{countdown !== 0 ? `Login Failed. Redirecting in ${countdown} seconds...` : ""}</p></div>

                  <div className="w-full relative">
                    <FontAwesomeIcon icon={faMailBulk} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input type="email" placeholder="Email Address" name="email" value={email} autoComplete="username" onChange={(e) => setEmail(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border border-slate-200"/>
                  </div>

                  <div className="w-full relative">
                    <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input type="password" placeholder="Password" name="password" value={password} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} className="flex w-full pl-10 p-2 rounded-lg border border-slate-200"/>
                  </div>

                  <button type="submit" className="p-2 rounded-lg shadow-md bg-green-300 hover:bg-green-200 font-bold text-xl text-white cursor-pointer">Login</button>
                </div>
              </form>
            </Overlay>
          </>
        )
    }

    return (
      <UserProvider>
        <RoleProvider>
          <>{children}</>
        </RoleProvider>
      </UserProvider>
    )
};


export default TokenProvider;
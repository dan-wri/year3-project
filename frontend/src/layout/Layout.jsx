import "react"
import {SignedIn, SignedOut, UserButton} from "@clerk/clerk-react"
import {Outlet, Link, Navigate} from "react-router-dom"
import {useState} from "react"

export function Layout(){
    const [showHistoryDropdown, setShowHistoryDropdown] = useState(false)

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="header-content">
                    <h1>FutureSpace AI</h1>
                    <nav>
                        <SignedIn>
                            <Link to="/write">Pro Writer</Link>
                            <Link to="/">Generate Challenge</Link>
                            <div 
                                className="nav-dropdown"
                                onMouseEnter={() => setShowHistoryDropdown(true)}
                                onMouseLeave={() => setShowHistoryDropdown(false)}
                            >
                                <button
                                    className="nav-dropdown-toggle"
                                    style={showHistoryDropdown ? { color: 'grey', cursor: 'default', opacity: 0.6 } : {}}
                                >
                                    History ▾
                                </button>

                                {showHistoryDropdown && (
                                    <div className="nav-dropdown-menu">
                                        <Link to="/challenge-history">Challenge History</Link>
                                        <Link to="/write-history">Pro Writer History</Link>
                                    </div>
                                )}
                            </div>
                            <UserButton/>
                        </SignedIn>
                    </nav>
                </div>
            </header>

            <main className="app-main">
                <SignedOut>
                    <Navigate to="/sign-in" replace/>
                </SignedOut>
                <SignedIn>
                    <Outlet />
                </SignedIn>
            </main>
        </div>
    )
}
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function Layout({ children }) {
    return (
        <div className="flex flex-col-2">
            {/* Showing sidebar in every view */}
            <Sidebar />
            <div>
                {/* Showing header in every view */}
                <Header />
                {children}
            </div>
        </div>
    )
}

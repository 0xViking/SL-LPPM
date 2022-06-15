import Header from "./Header"
import Sidebar from "./Sidebar"

export default function Layout({ children }) {
    return (
        <div className="flex flex-col-2">
            {/* Showing sidebar in every view */}
            <Sidebar />
            <div className="flex-1">
                {/* Showing header in every view */}
                <Header />
                <div className="p-4">{children}</div>
            </div>
        </div>
    )
}

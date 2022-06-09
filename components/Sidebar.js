import Link from "next/link"
import Image from "next/image"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ChartBarIcon, HomeIcon, MenuIcon, XIcon } from "@heroicons/react/outline"

{
    /* Navigation Object */
}
const navigation = [
    { name: "Home", href: "/", icon: HomeIcon, current: true },
    { name: "Liquidity Position", href: "/lpposition", icon: ChartBarIcon, current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(" ")
}

{
    /* Function to change the current varibale in the Navigation object */
}
function changeCurrent(navigation, current) {
    navigation.map((item) =>
        item.name === current ? (item.current = true) : (item.current = false)
    )
}

export default function Sidebar() {
    {
        /* react state variable to know the sidebar status */
    }
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            <div>
                {/* Moving Sidebar mobile view */}
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            {/* Sidebar baground opacity in mobile view */}
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex z-40">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        {/* This is "X" button to close the sidebar in mobile view*/}
                                        <div className="absolute top-0 right-0 -mr-12 pt-20">
                                            <button
                                                type="button"
                                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className="sr-only">Close sidebar</span>
                                                <XIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex-1 h-0 pt-50 pb-4 overflow-y-auto">
                                        {/* Solidus Logo in the Sidebar Mobile view */}
                                        <div className="px-16 pt-4">
                                            <Image
                                                src="/solidusLogo.svg"
                                                alt="Vercel Logo"
                                                width={150}
                                                height={55}
                                            />
                                        </div>
                                        {/* Sidebar Navigation in Mobile view */}
                                        <nav className="mt-5 px-2 space-y-1">
                                            {navigation.map((item) => (
                                                <Link href={item.href} passHref>
                                                    <a
                                                        key={item.name}
                                                        onClick={() => {
                                                            changeCurrent(navigation, item.name)
                                                            setSidebarOpen(false)
                                                        }}
                                                        className={classNames(
                                                            item.current
                                                                ? "bg-gray-100 text-gray-900"
                                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                            "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                                                        )}
                                                    >
                                                        <item.icon
                                                            className={classNames(
                                                                item.current
                                                                    ? "text-gray-500"
                                                                    : "text-gray-400 group-hover:text-gray-500",
                                                                "mr-4 flex-shrink-0 h-6 w-6"
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                        {item.name}
                                                    </a>
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                    {/* Vercel logo in the Sidebar Mobile view */}
                                    <a
                                        className="flex justify-center px-10 py-2 fixed  bottom-0"
                                        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Powered by{" "}
                                        <span className="px-1 py-1">
                                            <Image
                                                src="/vercel.svg"
                                                alt="Vercel Logo"
                                                width={72}
                                                height={16}
                                            />
                                        </span>
                                    </a>
                                </Dialog.Panel>
                            </Transition.Child>
                            <div className="flex-shrink-0 w-14">
                                {/* Forceing sidebar to shrink to fit close icon */}
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 pt-50 overflow-auto">
                    <div className="flex-1 pt-4 flex flex-col min-h-0 border-r border-gray-200 bg-white">
                        {/* Solidus Logo in the Sidebar Desktop view */}
                        <Image src="/solidusLogo.svg" alt="Vercel Logo" width={150} height={55} />
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            {/* Sidebar Navigation in Desktop view */}
                            <nav className="mt-10 flex-1 pt-1 px-2 bg-white space-y-1">
                                {navigation.map((item) => (
                                    <Link href={item.href} passHref>
                                        <a
                                            key={item.name}
                                            onClick={() => changeCurrent(navigation, item.name)}
                                            className={classNames(
                                                item.current
                                                    ? "bg-gray-100 text-gray-900"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                            )}
                                        >
                                            <item.icon
                                                className={classNames(
                                                    item.current
                                                        ? "text-gray-500"
                                                        : "text-gray-400 group-hover:text-gray-500",
                                                    "mr-3 flex-shrink-0 h-6 w-6"
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </a>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        {/* Vercel logo in the Sidebar Desktop view */}
                        <a
                            className="flex justify-center px-10 py-2 fixed  bottom-0"
                            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Powered by{" "}
                            <span className="px-1 py-1">
                                <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                            </span>
                        </a>
                    </div>
                </div>

                {/* Menu Icon in Mobile View */}
                <div className="md:pl-64 flex flex-col flex-1">
                    <div className="fixed top-0 z-10 md:hidden pl-3 pt-3 bg-white">
                        <button
                            type="button"
                            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

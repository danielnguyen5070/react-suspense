import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings, User, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

// Array of menu items
const menuItems = [
    {
        label: 'Data fetching',
        submenu: [
            { label: '01. Throwing Promises', path: '/fetching/throwing-promise' },
            { label: '02. Error Handling', path: '/fetching/error' },
            { label: '03. Formal Status', path: '/fetching/status' },
            { label: '04. Utility', path: '/fetching/utility' },
            { label: '05. use React', path: '/fetching/use-react' },
        ],
    },
    {
        label: 'Dynamic Promises',
        submenu: [
            { label: '01. Promise Cache', path: '/promise/cache' },
            { label: '02. useTransition', path: '/promise/usetransition' },
            { label: '03. Pending Flash', path: '/promise/pending' },
        ],
    },
    {
        label: 'Optimistic UI',
        submenu: [
            { label: '01. Optimistic UI', path: '/optimistic/ui' },
            { label: '02. Form Status', path: '/optimistic/status' },
            { label: '03. Multi-step Actions', path: '/optimistic/actions' },
        ],
    },
    {
        label: 'Suspense img',
        submenu: [
            { label: '01. Img Component', path: '/suspense/img' },
            { label: '02. Img Error Boundary', path: '/suspense/err' },
            { label: '03. Key prop', path: '/suspense/key-prop' },
        ],
    },
    {
        label: 'Responsive',
        submenu: [
            { label: '01. useDeferredValue', path: '/responsive/usedeferredvalue' },
        ],
    },
    {
        label: 'Optimizations',
        submenu: [
            { label: '01. Parallel Loading', path: '/optimization/parallel' },
            { label: '02. Server Cache', path: '/optimization/cache' },
        ],
    },
]

const Sidebar = () => {
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const toggleSubmenu = (name: string) => {
        setOpenSubmenu((prev) => (prev === name ? null : name));
    };

    return (
        <>

            <div
                className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ease-in-out`}
            >
                {/* Main nav */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((menu, index) => (
                        <div key={index}>
                            <button
                                onClick={() => toggleSubmenu(menu.label)}
                                className={`flex my-1 items-center justify-between w-full p-2 rounded-r transition-all duration-300 ease-in-out ${openSubmenu === menu.label ? 'border-l-4 border-blue-500 bg-gray-800' : 'border-l-2 border-transparent hover:border-l-4 hover:border-blue-500 hover:bg-gray-800'
                                    }`}
                            >
                                <span className="flex items-center space-x-3">
                                    <span>{menu.label}</span>
                                </span>
                                {openSubmenu === menu.label ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            <div
                                className={`pl-6 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${openSubmenu === menu.label ? '' : 'max-h-0'
                                    }`}
                            >
                                {menu.submenu.map((item, subIndex) => (
                                    <NavLink
                                        key={subIndex}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `block p-2 my-1 pl-4 rounded-r border-l-4 transition-all duration-300 ease-in-out ${isActive
                                                ? 'border-blue-500 bg-gray-800 text-blue-200'
                                                : 'border-transparent hover:bg-gray-800 hover:border-blue-500'
                                            }`
                                        }
                                        end // Ensures exact matching for active state
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;

import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Fetching from './exercises/01.fetching'
import Dynamic from './exercises/02.dynamic'
import Optimistic from './exercises/03.optimistic'
import Image from './exercises/04.image'
import Responsive from './exercises/05.responsive'
import Optimization from './exercises/06.optimization'

const routes = [
  { path: "/fetching/throwing-promise", element: <Fetching /> },
  { path: "/promise/cache", element: <Dynamic /> },
  { path: "/optimistic/ui", element: <Optimistic /> },
  { path: "/suspense/img", element: <Image /> },
  { path: "/responsive/usedeferredvalue", element: <Responsive /> },
  { path: "/optimization/parallel", element: <Optimization /> },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex">
        <div style={{ display: sidebarOpen ? 'none' : 'block' }} >
          <Sidebar />
        </div>
        <main className={`p-6 flex-1 ${sidebarOpen ? 'ml-0' : 'ml-64'} transition-all duration-300 ease-in-out`}>
          <button
            className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import Fetching01 from './exercises/01.fetching/01.problem.throw'
import Fetching02 from './exercises/01.fetching/02.problem.errors'
import Fetching03 from './exercises/01.fetching/03.problem.status'
import Fetching04 from './exercises/01.fetching/04.problem.util'
import Fetching05 from './exercises/01.fetching/05.problem.use'

import Dynamic01 from './exercises/02.dynamic/01.problem.cache'
import Dynamic02 from './exercises/02.dynamic/02.problem.transition'
import Dynamic03 from './exercises/02.dynamic/03.problem.flash'

import Optimistic01 from './exercises/03.optimistic/01.problem.optimistic'
import Optimistic02 from './exercises/03.optimistic/02.problem.form-status'
import Optimistic03 from './exercises/03.optimistic/03.problem.message'

import Image01 from './exercises/04.image/01.problem.img'
import Image02 from './exercises/04.image/02.problem.error'
import Image03 from './exercises/04.image/03.problem.key'

import Responsive01 from './exercises/05.responsive/01.problem.deferred'

import Optimization01 from './exercises/06.optimization/01.problem.parallel'
import Optimization02 from './exercises/06.optimization/02.problem.cache'

const routes = [
  { path: "/fetching/throwing-promise", element: <Fetching01 /> },
  { path: "/fetching/error", element: <Fetching02 /> },
  { path: "/fetching/status", element: <Fetching03 /> },
  { path: "/fetching/utility", element: <Fetching04 /> },
  { path: "/fetching/use-react", element: <Fetching05 /> },
  { path: "/promise/cache", element: <Dynamic01 /> },
  { path: "/promise/usetransition", element: <Dynamic02 /> },
  { path: "/promise/pending", element: <Dynamic03 /> },
  { path: "/optimistic/ui", element: <Optimistic01 /> },
  { path: "/optimistic/status", element: <Optimistic02 /> },
  { path: "/optimistic/actions", element: <Optimistic03 /> },
  { path: "/suspense/img", element: <Image01 /> },
  { path: "/suspense/err", element: <Image02 /> },
  { path: "/suspense/key-prop", element: <Image03 /> },
  { path: "/responsive/usedeferredvalue", element: <Responsive01 /> },
  { path: "/optimization/parallel", element: <Optimization01 /> },
  { path: "/optimization/cache", element: <Optimization02 /> },
];

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="ml-64 p-6 flex-1">
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

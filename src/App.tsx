import { Routes, Route } from 'react-router-dom'
import { Route as AppRoute } from '@enums'
import NavBar from '@components/NavBar'
import Home from '@pages/Home'
import Favorites from '@pages/Favorites'

const App = () => (
  <div className="min-h-screen bg-gray-950 text-white">
    <NavBar />
    <main className="container mx-auto px-4 py-8">
      <Routes>
        <Route path={AppRoute.Home} element={<Home />} />
        <Route path={AppRoute.Favorites} element={<Favorites />} />
      </Routes>
    </main>
  </div>
)

export default App

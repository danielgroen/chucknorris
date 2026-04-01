import { NavLink } from 'react-router-dom'
import { Route } from '@enums'

const NavBar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-950 ${
      isActive
        ? 'bg-yellow-500 text-gray-950'
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`

  return (
    <nav className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center gap-6">
        <span className="text-yellow-400 font-bold text-xl tracking-tight select-none">
          Chuck Norris Jokes
        </span>
        <div className="flex items-center gap-2">
          <NavLink to={Route.Home} className={linkClass} end>
            Home
          </NavLink>
          <NavLink to={Route.Favorites} className={linkClass}>
            Favorites
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default NavBar

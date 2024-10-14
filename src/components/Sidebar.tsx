import Image from 'next/image'
import Link from 'next/link'
import Logout from './Logout'

interface User {
  image?: string
  name?: string
  email?: string
  role?: 'admin' | 'root' | 'user'
}

interface UserInfoProps {
  user: User
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      {user?.image && (
        <Image
          src={user.image}
          alt={user.name || user.email || 'User'}
          width={80}
          height={80}
          className="rounded-full mb-4 border-4 border-orange-200"
        />
      )}
      
      {user?.name ? (
        <>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {user.name}
          </h1>
          <h2 className="text-sm font-medium text-gray-600">
            {user.email}
          </h2>
        </>
      ) : (
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          {user?.email}
        </h1>
      )}
    </div>
  )
}

interface NavigationButtonsProps {
  currentPage: string
  user: User
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ currentPage, user }) => {
  return (
    <div className="flex flex-col space-y-4 w-full px-4">
      {currentPage !== 'tickets' && (
        <>
          {user?.role === 'admin' || user?.role === 'root' ? (
            <form method="POST" action="/tickets/admin">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Manage tickets
              </button>
            </form>
          ) : (
            <form method="POST" action="/tickets/user">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              >
                Report a problem
              </button>
            </form>
          )}
        </>
      )}

      {currentPage !== 'home' && (
        <Link 
          href="/home" 
          className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg text-center"
        >
          Back to Home
        </Link>
      )}
    </div>
  )
}

interface SidebarProps {
  user: User
  currentPage: string
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentPage }) => {
  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col items-center py-8 fixed top-0 left-0 h-screen">
      <UserInfo user={user} />

      <div className="w-full px-4 mb-8">
        <Logout />
      </div>

      <div className="mt-auto w-full">
        <NavigationButtons currentPage={currentPage} user={user} />
      </div>
    </aside>
  )
}

export default Sidebar
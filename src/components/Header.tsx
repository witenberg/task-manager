import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white">
          <Link href="/" className="hover:text-orange-200 transition duration-300">
            Task Manager
          </Link>
        </h1>
        {/* <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/tasks" 
                className="text-white hover:text-orange-200 transition duration-300 text-lg font-semibold"
              >
                Tasks
              </Link>
            </li>
            <li>
              <Link 
                href="/profile" 
                className="text-white hover:text-orange-200 transition duration-300 text-lg font-semibold"
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav> */}
      </div>
    </header>
  )
}

export default Header
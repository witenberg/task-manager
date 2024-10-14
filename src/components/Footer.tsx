const Footer = () => {
    const currentYear = new Date().getFullYear()
  
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-orange-400">Task Manager</h2>
              <p className="mt-2 text-sm text-gray-400">Organize your life, one task at a time.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition duration-300">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition duration-300">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition duration-300">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            © {currentYear} Task Manager. All rights reserved.
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
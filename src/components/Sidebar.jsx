import Image from 'next/image';
import Logout from './Logout';
import Link from 'next/link';

const UserInfo = ({ user }) => {
  return (
    <>
      {user?.image && (
        <Image
          src={user.image}
          alt={user.name || user.email}
          width={80}
          height={80}
          className="rounded-full mb-4"
        />
      )}
      
      {user?.name ? (
        <>
          <h1 className="text-xl font-semibold text-gray-800 mb-1">
            {user.name}
          </h1>
          <h2 className="text-md font-medium text-gray-600">
            {user.email}
          </h2>
        </>
      ) : (
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          {user?.email}
        </h1>
      )}
    </>
  );
};

const NavigationButtons = ({ currentPage, user }) => {
  return (
    <>
      {currentPage !== 'tickets' && (
        <>
          {user?.role === 'admin' || user?.role === 'root' ? (
            <form method="POST" action="/tickets/admin">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Manage tickets
              </button>
            </form>
          ) : (
            <form method="POST" action="/tickets/user">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Report a problem
              </button>
            </form>
          )}
        </>
      )}

      {currentPage !== 'home' && (
        <Link href="/home" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4">
          Back to Home
        </Link>
      )}
    </>
  );
};

const Sidebar = ({ user, currentPage }) => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col items-center py-6 fixed top-0 left-0 h-screen">
      <UserInfo user={user} />

      <Logout />

      <div className="mt-auto">
        <NavigationButtons currentPage={currentPage} user={user} />
      </div>
    </aside>
  );
};

export default Sidebar;

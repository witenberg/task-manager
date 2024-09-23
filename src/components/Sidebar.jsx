import Image from 'next/image';
import Logout from './Logout';
import Link from 'next/link';

const Sidebar = ({ user, currentPage }) => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col items-center py-6 fixed top-0 left-0 h-screen">
      {user?.image && user?.name ? (
        <>
          <Image
            src={user?.image}
            alt={user?.name}
            width={80}
            height={80}
            className="rounded-full mb-4"
          />
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            {user?.name}
          </h1>
        </>
      ) : (
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          {user?.email}
        </h1>
      )}

      <Logout />

      <div className="mt-auto">
        {currentPage !== 'tickets' && (
          <>
            {user?.role === 'admin' ? (
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
      </div>
    </aside>
  );
};

export default Sidebar;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import adminService from '@/services/adminUserService';

// const UserList = () => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const data = await adminService.getAllUsers();
//         setUsers(data);
//       } catch (err) {
//         console.error('Failed to fetch users:', err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleRowClick = (username) => {
//     navigate(`/users/${username}`);
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">👥 All Users</h2>
//       <div className="overflow-x-auto rounded-xl shadow-md">
//         <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-900">
//           <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase font-semibold">
//             <tr>
//               <th className="p-4 text-left w-12">#</th>
//               <th className="p-4 text-left">Photo</th>
//               <th className="p-4 text-left">Name</th>
//               <th className="p-4 text-left">Country</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//             {users.map((u, index) => (
//               <tr
//                 key={index}
//                 onClick={() => handleRowClick(u.username)}
//                 className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
//               >
//                 <td className="p-4 font-semibold text-center text-gray-500 dark:text-gray-400">
//                   {index + 1}
//                 </td>
//                 <td className="p-4">
//                   <img
//                     src={`http://localhost:8080/uploads/${u.photoUrl}`}
//                     alt="profile"
//                     className="w-10 h-10 rounded-full object-cover border shadow"
//                     onError={(e) => {
//                       e.target.src = 'http://localhost:8080/uploads/default.png';
//                     }}
//                   />
//                 </td>
//                 <td className="p-4 font-medium text-blue-800">
//                   {u.firstName || ''} {u.lastName || ''} <br />
//                   <span className="text-sm text-gray-500">@{u.username}</span>
//                 </td>
//                 <td className="p-4">{u.country || '-'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserList;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '@/services/adminUserService';

// Make sure flag-icons CSS is imported once in your app (ProfilePage already imports it)
// If you want here, import again or just ensure it’s imported in a shared place
import 'flag-icons/css/flag-icons.min.css';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleRowClick = (username) => {
    navigate(`/users/${username}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">👥 All Users</h2>
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-900">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase font-semibold">
            <tr>
              <th className="p-4 text-left w-12">#</th>
              <th className="p-4 text-left">Photo</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Country</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((u, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(u.username)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
              >
                <td className="p-4 font-semibold text-center text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="p-4">
                  <img
                    src={`http://localhost:8080/uploads/${u.photoUrl}`}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border shadow"
                    onError={(e) => {
                      e.target.src = 'http://localhost:8080/uploads/default.png';
                    }}
                  />
                </td>
                <td className="p-4 font-medium text-blue-800">
                  {u.firstName || ''} {u.lastName || ''} <br />
                  <span className="text-sm text-gray-500">@{u.username}</span>
                </td>
                <td className="p-4 flex items-center space-x-2">
                  {u.country ? (
                    <>
                      <span className={`fi fi-${u.country.toLowerCase()}`}></span>
                      <span>{u.country}</span>
                    </>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;


// import React, { useState, useEffect } from 'react';
// import userService from '@/services/userService';

// const EditProfileForm = () => {
//   const [form, setForm] = useState({ username: '', email: '' });

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const user = await userService.getMyProfile();
//       setForm({ username: user.username, email: user.email });
//     };
//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await userService.updateProfile(form);
//     alert('Profile updated!');
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label>Username</label>
//         <input
//           name="username"
//           value={form.username}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />
//       </div>
//       <div>
//         <label>Email</label>
//         <input
//           name="email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />
//       </div>
//       <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
//         Update Profile
//       </button>
//     </form>
//   );
// };

// export default EditProfileForm;

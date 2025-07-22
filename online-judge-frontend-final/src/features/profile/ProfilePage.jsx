// import React, { useState, useEffect } from 'react';
// import userService from '@/services/userService';
// import ActivityGraph from './ActivityGraph';
// import imageCompression from 'browser-image-compression';
// import Select from 'react-select';
// import countryList from 'react-select-country-list';
// import 'flag-icons/css/flag-icons.min.css';

// const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

// const ProfilePage = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [success, setSuccess] = useState(''); // ✅ for success message

//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', username: '',
//     email: '', contact: '', country: '', description: '',
//   });

//   const countries = countryList().getData().map(c => ({
//     value: c.value,
//     label: c.label,
//   }));

//   useEffect(() => {
//     (async () => {
//       try {
//         const user = await userService.getProfile();
//         setProfile(user);
//         setFormData({
//           firstName: user.firstName || '',
//           lastName: user.lastName || '',
//           username: user.username || '',
//           email: user.email || '',
//           contact: user.contact || '',
//           country: user.country || '',
//           description: user.description || '',
//         });
//       } catch (e) {
//         console.error(e);
//         setError('Failed to load profile');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const showSuccess = (message) => {
//     setSuccess(message);
//     setTimeout(() => setSuccess(''), 2500); // auto-hide after 2.5s
//   };

//   const handleImageChange = async e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     try {
//       const processed = file.size > MAX_IMAGE_SIZE
//         ? await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1024 })
//         : file;
//       setImageFile(processed);
//       showSuccess(file.size > MAX_IMAGE_SIZE
//         ? "Large image compressed automatically."
//         : "Image selected.");
//     } catch (err) {
//       console.error(err);
//       setError("Image processing failed.");
//     }
//   };

//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(data => ({ ...data, [name]: value }));
//   };

//   const handleCountryChange = option => {
//     setFormData(data => ({ ...data, country: option.value }));
//   };

//   const handleSave = async e => {
//     e.preventDefault();
//     const form = new FormData();
//     const payload = {
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       contact: formData.contact,
//       country: formData.country,
//       description: formData.description,
//     };

//     form.append("data", JSON.stringify(payload));
//     if (imageFile) form.append("image", imageFile);

//     try {
//       await userService.updateProfile(form);
//       const user = await userService.getProfile();
//       setProfile(user);
//       setEditMode(false);
//       showSuccess('Profile updated successfully!');
//     } catch (err) {
//       console.error(err);
//       setError('Save failed.');
//     }
//   };

//   if (loading) return <div className="p-6">Loading…</div>;
//   if (error) return <div className="p-6 text-red-500">{error}</div>;

//   const imgSrc = profile.photoUrl.startsWith('/')
//     ? `http://localhost:8080${profile.photoUrl}`
//     : 'http://localhost:8080/uploads/default.png';

//   const selectedCountry = countries.find(c => c.value === formData.country);

//   return (
//     <div className="p-6 max-w-3xl mx-auto space-y-8">
//       {/* ✅ Success message */}
//       {success && (
//         <div className="bg-green-100 text-green-800 px-4 py-2 rounded shadow text-sm font-medium transition-all duration-300">
//           {success}
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">My Profile</h1>
//         <button 
//           className="bg-primary text-white px-4 py-2 rounded"
//           onClick={() => setEditMode(prev => !prev)}
//         >
//           {editMode ? 'Cancel' : 'Edit Profile'}
//         </button>
//       </div>

//       {/* Form + Image */}
//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="flex-1 space-y-4">
//           {!editMode ? (
//             <div className="flex flex-col space-y-2">
//               {[['Username', profile.username], ['Email', profile.email], ['Name', `${profile.firstName} ${profile.lastName}`],
//                 ['Contact', profile.contact], ['Country', profile.country || 'Not set'], ['Bio', profile.description],
//                 ['Role', profile.role], ['Joined', profile.date]].map(([label, value]) => (
//                 <div key={label} className="flex">
//                   <span className="w-28 font-medium text-gray-700">{label}:</span>
//                   <span className="text-gray-900">{value || '-'}</span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <form onSubmit={handleSave} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleFieldChange} className="input w-full" />
//                 <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleFieldChange} className="input w-full" />
//                 <input name="username" value={formData.username} readOnly disabled className="input w-full bg-gray-100" />
//                 <input name="email" value={formData.email} readOnly disabled className="input w-full bg-gray-100" />
//                 <input name="contact" placeholder="Contact" value={formData.contact} onChange={handleFieldChange} className="input w-full" />
//                 <div className="col-span-2">
//                   <Select 
//                     options={countries} 
//                     value={selectedCountry}
//                     onChange={handleCountryChange}
//                     placeholder="Select country"
//                   />
//                 </div>
//               </div>
//               <textarea name="description" placeholder="Bio / Description"
//                 value={formData.description}
//                 onChange={handleFieldChange}
//                 className="input w-full" rows="3" />
//               <input type="file" accept="image/*"
//                 onChange={handleImageChange}
//                 className="file-input" />
//               <button type="submit"
//                 className="bg-primary text-white px-4 py-2 rounded">
//                 Save Changes
//               </button>
//             </form>
//           )}
//         </div>

//         <div className="flex-shrink-0 self-start">
//           <img src={imageFile ? URL.createObjectURL(imageFile) : imgSrc}
//             alt="Profile"
//             className="w-40 h-40 object-cover rounded-full border" />
//         </div>
//       </div>

//       {/* Activity Graph */}
//       <div>
//         <ActivityGraph />
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useState, useEffect } from 'react';
import userService from '@/services/userService';
import ActivityGraph from './ActivityGraph';
import imageCompression from 'browser-image-compression';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import 'flag-icons/css/flag-icons.min.css'; // ✅ Flag icon styles

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', username: '',
    email: '', contact: '', country: '', description: '',
  });

  const countries = countryList().getData().map(c => ({
    value: c.value,
    label: (
      <div className="flex items-center gap-2">
        <span className={`fi fi-${c.value.toLowerCase()}`} />
        <span>{c.label}</span>
      </div>
    ),
  }));

  useEffect(() => {
    (async () => {
      try {
        const user = await userService.getProfile();
        setProfile(user);
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          username: user.username || '',
          email: user.email || '',
          contact: user.contact || '',
          country: user.country || '',
          description: user.description || '',
        });
      } catch (e) {
        console.error(e);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 2500);
  };

  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const processed = file.size > MAX_IMAGE_SIZE
        ? await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1024 })
        : file;
      setImageFile(processed);
      showSuccess(file.size > MAX_IMAGE_SIZE
        ? "Large image compressed automatically."
        : "Image selected.");
    } catch (err) {
      console.error(err);
      setError("Image processing failed.");
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleCountryChange = option => {
    setFormData(data => ({ ...data, country: option.value }));
  };

  const handleSave = async e => {
    e.preventDefault();
    const form = new FormData();
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      contact: formData.contact,
      country: formData.country,
      description: formData.description,
    };

    form.append("data", JSON.stringify(payload));
    if (imageFile) form.append("image", imageFile);

    try {
      await userService.updateProfile(form);
      const user = await userService.getProfile();
      setProfile(user);
      setEditMode(false);
      showSuccess('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Save failed.');
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const imgSrc = profile.photoUrl.startsWith('/')
    ? `http://localhost:8080${profile.photoUrl}`
    : 'http://localhost:8080/uploads/default.png';

  const selectedCountry = countries.find(c => c.value === formData.country);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {success && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded shadow text-sm font-medium transition-all duration-300">
          {success}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button 
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setEditMode(prev => !prev)}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {!editMode ? (
            <div className="flex flex-col space-y-2">
              {[
                ['Username', profile.username],
                ['Email', profile.email],
                ['Name', `${profile.firstName} ${profile.lastName}`],
                ['Contact', profile.contact],
                ['Country',
                  profile.country
                    ? (
                      <div className="flex items-center gap-2">
                        <span className={`fi fi-${profile.country.toLowerCase()}`} />
                        <span>{countryList().getLabel(profile.country)}</span>
                      </div>
                    )
                    : 'Not set'
                ],
                ['Bio', profile.description],
                ['Role', profile.role],
                ['Joined', profile.date],
              ].map(([label, value]) => (
                <div key={label} className="flex">
                  <span className="w-28 font-medium text-gray-700">{label}:</span>
                  <span className="text-gray-900">{value || '-'}</span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleFieldChange} className="input w-full" />
                <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleFieldChange} className="input w-full" />
                <input name="username" value={formData.username} readOnly disabled className="input w-full bg-gray-100" />
                <input name="email" value={formData.email} readOnly disabled className="input w-full bg-gray-100" />
                <input name="contact" placeholder="Contact" value={formData.contact} onChange={handleFieldChange} className="input w-full" />
                <div className="col-span-2">
                  <Select 
                    options={countries} 
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    getOptionLabel={e => e.label}
                    getOptionValue={e => e.value}
                    placeholder="Select country"
                  />
                </div>
              </div>
              <textarea name="description" placeholder="Bio / Description"
                value={formData.description}
                onChange={handleFieldChange}
                className="input w-full" rows="3" />
              <input type="file" accept="image/*"
                onChange={handleImageChange}
                className="file-input" />
              <button type="submit"
                className="bg-primary text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </form>
          )}
        </div>

        <div className="flex-shrink-0 self-start">
          <img src={imageFile ? URL.createObjectURL(imageFile) : imgSrc}
            alt="Profile"
            className="w-40 h-40 object-cover rounded-full border" />
        </div>
      </div>

      <div>
        <ActivityGraph />
      </div>
    </div>
  );
};

export default ProfilePage;

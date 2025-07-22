import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'flag-icons/css/flag-icons.min.css';  // ✅ Import flag-icons CSS

const UserPublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${username}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [username]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!profile) return <div className="p-6">Loading…</div>;

  const imgSrc = profile.photoUrl?.startsWith('/')
    ? `http://localhost:8080${profile.photoUrl}`
    : 'http://localhost:8080/uploads/default.png';

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-6">
        <img
          src={imgSrc}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
          <p className="text-gray-600">@{profile.username}</p>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            {profile.country ? (
              <>
                <span className={`fi fi-${profile.country.toLowerCase()}`}></span>
                <span>{profile.country}</span>
              </>
            ) : (
              'Country not set'
            )}
          </p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg">About</h3>
        <p className="text-gray-800">{profile.description || 'No description provided.'}</p>
      </div>
    </div>
  );
};

export default UserPublicProfile;

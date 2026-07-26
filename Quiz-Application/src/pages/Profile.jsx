function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Profile</h1>

        <h2>{user?.name}</h2>

        <p>{user?.email}</p>
      </div>
    </div>
  );
}

export default Profile;
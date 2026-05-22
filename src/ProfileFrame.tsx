import React from "react";

export default function ProfileFrame({ user, notes }) {
  const totalNotes = notes.length;
  const deletedNotes = notes.filter(n => n.deleted).length;
  const activeNotes = totalNotes - deletedNotes;

  return (
    <div className="frame fade-in" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 className="title">Your Profile</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={user.photoURL || "https://via.placeholder.com/100"}
          alt="avatar"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            marginBottom: "10px"
          }}
        />
        <h2>{user.displayName || "Unnamed User"}</h2>
        <p style={{ opacity: 0.7 }}>{user.email}</p>
      </div>

      <h3 style={{ color: "#ffd700" }}>Your Stats</h3>
      <ul>
        <li>Total notes: {totalNotes}</li>
        <li>Active notes: {activeNotes}</li>
        <li>Deleted notes: {deletedNotes}</li>
      </ul>

      <p style={{ marginTop: "20px", opacity: 0.7 }}>
        Member since: {new Date(user.metadata.creationTime).toLocaleDateString()}
      </p>
    </div>
  );
}

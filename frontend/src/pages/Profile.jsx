import React, { useEffect, useState } from "react";
import { getThemeByRole } from "../theme";
import bgImg from "../assets/bgprofile.png";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Modal states
  const [showEdit, setShowEdit] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("https://mini-project-2-mwwk.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load profile");
        setUser(json.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-gray-950">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-400 bg-gray-950">{error}</div>;
  if (!user) return null;

  const theme = getThemeByRole(user.role);

  return (
    <div
      className={`min-h-screen ${theme.bg} text-white p-6 bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* EDIT PROFILE MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[380px] shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <input
              className="w-full mb-3 p-2 bg-gray-800 rounded outline-none border border-gray-700"
              placeholder="Username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />

            <input
              className="w-full mb-4 p-2 bg-gray-800 rounded outline-none border border-gray-700"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            <button
              className="bg-blue-600 px-4 py-2 rounded mr-2 hover:bg-blue-700"
              onClick={async () => {
                await fetch("https://mini-project-2-mwwk.onrender.com/api/auth/update", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify(form),
                });
                setShowEdit(false);
                window.location.reload();
              }}
            >
              Save
            </button>

            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600" onClick={() => setShowEdit(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPass && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[380px] shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            <input
              className="w-full mb-3 p-2 bg-gray-800 rounded outline-none border border-gray-700"
              placeholder="Old Password"
              type="password"
              onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            />

            <input
              className="w-full mb-4 p-2 bg-gray-800 rounded outline-none border border-gray-700"
              placeholder="New Password"
              type="password"
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />

            <button
              className="bg-green-600 px-4 py-2 rounded mr-2 hover:bg-green-700"
              onClick={async () => {
                await fetch("https://mini-project-2-mwwk.onrender.com/api/auth/change-password", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                  body: JSON.stringify(passwordForm),
                });
                setShowPass(false);
              }}
            >
              Update
            </button>

            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600" onClick={() => setShowPass(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto mt-20">
        <div className={`${theme.card} rounded-2xl p-6 shadow-xl bg-black/50 backdrop-blur-sm`}>
          <h1 className={`text-3xl font-bold mb-2 ${theme.accent}`}>Profile</h1>
          <p className="text-gray-300 mb-6">Manage your account</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-gray-400 text-sm">Name</div>
              <div className="text-xl font-semibold">{user.username}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Email</div>
              <div className="text-xl font-semibold">{user.email}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Role</div>
              <div className="text-xl font-semibold capitalize">{user.role}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">User ID</div>
              <div className="text-sm font-mono break-all">{user._id}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">XP</div>
              <div className="text-xl font-semibold">{user.xp ?? 0}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Streak</div>
              <div className="text-xl font-semibold">{user.streak ?? 0} days</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-gray-400 text-sm">Badges</div>
              <div className="text-sm">{(user.badges||[]).join(', ') || '-'}</div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              className={`px-5 py-3 rounded-lg ${theme.button} ${theme.ring}`}
              onClick={() => {
                setForm({ username: user.username, email: user.email });
                setShowEdit(true);
              }}
            >
              Edit Profile
            </button>

            <button
              className="px-5 py-3 rounded-lg bg-gray-700 border border-gray-600"
              onClick={() => setShowPass(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from "react";

const CLIENT_ID = "1088003588585-qtnukm16fdb25k1s695fhflnu79r426s.apps.googleusercontent.com";

export default function GoogleButton({ role = "user" }) {
  const divRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      /* global google */
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          try {
            const res = await fetch("http://localhost:5000/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: response.credential, role }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Google sign-in failed");
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("role", data.user.role);
            window.location.href = role === 'admin' ? '/admindashboard' : '/userdashboard';
          } catch (e) {
            alert(e.message);
          }
        },
      });
      window.google.accounts.id.renderButton(divRef.current, { theme: "outline", size: "large" });
    };
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, [role]);

  return (
    <div ref={divRef} />
  );
}




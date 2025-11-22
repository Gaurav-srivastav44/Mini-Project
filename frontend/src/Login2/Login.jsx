import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaLock } from "react-icons/fa";
import Alert from "./alert";
import GoogleButton from "./GoogleButton";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Too Short!").required("Password is required"),
  role: Yup.string().oneOf(["user", "admin"]).required("Role is required"),
});

export default function Login({ isLogin = true }) {
  const navigate = useNavigate();
  const initialValues = { email: "", password: "", role: "user" };
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post("https://mini-project-2-mwwk.onrender.com/api/auth/login", {
        email: values.email,
        password: values.password,
        role: values.role,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      setAlert({ type: "success", message: "Login successful 🎉" });
      setTimeout(() => setAlert(null), 3000);

      // Redirect based on role
      if (user.role === "admin") navigate("/admindashboard");
      else navigate("/userdashboard");
    } catch (error) {
      const errMsg = error.response?.data?.error || "Login failed, try again.";
      setErrors({ password: errMsg });
      setAlert({ type: "error", message: errMsg });
      setTimeout(() => setAlert(null), 5000);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative px-4">
      <div className="absolute inset-0 bg-black backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-black rounded-2xl shadow-xl backdrop-blur-lg overflow-hidden p-8">
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {/* Header */}
        <div className="flex justify-center mb-6">
          <FaUserCircle className="text-white text-6xl sm:text-7xl" />
        </div>
        <div className="text-center mb-6">
          <p className="text-white/80 text-sm sm:text-base mt-2">
            {isLogin
              ? "Log in to access your account and enjoy our services."
              : "Create your account and start exploring endless possibilities."}
          </p>
        </div>

        {/* Google */}
        <div className="flex justify-center mb-4">
          <GoogleButton />
        </div>

        {/* Form */}
        <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, values, handleChange }) => (
            <Form className="w-full space-y-4">
              {/* Role Toggle */}
              <div className="mb-4 flex relative bg-white/10 rounded-full p-1 text-white font-medium">
                <AnimatePresence mode="wait">
                  {["user", "admin"].map((role) => (
                    <motion.label
                      key={role}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 text-center py-2 cursor-pointer select-none z-10"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={values.role === role}
                        onChange={handleChange}
                        className="hidden"
                      />
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </motion.label>
                  ))}
                </AnimatePresence>
                <motion.div
                  layout
                  className="absolute top-0 left-0 h-full bg-cyan-600/30 rounded-full"
                  style={{ width: "50%", left: values.role === "user" ? "0%" : "50%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FaUserCircle className="absolute left-3 top-3 text-white" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-white bg-transparent text-white placeholder-white focus:outline-none"
                />
                <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-white" />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-white bg-transparent text-white placeholder-white focus:outline-none"
                />
                <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white font-semibold shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </motion.button>
            </Form>
          )}
        </Formik>

        <p className="text-white/70 text-sm mt-5 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

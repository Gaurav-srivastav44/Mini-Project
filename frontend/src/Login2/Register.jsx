import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaLock, FaEnvelope } from "react-icons/fa";
import Alert from "./alert";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Too Short!").required("Password is required"),
  role: Yup.string().oneOf(["user", "admin"]).required("Role is required"),
});

export default function Register() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const initialValues = { username: "", email: "", password: "", role: "user" };

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      const res = await axios.post("https://mini-project-2-mwwk.onrender.com/api/auth/signup", {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      if (res.status === 201 || res.status === 200) {
        setAlert({ type: "success", message: "Registration successful 🎉" });
        resetForm();
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || "Registration failed, try again.";
      setErrors({ email: errMsg });
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

        <div className="flex justify-center mb-6">
          <FaUserCircle className="text-white text-6xl sm:text-7xl" />
        </div>

        <div className="text-center mb-6">
          <h2 className="font-extrabold text-3xl sm:text-4xl text-white">Create Account</h2>
          <p className="text-white/80 text-sm sm:text-base mt-2">Sign up to start.</p>
        </div>

        <Formik initialValues={initialValues} validationSchema={RegisterSchema} onSubmit={handleSubmit}>
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

              {/* Username */}
              <div className="relative">
                <FaUserCircle className="absolute left-3 top-3 text-white" />
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-white bg-transparent text-white placeholder-white focus:outline-none"
                />
                <ErrorMessage name="username" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              {/* Email */}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-white" />
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
                {isSubmitting ? "Registering..." : "Register"}
              </motion.button>
            </Form>
          )}
        </Formik>

        <p className="text-white/70 text-sm mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    username: yup.string().required("Must enter a username"),
    email: yup.string().email("Invalid email").required("Must enter email"),
    password: yup.string().required("Must enter a password").min(6, "Password must be at least 6 characters long"),
    password2: yup.string().oneOf([yup.ref('password'), null], "Passwords must match").required("Must confirm password")
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      password2: ""
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("http://127.0.0.1:5555/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === "User registration Successful") {
          alert("Registration successful!");
          navigate('/home');
        } else {
          alert(data.msg);
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
      });
    },
  });

  return (
    <div className="signup-container">
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username ? (
          <p className="error-message">{formik.errors.username}</p>
        ) : null}

        <label htmlFor="email">Email Address</label>
        <br />
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="error-message">{formik.errors.email}</p>
        ) : null}
        
        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="error-message">{formik.errors.password}</p>
        ) : null}
        
        <label htmlFor="password2">Confirm Password</label>
        <br />
        <input
          id="password2"
          name="password2"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password2}
        />
        {formik.touched.password2 && formik.errors.password2 ? (
          <p className="error-message">{formik.errors.password2}</p>
        ) : null}
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Signup;

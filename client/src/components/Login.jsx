import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Must enter email"),
    password: yup.string().required("Must enter a password")
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      fetch("http://127.0.0.1:5555/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('refresh_token', data.refresh_token);
            alert("Login successful!");
            navigate('/home');
            resetForm();
          } else {
            alert(data.msg);
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
        });
    },
  });

  return (
    <div className="login-container">
      <form onSubmit={formik.handleSubmit}>
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

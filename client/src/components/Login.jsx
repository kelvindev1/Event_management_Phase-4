import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function Login() {
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
    onSubmit: (values) => {
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
          // Save token and refresh token (consider using localStorage or cookies)
          localStorage.setItem('token', data.token);
          localStorage.setItem('refresh_token', data.refresh_token);
          alert("Login successful!");
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
    <div>
      <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
        <label htmlFor="email">Email Address</label>
        <br />
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <p style={{ color: "red" }}>{formik.errors.email}</p>
        
        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <p style={{ color: "red" }}>{formik.errors.password}</p>
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

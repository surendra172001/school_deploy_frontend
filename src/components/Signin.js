import React, { useState } from "react";
import { isSignedIn, signIn, authenticate, ROLES } from "../helper";
import { Navigate } from "react-router-dom";
import Base from "./Base";

export default function Signin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    loading: false,
    didRedirect: false,
    error: "",
  });
  const handleChange = (propName) => (event) => {
    if (event.target.files === null) {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setValues({ ...values, [propName]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true });
    try {
      const data = await signIn(values.email, values.password);
      if (data.error) {
        // console.log(values.error);
        setValues({ ...values, loading: false, error: data.error });
      } else {
        authenticate(data);
        setValues({ ...values, loading: false, didRedirect: true });
      }
    } catch (error) {
      setValues({ ...values, error, loading: false });
      console.log(error);
    }
  };

  const performRedirect = () => {
    const { user } = isSignedIn();
    if (values.didRedirect || user) {
      if (user && user.role === ROLES.ADMIN) {
        return <Navigate to="/admin" />;
      } else if (user.role === ROLES.TEACHER) {
        return <Navigate to="/teacher" />;
      } else {
        return <Navigate to="/" />;
      }
    }
    if (isSignedIn()) {
      return <Navigate to="/" />;
    }
  };

  const signinForm = () => (
    <div className="border border-success border-5 my-5 p-md-5 w-sm-100 w-md-75 w-lg-50 rounded">
      <div className="container d-flex flex-column">
        {values.error && (
          <div
            className="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            <strong>{values.error}</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}
        <form
          action="/signin"
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className="row mb-3">
            <label htmlFor="email" className="col-sm-3 col-form-label">
              Email
            </label>
            <div className="col-sm-6">
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange("email")}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="password" className="col-sm-3 col-form-label">
              Password
            </label>
            <div className="col-sm-6">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                value={values.password}
                onChange={handleChange("password")}
              />
            </div>
          </div>
          <div className="d-flex flex-column align-items-center mb-2">
            <button type="submit" className="btn btn-success">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <Base
      title="Signin Page"
      className="d-flex align-items-center justify-content-center flex-column"
    >
      <>
        {performRedirect()}
        {signinForm()}
      </>
    </Base>
  );
}

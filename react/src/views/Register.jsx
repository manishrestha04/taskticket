import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function Register() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({ __html: "" });
    const history = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user-info")) {
            history("/");
        }
    }, []);

    async function register() {
        let item = { name, email, password };

        try {
            let result = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                body: JSON.stringify(item),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            let data = await result.json();

            // If registration fails (check if there's an error in the response)
            if (!result.ok) {
                if (data.errors) {
                    // Laravel validation errors
                    setErrors(data.errors);
                } else {
                    // General errors (e.g., server errors)
                    setErrors({ server: data.error });
                }
            } else {
                // Registration successful, store user info and redirect
                localStorage.setItem("user-info", JSON.stringify(data.user));
                localStorage.setItem("token", data.access_token);
                history("/");
            }
        } catch (error) {
            // Handle any other errors (e.g., network issues)
            setErrors({
                server: "An unexpected error occurred. Please try again.",
            });
        }
    }

    return (
        <>
            <Header />
            <div className="col-sm-3 offset-sm-4">
                <h3>Create New ID</h3>
                <br />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control mb-3"
                    placeholder="Enter Name"
                />
                {errors.name && (
                    <div className="text-danger">{errors.name}</div>
                )}

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control mb-3"
                    placeholder="Enter Email"
                />
                {errors.email && (
                    <div className="text-danger">{errors.email}</div>
                )}

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control mb-3"
                    placeholder="Enter Password"
                />
                {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                )}

                <button onClick={register} className="btn btn-primary w-100">
                    Sign Up
                </button>
            </div>
        </>
    );
}

export default Register;

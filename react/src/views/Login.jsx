import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user-info")) {
            navigate("/");
        }
    }, []);

    async function login() {
        console.warn(email, password);

        let item = {email, password};
        let result = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(item),
        });
        result = await result.json();

        if (result.error){
          setError("Email or password is incorrect");
        }else {
          localStorage.setItem("user-info", JSON.stringify(result.user));
          localStorage.setItem("token", result.access_token)
          navigate("/");
        }
        
    }

    return (
        <>
            <Header />
            <div>
                
                <div className="col-sm-3 offset-sm-4">
                <h3>Please Login with your ID</h3>
                <br/>
                    <input
                        type="text"
                        placeholder="Email Address"
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <button onClick={login} className="btn btn-primary w-100">
                        Login
                    </button>
                </div>
            </div>
        </>
    );
}

export default Login;

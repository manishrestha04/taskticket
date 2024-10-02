import React, { useEffect, useState } from "react";
import Header from "../views/Header";
import { useNavigate } from "react-router-dom";

function AddTicket() {
    const [request, setRequest] = useState("");
    const [file, setFile] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignto, setAssignto] = useState("");
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});

    const navigate=useNavigate();

    useEffect(()=>{
        fetchUsers();
    }, []);

    async function fetchUsers()
    {
        let result = await fetch('http://localhost:8000/api/users');
        result = await result.json();
        setUsers(result);
    }


    function validateForm() {
        let formErrors = {};

        if (!request) formErrors.request = "Request type is required.";
        if (!title) formErrors.title = "Title is required.";
        if (!description) formErrors.description = "Description is required.";
        //if (!file) formErrors.file = "Please upload a file.";
        if (!assignto) formErrors.assignto = "Please select a user to assign the ticket to.";

        setErrors(formErrors);

        // Return true if there are no errors
        return Object.keys(formErrors).length === 0;
    }



    async function addTickets() {
        if (!validateForm()) {
            return;
        }
        
        let item = { request, file, title, description, assignto};
        console.warn(item);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("request", request);
        formData.append("description", description);
        formData.append("assignto", assignto);


        let token = localStorage.getItem('token');
        let result = await fetch("http://localhost:8000/api/addticket", {
            method: "POST",
            headers:{
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });
        if (result.ok) {
            alert("Data has been saved");
            navigate("/");
        } else {
            alert("There was an error submitting the ticket.");
        }
    }

    return (
        <div>
            <Header />
            
            <div className="col-sm-3 offset-sm-4">
            <h2>Add Ticket</h2>
                <br />
                <input
                    type="text"
                    onChange={(e) => setRequest(e.target.value)}
                    className="form-control"
                    placeholder="Enter Request Type"
                />
                {errors.request && <div style={{ color: "red" }}>{errors.request}</div>}
                <br />
                <input
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    placeholder="Enter Title"
                />
                {errors.title && <div style={{ color: "red" }}>{errors.title}</div>}
                <br />
                <input
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    placeholder="Enter Description"
                />
                {errors.description && <div style={{ color: "red" }}>{errors.description}</div>}
                <br />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="form-control"
                    placeholder="Choose an Image (optional)"
                />
                <br />
                <select
                    value={assignto}
                    onChange={(e) => {
                        setAssignto(e.target.value)
                        setErrors({...errors, assignto:""});
                    }}
                    className="form-control"
                >
                    <option value="">Assign To</option>
                    {users.map((user)=>(
                        <option key={user.id} value={user.email}>
                            {user.email}
                        </option>
                    ))}  
                </select>
                {errors.assignto && <div style={{ color: "red" }}>{errors.assignto}</div>}
                <br />
                <button onClick={addTickets} className="btn btn-primary">
                    Open Ticket
                </button>
            </div>
        </div>
    );
}

export default AddTicket;

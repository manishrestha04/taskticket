import  { useEffect, useState } from "react";
import Header from "../views/Header";
import { Table } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function ClosedTickets() {
    const [closedTickets, setClosedTickets] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const user = JSON.parse(localStorage.getItem("user-info"));
        let result = await fetch("http://localhost:8000/api/closed-tickets");
        result = await result.json();

        // Filter for closed tickets assigned to the logged-in user
        const myClosedTickets = result.filter(
            (ticket) => ticket.assignto === user.email && ticket.status === "Closed"
        );
        setClosedTickets(myClosedTickets);
        setFilteredData(myClosedTickets);
    }

    // Function to handle search/filter logic
    function handleSearch(event) {
        const searchValue = event.target.value;
        setSearchKey(searchValue);

        if (searchValue === "") {
            setFilteredData(closedTickets);
        } else {
            const filtered = closedTickets.filter((item) =>
                item.id.toString().includes(searchValue.toLowerCase()) ||
                item.title.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }

    return (
        <div>
            <Header />
            <div className="col-sm-8 offset-sm-2">
                <h3>Closed Tickets</h3>
                <br />
                {/* Search Bar */}
                <input
                    type="text"
                    value={searchKey}
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search ticket by TT-ID or Title"
                />
                <br />
                {/* Closed Tickets Table */}
                <Table striped bordered hover style={{fontSize: '14px'}}>
                    <thead>
                        <tr>
                            <th>TT-ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Assigned By</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Closed At</th>
                            <th>Closed Remarks</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.title}</td>
                                    <td>{ticket.description}</td>
                                    <td>{ticket.assignby}</td>
                                    <td>{ticket.assignto}</td>
                                    <td>{ticket.status}</td>
                                    <td>{new Date(ticket.updated_at).toLocaleString()}</td>
                                    <td>{ticket.remarks}</td>
                                    <td>
                                        <FaEye
                                                size={25}
                                                onClick={() =>
                                                    navigate(
                                                        `/ticket/${ticket.id}`
                                                    )
                                                }
                                                className="icon-hover-op"
                                            />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No closed tickets found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default ClosedTickets;

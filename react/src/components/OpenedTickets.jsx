import { useEffect, useState } from "react";
import Header from "../views/Header";
import { Table } from "react-bootstrap";
import { GiTicket } from "react-icons/gi";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FaImages } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
//import { Link } from "react-router-dom";

function OpenedTickets() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        const user = JSON.parse(localStorage.getItem("user-info"));
        let result = await fetch("http://localhost:8000/api/listtickets");
        result = await result.json();

        const openedTickets = result.filter(
            (ticket) => ticket.assignby === user.email
        );
        setData(openedTickets);
        setFilteredData(openedTickets); // Initialize filtered data with all products
    }

    // Function to handle search/filter logic
    function handleSearch(event) {
        const searchValue = event.target.value;
        setSearchKey(searchValue);

        if (searchValue === "") {
            setFilteredData(data);
        } else {
            const filtered = data.filter(
                (item) =>
                    item.id.toString().includes(searchValue.toLowerCase()) ||
                    item.title.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }

    async function acceptTicket(id) {
        const user = JSON.parse(localStorage.getItem("user-info"));
        const ticket = data.find((ticket) => ticket.id === id);

        if (ticket.assignto === user.email) {
            const confirmAccept = window.confirm(
                "Do you want to accept this ticket?"
            );
            if (confirmAccept) {
                // Call the API to update the ticket status
                const response = await fetch(
                    `http://localhost:8000/api/ticket/${id}/status`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`, // Include the token if needed
                        },
                        body: JSON.stringify({ status: "Accepted" }),
                    }
                );

                if (response.ok) {
                    // Navigate to the ticket detail page if the update was successful
                    navigate(`/ticket/${id}`);
                } else {
                    alert("Failed to update the ticket status.");
                }
            }
        } else {
            alert("You are not authorized to accept this ticket.");
        }
    }

    const openModal = (imagePath) => {
        setSelectedImage(imagePath);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <div>
            <Header />
            <div className="col-sm-8 offset-sm-2">
                <h2>Tickets Opened By Me</h2>
                <br />
                {/* Search Bar */}
                <input
                    type="text"
                    value={searchKey}
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search ticket by TTid or Title"
                />
                <br />
                {/* Product Table */}
                <Table striped bordered hover style={{fontSize: '14px'}}>
                    <thead>
                        <tr>
                            <th>TTid</th>
                            <th>Request Type</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Issued At</th>
                            <th>Assigned By</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.request}</td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>
                                    {item.file_path ? (
                                        <FaImages
                                        size={27}
                                            onClick={() =>
                                                openModal(item.file_path)
                                            }
                                            className="icon-hover-op"
                                        />
                                        ):(
                                            <span>No Image</span>
                                        )}
                                    </td>
                                    <td>{new Date(item.created_at).toLocaleString()}</td>
                                    <td>{item.assignby}</td>
                                    <td>{item.assignto}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                alignItems: "center",
                                            }}
                                        >
                                             {item.status !== "Accepted" && item.status !=="Closed" && item.assignto === JSON.parse(localStorage.getItem("user-info")).email && (
                                            <GiTicket
                                                size={30}
                                                onClick={() =>
                                                    acceptTicket(item.id)
                                                }
                                                className="icon-hover-op"
                                            />
                                             )}
                                            <FaEye
                                                size={25}
                                                onClick={() =>
                                                    navigate(
                                                        `/ticket/${item.id}`
                                                    )
                                                }
                                                className="icon-hover-op"
                                            />
                                        </div>
                                    </td>
                                    
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No matching tickets found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                appElement={document.getElementById("root")}
                style={{
                    content: {
                        maxWidth: '850px', // Set maximum width for the modal
                        margin: 'auto', // Center the modal
                        padding: '30px', // Add padding inside the modal
                        borderRadius: '15px', // Optional: Rounded corners
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)', // Optional: Shadow for depth
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Optional: Change overlay color
                    },
                }}
            >
                <h4>Image Preview</h4>
                <br />
                {selectedImage && (
                    <img
                        style={{ width: "100%" }}
                        src={`http://localhost:8000/storage/tickets/${selectedImage
                            .split("/")
                            .pop()}`}
                        alt="Ticket"
                    />
                )}
                <FaWindowClose
                    size={35}
                    onClick={closeModal}
                    className="modal-close-button"
                />
            </Modal>
        </div>
    );
}

export default OpenedTickets;

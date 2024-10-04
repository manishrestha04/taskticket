import { useEffect, useState } from "react";
import Header from "../views/Header";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { FaImages } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";

function TicketDetail() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [users, setUsers] = useState([]);
    const [assignto, setAssignto] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTicketDetails(id);
        fetchUsers();
        fetchComments(id);
    }, []);

    async function fetchTicketDetails(ticketId) {
        let result = await fetch(
            `http://localhost:8000/api/ticket/${ticketId}`
        );
        result = await result.json();
        setTicket(result);
        setAssignto(result.assignto); // Set current assignee
    }

    async function fetchComments(ticketId) {
        let result = await fetch(
            `http://localhost:8000/api/ticket/${ticketId}/comments`
        );
        result = await result.json();
        setComments(result);
    }

    async function fetchUsers() {
        let result = await fetch("http://localhost:8000/api/users");
        result = await result.json();
        setUsers(result);
    }

    async function acceptTicket() {
        const user = JSON.parse(localStorage.getItem("user-info"));

        if (ticket.assignto === user.email) {
            const confirmAccept = window.confirm(
                "Do you want to accept this ticket?"
            );
            if (confirmAccept) {
                let token = localStorage.getItem("token");
                let result = await fetch(
                    `http://localhost:8000/api/ticket/${id}/status`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ status: "Accepted" }),
                    }
                );

                if (result.ok) {
                    alert("Ticket has been accepted.");
                    fetchTicketDetails(id); // Refresh ticket details
                } else {
                    alert("Failed to accept the ticket.");
                }
            }
        } else {
            alert("You are not authorized to accept this ticket.");
        }
    }

    async function reassignTicket() {
        if (!assignto) {
            setErrors({
                assignto: "Please select a user to reassign the ticket to.",
            });
            return;
        }
        const user = JSON.parse(localStorage.getItem("user-info"));
        let token = localStorage.getItem("token");

        let result = await fetch(
            `http://localhost:8000/api/ticket/${id}/reassign`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    assignto,
                    reassignedby: user.email,
                    status: "Reassigned",
                }),
            }
        );

        if (result.ok) {
            alert("Ticket has been reassigned.");
            fetchTicketDetails(id); // Refresh ticket details
        } else {
            alert("Failed to reassign the ticket.");
        }
    }

    async function addComment() {
        const user = JSON.parse(localStorage.getItem("user-info"));

        if (!newComment) {
            alert("Comment cannot be empty.");
            return;
        }

        let token = localStorage.getItem("token");
        let result = await fetch(
            `http://localhost:8000/api/ticket/${id}/comments`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: newComment,
                    commentedBy: user.email,
                }),
            }
        );

        if (result.ok) {
            setNewComment(""); // Clear input
            fetchComments(id); // Refresh comments
        } else {
            alert("Failed to add comment.");
        }
    }

    async function closeTicket() {
        const confirmAccept = window.confirm(
            "Do you want to close this ticket?"
        );
        if (confirmAccept) {
            const remarks = prompt("Enter closing remarks:");
            if (!remarks) return;

            let token = localStorage.getItem("token");
            let result = await fetch(
                `http://localhost:8000/api/ticket/${id}/close`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ remarks }),
                }
            );

            if (result.ok) {
                alert("Ticket closed successfully.");
                navigate("/closed-tickets");
                // Redirect to closed tickets list
            } else {
                alert("Failed to close the ticket.");
            }
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

    const user = JSON.parse(localStorage.getItem("user-info"));

    return (
        <div>
            <Header />
            {ticket ? (
                <div className="ticket-detail-container">
                    <div className="ticket-info">
                        <h2>Ticket Detail</h2>
                        <br />
                        <p>
                            <strong>Ticket ID:</strong> {ticket.id}
                        </p>
                        <p>
                            <strong>Title:</strong> {ticket.title}
                        </p>
                        <p>
                            <strong>Description:</strong> {ticket.description}
                        </p>
                        <p>
                            <strong>Status: </strong>
                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "3px 7px",
                                    borderRadius: "5px",
                                    color: "white",
                                    backgroundColor:
                                        ticket.status === "Closed"
                                            ? "red"
                                            : ticket.status === "Accepted"
                                            ? "green"
                                            : "blue", // Default color for Assigned or Reassigned
                                    fontWeight: "bold",
                                }}
                            >
                                {ticket.status}
                            </div>
                        </p>
                        
                        <p>
                            <strong>Assigned By:</strong> {ticket.assignby}
                        </p>
                        <p>
                            <strong>Assigned To:</strong> {ticket.assignto}
                        </p>
                        {
                            ticket.reassignedby && (
                                <p>
                                    <strong>Reassigned By:</strong>{" "}
                                    {ticket.reassignedby}
                                    <span
                                                style={{
                                                    fontSize: "0.8em",
                                                    color: "#999",
                                                }}
                                            >
                                                {" "}
                                                (
                                                {new Date(
                                                    ticket.updated_at
                                                ).toLocaleString()}
                                                )
                                            </span>
                                </p>
                            )}

                        <p style={{ display: "flex", alignItems: "center" }}>
                            <strong style={{ marginRight: "8px" }}>
                                View Image:
                            </strong>
                            {ticket.file_path ? (
                                <FaImages
                                    size={27}
                                    onClick={() => openModal(ticket.file_path)}
                                    className="icon-hover-op"
                                />
                            ) : (
                                <span>No Image</span>
                            )}
                        </p>

                        {((ticket.status === "Assigned" &&
                            ticket.assignto === user.email) ||
                            (ticket.status === "Reassigned" &&
                                ticket.assignto === user.email)) && (
                            <button
                                onClick={acceptTicket}
                                className="btn btn-success"
                            >
                                Accept Ticket
                            </button>
                        )}

                        {ticket.status === "Accepted" &&
                            ticket.assignto === user.email && (
                                <div>
                                    <h5>Reassign Ticket</h5>
                                    <select
                                        value={assignto}
                                        onChange={(e) => {
                                            setAssignto(e.target.value);
                                            setErrors({
                                                ...errors,
                                                assignto: "",
                                            });
                                        }}
                                        className="form-control"
                                    >
                                        <option value="">Select User</option>
                                        {users.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.email}
                                            >
                                                {user.email}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.assignto && (
                                        <div style={{ color: "red" }}>
                                            {errors.assignto}
                                        </div>
                                    )}
                                    <br />
                                    <div
                                        style={{ display: "flex", gap: "10px" }}
                                    >
                                        <button
                                            onClick={reassignTicket}
                                            className="btn btn-primary"
                                        >
                                            Reassign
                                        </button>
                                        {ticket.status === "Accepted" &&
                                            ticket.assignto === user.email && (
                                                <button
                                                    onClick={closeTicket}
                                                    className="btn btn-danger"
                                                >
                                                    Close
                                                </button>
                                            )}
                                    </div>
                                </div>
                            )}
                        <br />
                        {ticket.status === "Closed" && ticket.remarks && (
                            <div>
                                <h5>Closed Remarks</h5>
                                <p>{ticket.remarks}</p>
                            </div>
                        )}

                        <br />
                        <h5>Comment Here:</h5>
                        <div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="form-control"
                                placeholder="Add a comment..."
                            />
                            <br />
                            <button
                                onClick={addComment}
                                className="btn btn-secondary"
                            >
                                Add Comment
                            </button>
                        </div>
                        <br />
                    </div>
                    <div className="comments-section">
                        <h5>Comments:</h5>
                        <br />
                        <div>
                            {comments.length > 0 ? (
                                [...comments] // Create a shallow copy of the comments array
                                    .sort(
                                        (a, b) =>
                                            new Date(b.created_at) -
                                            new Date(a.created_at)
                                    ) // Sort by date in descending order
                                    .map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="comment"
                                        >
                                            <strong>
                                                {comment.commented_by}:
                                            </strong>{" "}
                                            {comment.comment}
                                            <span
                                                style={{
                                                    fontSize: "0.8em",
                                                    color: "#999",
                                                }}
                                            >
                                                {" "}
                                                (
                                                {new Date(
                                                    comment.created_at
                                                ).toLocaleString()}
                                                )
                                            </span>
                                            <hr
                                                style={{
                                                    border: "1px solid grey",
                                                    margin: "10px 0",
                                                }}
                                            />
                                        </div>
                                    ))
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}

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

export default TicketDetail;

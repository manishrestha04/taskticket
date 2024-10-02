import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

function Header() {
    let user = JSON.parse(localStorage.getItem("user-info"));
    const navigate = useNavigate();

    function logout() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark" fixed="top">
                <Navbar.Brand href="#home">Task-Ticketing</Navbar.Brand>
                <Nav className="me-auto navbar_wrapper">
                    {localStorage.getItem("user-info") ? (
                        <>
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                            <Link className="nav-link" to="/addticket">
                                Add Ticket
                            </Link>
                            <Link className="nav-link" to="/myticket">
                                My Tickets
                            </Link>
                            <Link className="nav-link" to="/closed-tickets">
                                My Closed Tickets
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">
                                Login
                            </Link>
                            <Link className="nav-link" to="/register">
                                Register
                            </Link>
                        </>
                    )}
                </Nav>
                {localStorage.getItem("user-info") ? (
                    <Nav>
                        <NavDropdown title={user?.name} align="end">
                            <NavDropdown.Item onClick={logout} className="d-flex align-items-center">
                                <span>Logout</span>
                                <MdLogout size={20} className="ml-2" />
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                ) : null}
            </Navbar>
        </div>
    );
}

export default Header;

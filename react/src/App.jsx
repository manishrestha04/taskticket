import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import Protected from "./components/Protected";
import AddTicket from "./components/AddTicket";
import TicketList from "./views/TicketList";
import TicketDetail from "./components/TicketDetail";
import MyTickets from "./components/MyTickets";
import ClosedTickets from "./components/ClosedTickets";


function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/"
                        element={
                            <Protected>
                                <TicketList />
                            </Protected>
                        }
                    />
                    <Route
                        path="/addticket"
                        element={
                            <Protected>
                                <AddTicket />
                            </Protected>
                        }
                    />
                    <Route
                        path="/myticket"
                        element={
                            <Protected>
                                <MyTickets />
                            </Protected>
                        }
                    />
                    <Route
                        path="/closed-tickets"
                        element={
                            <Protected>
                                <ClosedTickets />
                            </Protected>
                        }
                    />
                    <Route
                        path="/ticket/:id"
                        element={
                            <Protected>
                                <TicketDetail />
                            </Protected>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
}
export default App;

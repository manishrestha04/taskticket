import { useEffect, useState } from 'react'
import Header from '../views/Header';
import { Table } from 'react-bootstrap';


function UserList() {
    const [data,setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchKey , setSearchKey] = useState("");

    useEffect(()=>{
        getData();
    },[]);

    async function getData() {
        let result = await fetch("http://localhost:8000/api/users");
        result = await result.json();
        setData(result);
        setFilteredData(result);
    }

    function handleSearch(event) {
        const searchValue = event.target.value;
        setSearchKey(searchValue);

        if (searchValue === "") {
            setFilteredData(data);
        } else {
            const filtered = data.filter(
                (item) =>
                    item.name.toString().includes(searchValue.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }

  return (
    <div>
        <Header />
        <div className="col-sm-8 offset-sm-2">
                <h1>User List</h1>
                <br />
                {/* Search Bar */}
                <input
                    type="text"
                    value={searchKey}
                    onChange={handleSearch}
                    className="form-control"
                    placeholder="Search user by Name or Email"
                />
                <br />
        <Table striped bordered hover style={{fontSize: '14px'}}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.length > 0 ? (
                    filteredData.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                    </tr>
                ))):(
                    <tr>
                        <td colSpan="6" className="text-center">
                                    No User Found.
                                </td>
                    </tr>
                )}
            </tbody>
        </Table>
      </div>
    </div>
  )
}

export default UserList

import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../logo.svg';

//Bootstrap
import { Navbar, Nav } from 'react-bootstrap';
import UserContext from '../UserContext';


export default function AppNavbar() {

    const { user } = useContext(UserContext)

    const condStmnt = (user.accessToken !== null
                        ? user.isAdmin === true
                            ? <Link className="nav-link" to="/logout">Log Out</Link>
                            :
                            <>
                                <Link className="nav-link" to="/cart">Cart</Link>
                                <Link className="nav-link" to="/orders">Orders</Link>
                                <Link className="nav-link" to="/logout">Log Out</Link>
                            </>
                        :
                        <>
                            <Link className="nav-link" to="/register">Register</Link>
                            <Link className="nav-link" to="/login">Log In</Link>
                        </>
    )

    const adminStmnt = (user.accessToken !== null
                            ? user.isAdmin === true
                                    ?
                                    <span>Admin Dashboard</span>
                                    :
                                    <span>Products</span>
                            :
                            <span>Products</span>
            )

    return (
        <Navbar expand="lg" variant="dark" id="navbar">
            <Navbar.Brand as={Link} to="/" className="pb-3 pl-2">
                <img src={Logo} alt="ME Logo" width="40" height="40" className="d-inline-block align-top"/>{' '}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={NavLink} to="/" id="gforce"><h5>GForce</h5></Nav.Link>
                    <Link className="nav-link pt-2" to="/products">
                    {adminStmnt}
                    </Link>
                </Nav>
                <Nav className="ml-auto">
                    {condStmnt}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

import React, { useState, useEffect, useContext} from 'react';

//Bootstrap
import { Form, Button, Container } from 'react-bootstrap';

//Route
import { useHistory } from 'react-router-dom';

//User Context
import UserContext from '../UserContext';

//SweetAlert
import Swal from 'sweetalert2';

export default function Login() {

    const history = useHistory();
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btnActive, setBtnActive] = useState(true);
    
    const authenticate = e => {
        e.preventDefault();
        
        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if(typeof data.accessToken !== 'undefined'){
                setEmail('');
                setPassword('');

                localStorage.setItem('accessToken', data.accessToken);
                userDetails(data.accessToken)
                // setUser({
                //     accessToken: localStorage.getItem('accessToken')
                // })
                console.log(`Welcome back!`);

                
            }else{
                Swal.fire({
                    title:`Authentication Failed!`,
                    icon:'error',
                    text: `Check your details and try again.`
                })
            }
        })
        
    }
    
    const userDetails = () => {

        fetch(`${process.env.REACT_APP_API_URL}/users/`, {
            headers: {'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem(`accessToken`)}`
        }
    })
    .then(res=>res.json())
    .then(data => {
        console.log(data);
        setUser({ id: data._id, isAdmin: data.isAdmin})
        if(data.isAdmin === true){
    
            localStorage.setItem('email', data.email);
            localStorage.setItem('isAdmin', data.isAdmin);
    
            setUser({
                email: localStorage.getItem('email'),
                isAdmin: localStorage.getItem('isAdmin')
            })
            
            history.push('/products')
        } else {
            localStorage.setItem('email', data.email);
            localStorage.setItem('isAdmin', data.isAdmin);
    
            setUser({
                email: localStorage.getItem('email'),
                isAdmin: localStorage.getItem('isAdmin')
            })
    
            history.push('/')
        }
        
    })

    }

    useEffect(() => {
        if(email !== '' && password !== ''){
            setBtnActive(true);
        }else{
            setBtnActive(false)
        }
    }, [email, password])

    return (
        <Container id="contForm">
	    	<h1 className="text-center">Login</h1>
	        <Form onSubmit={(e) => authenticate(e)}>
	            <Form.Group controlId="userEmail">
	                <Form.Label>Email address:</Form.Label>
	                <Form.Control 
	                    type="email" 
	                    placeholder="Enter email"
	                    value={email}
	                    onChange={(e) => setEmail(e.target.value)}
	                    required
	                />
	            </Form.Group>

	            <Form.Group controlId="password">
	                <Form.Label>Password:</Form.Label>
	                <Form.Control 
	                    type="password" 
	                    placeholder="Password"
	                    value={password}
	                    onChange={(e) => setPassword(e.target.value)}
	                    required
	                />
	            </Form.Group>

	            {btnActive ? 
	                <Button type="submit" id="submitBtn" className="subBtn">
	                    Login
	                </Button>
	                : 
	                <Button variant="dark" type="submit" id="submitBtn" disabled>
	                    Login
	                </Button>
	            }
	        </Form>
        </Container>
    )
}

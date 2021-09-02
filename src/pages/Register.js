import React,{ useState, useEffect} from 'react';

//Bootstrap
import { Form, Button, Container } from 'react-bootstrap';

//Route
import { useHistory } from 'react-router-dom';

// Sweetalert
import Swal from 'sweetalert2';


export default function Register() {
    const history = useHistory();

    const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');	
	const [password, setPassword] = useState('');
	const [verifyPassword, setVerifyPassword] = useState('');
    const [registerButton, setRegisterButton] = useState(false);

    useEffect (() => {
        if(email !== '' && password !== '' && verifyPassword !== '' && password === verifyPassword){
            setRegisterButton(true)
        }else{
            setRegisterButton(false)
        }
    }, [email, password, verifyPassword, registerButton])

    const registerUser = e => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_URL}/users/register`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data){
                Swal.fire({
                    title: `Kindly login ${firstName}.`,
                    icon: 'success',
                    text: `You have successfully registered ${email}`
                })
    
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setVerifyPassword('');
    
                history.push('/login');
            }else{
                Swal.fire({
                    title: "User Registration Failed",
                    icon: 'error',
                    text: "Something went wrong"
                })
            }
        })
    }

    return (
        <Container id="regForm">
			<h1 className="text-center">Register</h1>
			<Form onSubmit={e => registerUser(e)}>
				<Form.Group>
				<Form.Group>
					<Form.Label>First Name:</Form.Label>
					<Form.Control type="text" placeholder="Enter First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
				</Form.Group>
				<Form.Group>
					<Form.Label>Last Name:</Form.Label>
					<Form.Control type="text" placeholder="Enter Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
				</Form.Group>
					<Form.Label>Email Address:</Form.Label>
					<Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required />
					<Form.Text className="text-muted">
						We'll never share your email with any one else.
					</Form.Text>
				</Form.Group>
				<Form.Group>
					<Form.Label>Password:</Form.Label>
					<Form.Control type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} required />
				</Form.Group>
				<Form.Group>
					<Form.Label>Verify Password:</Form.Label>
					<Form.Control type="password" placeholder="Verify Password" value={verifyPassword} onChange={e => setVerifyPassword(e.target.value)} required />
				</Form.Group>
				{registerButton ?   
					<Button type="submit" className="subBtn">Register</Button>
					 :
					<Button variant="dark" type="submit" disabled>Register</Button>
				}
			</Form>
		</Container>
    )
}

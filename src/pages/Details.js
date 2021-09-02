import React, { useContext, useEffect, useState } from 'react';

//Route
import { useParams, Link } from 'react-router-dom';

//UserContext
import UserContext from '../UserContext';

//Bootstrap
import { Card, Container, Button, InputGroup, FormControl } from 'react-bootstrap';

//SweetAlert
import Swal from 'sweetalert2';

export default function Details() {
    const { user } = useContext(UserContext)
    const { productId } = useParams();

    const [id, setId] = useState("")
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [qty, setQty] = useState(1)
	const [price, setPrice] = useState(0)

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(data => {
            setId(data._id)
            setName(data.name)
            setDescription(data.description)
            setPrice(data.price)
        })
    }, [])

    const reduceQty = () => {
		if(qty <= 1){
			Swal.fire({
                title: 'Oopps!',
                icon: 'error',
                text: 'Minimum Quantity is 1.'

            })
		}else{
			setQty(qty - 1)
		}
	}

	const addToCart = () => {
		let alreadyInCart = false
		let productIndex
		let cart = []

        fetch(`${process.env.REACT_APP_API_URL}/users/addToCart`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json', authorization: `Bearer ${localStorage.getItem('accessToken')}`},
            body: JSON.stringify({
                productId: id,
                productName: name,
                subtotal: price * qty,
                quantity: qty
            })
        })
        .then(res=>res.json())
        .then(data => {
            if(data){
                console.log(data);
                if(localStorage.getItem('cart')){
                    cart = JSON.parse(localStorage.getItem('cart'))
                }
        
                for(let i = 0; i < cart.length; i++){
                    
                    if(cart[i].productId === id){
                        alreadyInCart = true
                        productIndex = i
                    }
                }
        
                if(alreadyInCart){
                    cart[productIndex].quantity = qty
                    cart[productIndex].subtotal = cart[productIndex].price * cart[productIndex].quantity
                }else{
                    cart.push({
                        'productId' : id,
                        'name': name,
                        'price': price,
                        'quantity': qty,
                        'subtotal': price * qty
                    })		
                }
        
                localStorage.setItem('cart', JSON.stringify(cart))
        
                if(qty === 1){
                    Swal.fire({
                        title: 'Added to Cart',
                        icon: 'success',
                        text: '1 item added to cart.'
                    })
                }else{
                    Swal.fire({
                        title: 'Added to Cart',
                        icon: 'success',
                        text: `${qty} items added to cart.`
                    })
                }

            }
        })

	}

	const qtyInput = (value) => {
		if(value === ''){
			value = 1
		}else if(value === "0"){
			Swal.fire({
                title: 'Oopps!',
                icon: 'error',
                text: 'Minimum Quantity is 1.'

            })
			value = 1
		}

		setQty(value)
	}

	return (
        <div className="app">
		<Container>
			<Card className="text-center mt-5 productCard">
				<Card.Header className=" text-white text-center pb-1"><h2>{name}</h2></Card.Header>
				<Card.Body>
					<Card.Text className="productCardText"><h3 className="mt-3 mb-5">Description:</h3>{description}</Card.Text>
					<h5 className="mb-2">Price:</h5>
                    <p className="text-light">₱{price}</p>
					<h5 className="mt-5">Quantity:</h5>
                        <InputGroup className="qty mt-2 mb-1 d-inline-flex justify-content-md-center">
                            <InputGroup.Prepend className="d-none d-md-flex">
                                <Button variant="outline-secondary" onClick={reduceQty}>-</Button>
                            </InputGroup.Prepend>
                            <FormControl className="text-center col" id="input" type="number" min="1" value={qty} onChange={e => qtyInput(e.target.value)}/>
                            <InputGroup.Append className="d-none d-md-flex">
                                <Button variant="outline-secondary" onClick={() => setQty(qty + 1)}>+</Button>
                            </InputGroup.Append>
                        </InputGroup>
				</Card.Body>
				<Card.Footer>
				{user.accessToken !== null
					? user.isAdmin === true
						? <Button variant="danger" block as={Link} to="/logout">Login as User</Button>
						: <Button variant="dark" id="addBtn" block onClick={addToCart}>Add to Cart</Button>
					: <Link className="btn btn-danger btn-block" to={{pathname: '/login', state: { from: 'cart'}}}>Log in to Add to Cart</Link>
				}
	      		</Card.Footer>
			</Card>
		</Container>
        </div>
	)
}


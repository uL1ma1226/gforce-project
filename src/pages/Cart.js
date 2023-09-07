import React, { useState, useEffect } from 'react';

//Route
import { Link, Redirect } from 'react-router-dom';

//Bootstrap 
import { Container, Table, Button, Jumbotron, FormControl, InputGroup } from 'react-bootstrap';

//SweetAlert
import Swal from 'sweetalert2';


export default function Cart() {

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [table, setTable] = useState([]);
    const [redirect, setRedirect] = useState([]);

    useEffect(()=>{
        if(localStorage.getItem('cart')){
            setCart(JSON.parse(localStorage.getItem('cart')))
        }
    },[])

    useEffect(() => {

			let cartItems = cart.map((item, index) => {
	
				console.log(item.productId);
			return(
			<tr key={item.productId} className="text-center">
				<td><Link to={`/products/${item.productId}`}>{item.name}</Link></td>
				<td>₱{item.price}</td>
				<td className="d-inline-flex justify-content-center">
					<InputGroup className="d-md-none">
						<FormControl type="number" min="1" value={item.quantity} onChange={e => qtyInput(item.productId, e.target.value)}/>
					</InputGroup>
					<InputGroup className="d-none d-md-flex w-50">
						<InputGroup.Prepend>
							<Button variant="outline-secondary" onClick={() => qtyBtns(item.productId, "-")}>-</Button>
						</InputGroup.Prepend>
						<FormControl className="text-center col" type="number" min="1" id="inputCart" value={item.quantity} onChange={e => qtyInput(item.productId, e.target.value)}/>
						<InputGroup.Append>
							<Button variant="outline-secondary" onClick={() => qtyBtns(item.productId, "+")}>+</Button>
						</InputGroup.Append>
					</InputGroup>
				</td>
				<td>₱{item.subtotal}</td>
				<td className="text-center">
					<Button variant="danger" onClick={() => removeBtn(item.productId)}>Remove</Button>
				</td>
			</tr>	
			)
		})
		setTable(cartItems)
	
		let tempTotal = 0
	
		cart.forEach(item=>{
			tempTotal += item.subtotal
		})
		setTotal(tempTotal)

    // eslint-disable-next-line
	}, [cart])

		const qtyInput = (productId, value) => {

			let tempCart = [...cart]
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
	
			for(let i = 0; i < cart.length; i++){
	
				if(tempCart[i].productId === productId){
					tempCart[i].quantity = parseFloat(value)
					tempCart[i].subtotal = tempCart[i].price * tempCart[i].quantity
				}
			}
	
			setCart(tempCart)
			localStorage.setItem('cart', JSON.stringify(tempCart))
	
		}
	
		const qtyBtns = (productId, operator) => {
	
			let tempCart = [...cart]
	
			for(let i = 0; i < tempCart.length; i++){
	
				if(tempCart[i].productId === productId){
					if(operator === "+"){
						tempCart[i].quantity += 1
						tempCart[i].subtotal = tempCart[i].price * tempCart[i].quantity
					}else if(operator === "-"){
						if(tempCart[i].quantity <= 1){
							Swal.fire({
								title: 'Oopps!',
								icon: 'error',
								text: 'Minimum Quantity is 1.'
			
							})
						}else{
							tempCart[i].quantity -= 1
							tempCart[i].subtotal = tempCart[i].price * tempCart[i].quantity
						}
					}
				}
			}
	
			setCart(tempCart)
			localStorage.setItem('cart', JSON.stringify(tempCart))
		}
	
		const removeBtn = (productId) => {

			let tempCart = [...cart]

			let cartId = cart.map(product => {
				return product.productId
			})
			
			tempCart.splice([cartId.indexOf(productId)], 1)
			
			setCart(tempCart)
			localStorage.setItem('cart', JSON.stringify(tempCart))	

		}
	
		const checkout = () => {
	
			const checkoutCart =  cart.map((item) => {
				console.log(item.quantity);
				return {
					productName: item.name,
					productId: item.productId,
					quantity: item.quantity,
					subtotal: item.subtotal
				}
			})

        fetch(`${process.env.REACT_APP_API_URL}/orders/createOrder`, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${ localStorage.getItem('accessToken') }`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				order: checkoutCart,
				totalAmount: total
			})
		})
		.then(res => res.json())
		.then(data => {
            console.log(data);
			if(data === true){
				Swal.fire({
					title: 'Order placed!',
					icon: 'success',
					text: 'Thank you for purchasing!'

				})

				localStorage.removeItem('cart')

				setRedirect(true)
			}else{
				Swal.fire({
					title: 'Oopps!',
					icon: 'error',
					text: 'Something went wrong.'

				})
			}
		})

	}

    return (
        redirect === true
		? <Redirect to="/orders"/>
		:
		cart.length <= 0
			? <Jumbotron>
				<h1 className="text-center shopBtn">Your cart is empty! <Link to="/products" className="startShopBtn">Start shopping</Link></h1>
			</Jumbotron>
			:
		<div id="cartPage">
        <Container>
				<h2 className="text-center my-4">Shopping Cart</h2>
				<Table striped hover responsive>
					<thead className="text-white thead text-center">
						<tr>
							<th>Name</th>
							<th>Price</th>
							<th>Quantity</th>
							<th>Subtotal</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{table}
						<tr>
							<td colSpan="3">
								<Button variant="outline-success" block onClick={()=> checkout()}>Checkout</Button>
							</td>
							<td colSpan="2">
								<h3>Total: ₱{total}</h3>
							</td>
						</tr>
					</tbody>						
				</Table>
			</Container>
		</div>	
    )
}

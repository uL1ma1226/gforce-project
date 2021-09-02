import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Orders(props){

    const [table, setTable] = useState([])

	useEffect(()=> {

		fetch(`${process.env.REACT_APP_API_URL}/orders/userOrder`, {
			headers: {
                'Content-Type': 'application/json',
				authorization: `Bearer ${ localStorage.getItem('accessToken') }`
			}
		})
		.then(res => res.json())
		.then(data => {
            if (data.length > 0){

				const orders = data.map(item => {

					return (
						<tr>
							<td className="text-center">{item._id}</td>
							<td className="text-center">&#8369;{item.totalAmount}</td>
								{
									item.order.map(product => {
										return (
											<tr className="text-center">
												<td className="text-center">{product.quantity}pc.</td>
												<td className="text-center">{product.productName}</td>
											</tr>
										)

										})
								}
						</tr>
					)
				})
				setTable(orders)
			}
		})
	}, [])

	return(
		table.length === 0
		?<Jumbotron>
				<h3 className="text-center">No orders placed yet! <Link to="/products">Start shopping.</Link></h3>
		</Jumbotron>
		:
		<Container id="orderCont">
			<h2 className="text-center my-4">Order History</h2>
            <Table hover responsive >
                <thead className="text-white thead">
                    <tr>
                        <th className="text-center">Tracking id:</th>
                        <th className="text-center thQty">Total Amount</th>
                        <th className="text-center">Quantity & Product</th>
                    </tr>
                </thead>
                <tbody>
				
                    {table}
					
				
                </tbody>
            </Table>
		</Container>
	)
}
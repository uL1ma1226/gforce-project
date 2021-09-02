import React from 'react';

//Route
import { Link } from 'react-router-dom';

//Bootstrap
import { Col, Card, Button } from 'react-bootstrap';

export default function Product(props) {
    const { breakPoint, data } = props
   
    const { name, description, price } = data

    return (
		<Col xs={12} md={breakPoint}>
        <div className="p-3">
			<Card className="text-center productCard" id="card">
				<Card.Body>
                    <Card.Title className="productCardTitle"><h3>{name}</h3></Card.Title>
					<Card.Text className="productCardText">
						<h5>Description:</h5>
						<p>{description}</p>

						<h5>Price:</h5>
						<p>&#8369;{price}</p>

					</Card.Text>

                    <Button className="btn-block" id="btn" as={Link} to={`/products/${data._id}`}>
		              Details
		            </Button>

				</Card.Body>
			</Card>
        </div>
		</Col>
    )
}

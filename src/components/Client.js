import React, { useEffect, useState } from 'react';

//Components
import Product from './Product';

//Bootstrap
import { Row } from 'react-bootstrap';

export default function Client({data}) {

    const [product , setProduct] = useState([])

    useEffect(() =>{

        const product = data.map(foundProduct => {
            if(foundProduct.isActive === true){
                return <Product key={foundProduct._id} data={foundProduct} breakPoint={6}/>
            } else {
                return null
            }
        })
        setProduct(product)
    },[data])
    return (
       <>
        <h1 className="text-center my-5">Products</h1>
        <Row>
            {product}
        </Row>
       </>
    )
}

import React, { useState, useEffect } from 'react';

//Bootstrap
import { CardGroup } from 'react-bootstrap';

//Component
import Product from './Product';


export default function Feature({data}) {

    const [feature, setFeature] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/products/all`, {
            headers: {'Content-Type': 'application/json'}
        })
        .then(res=>res.json())
        .then(data => {
            console.log(data);
            if(data.length > 3) {
                const products = []
                const numbers = []
    
                const generateRandomNums = () => {
                    let randomNumber = Math.floor(Math.random() * data.length)
    
                    if(numbers.indexOf(randomNumber) === -1){
                        numbers.push(randomNumber)
                    } else{
                        generateRandomNums()
                    }
                }
    
                for(let i = 0; i < 3; i++){
                    generateRandomNums()
    
                    products.push(<Product data={data[numbers[i]]} key={data[numbers[i]]._id} breakPoint={6} />) 
                }
    
                setFeature(products)
              
            }else {
                <h1>no product</h1>
            }
        })
    }, [])

    return (
      
      <div id="feature">
        <CardGroup className="justify-content-center" border="dark" bg="dark">
            {feature}
        </CardGroup>

      </div>      

           
        
    )
}

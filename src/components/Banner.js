import React from 'react'

//Router
import { Link } from 'react-router-dom'

//Bootstrap
import { Button } from 'react-bootstrap'


export default function Banner({data}) {

    const { title, content, destination, label } = data;

    return (
        <div className="bgBanner">
            <div className="text-center my-5">
                <h1>{title}</h1>
                <p>{content}</p>
                <Button as={Link} to={destination} id="shop" variant="outline-dark">{label}</Button>
            </div>

        </div>
    )
}

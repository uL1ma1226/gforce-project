import React, { useState, useEffect } from 'react'

//bootstrap
import { Table, Button, Modal, Form } from 'react-bootstrap'

import Swal from 'sweetalert2'


export default function Admin(props) {

    const { productData, fetchData } = props
    const [ id, setId ]  = useState('')

    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0);

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false)

    const openAdd = () => setShowAdd(true);
    const closeAdd = () => setShowAdd(false);

    const openEdit = (product) => {

        // setProductId(product)
        fetch(`${process.env.REACT_APP_API_URL}/products/${product}`,{
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res=>res.json())
        .then(data => {
            console.log(data);
            setId(data._id)
            setName(data.name)
            setDescription(data.description)
            setPrice(data.price)
        })
        setShowEdit(true);
    }

    const closeEdit = () => {
        setShowEdit(false)
        setName('')
		setDescription('')
		setPrice(0)
    }

    useEffect(()=>{
        const productArr = productData.map(product => {
            console.log(product);
            return(
                <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td className={product.isActive ? "text-success" : "text-danger"}>{product.isActive ? "Available" : "Unavailable"}</td>
                    <td>
                        <Button className="subBtn mb-1" size="sm" onClick={() => openEdit(product._id)}>
                            Update
                        </Button>
                        { product.isActive ?
                            <Button variant="danger" size="sm" onClick={() => archiveProduct(product._id, product.isActive)}>
                                Archive
                            </Button>
                            :
                            <Button className="subBtn" size="sm" onClick={() => restoreProduct(product._id, product.isActive)}>
                                Restore
                            </Button>

                        }
                    </td>
                </tr>
            )
        })
        console.log(productArr)
        setProducts(productArr)
    }, [productData])

    const addProduct = e => {
        e.preventDefault()

        fetch(`${process.env.REACT_APP_API_URL}/products/create/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price
            })
        })
        .then(res=>res.json())
        .then(data => {
            console.log(data);
            if(data){
                fetchData()
                Swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Product successfully added'
                })

                setName('')
                setDescription('')
                setPrice(0)

                closeAdd()
            }else{
                fetchData()
                Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    text: 'Please try again.'
                })

            }
        })
    }

    const editProduct = (e, id) => {
        e.preventDefault()

        fetch(`${process.env.REACT_APP_API_URL}/products/update/${id}/admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price
            })
        })
        .then(res=>res.json())
        .then(data => { 
            if(data){
                fetchData()
                Swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Product successfully updated'
                })
                setName("")
                setDescription("")
                setPrice(0)
                closeEdit()
            }else{
                fetchData()
                Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    text: 'Please try again.'
                })

            }

        })
    }

    const archiveProduct = (id, isActive) => {

        fetch(`${process.env.REACT_APP_API_URL}/products/archive/${id}/admin`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                isActive: isActive
            })
        })
        .then(res=>res.json())
        .then(data=> {
            if(data){
                fetchData()
                Swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Successfully archived!'
                })
            } else {
                fetchData()
                Swal.fire({
                    title: 'Try again',
                    icon: 'error',
                    text: 'Something went wrong!'
                })
            }
        })
    }

    const restoreProduct = (id, isActive) => {

        fetch(`${process.env.REACT_APP_API_URL}/products/store/${id}/admin`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${ localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                isActive: isActive
            })
        })
        .then(res=>res.json())
        .then(data=> {
            if(data){
                fetchData()
                Swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Restored Successfully!'
                })
            } else {
                fetchData()
                Swal.fire({
                    title: 'Try again',
                    icon: 'error',
                    text: 'Something went wrong!'
                })
            }
        })
    }

    return (
        <>
            <div className="text-center my-4">
                <h2>Admin Dashboard</h2>
                <div className="d-flex justify-content-center">
                    <Button variant="primary" onClick={openAdd}>Add new Product</Button>
                </div>
            </div>
            <Table striped vordered hover responsive>
                <thead className="text-white thead">
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products}
                </tbody>
            </Table>
            <Modal show={showAdd} onHide={closeAdd}>
                <Form onSubmit={e => addProduct(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-dark">Add Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label className="text-dark">Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Name of Product" required value={name} onChange={e=> setName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="text-dark">Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter Description" required value={description} onChange={e=> setDescription(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="text-dark">Price</Form.Label>
                            <Form.Control type="number" required value={price} onChange={e=> setPrice(e.target.value)}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeAdd}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>   

            {/* Edit */}
            <Modal show={showEdit} onHide={closeEdit}>
                <Form onSubmit={e => editProduct(e, id)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-dark">Edit Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label className="text-dark">Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Name of Product" required value={name} onChange={e=> setName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="text-dark">Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter Description" required value={description} onChange={e=> setDescription(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="text-dark">Price</Form.Label>
                            <Form.Control type="number" required value={price} onChange={e=> setPrice(e.target.value)}/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEdit}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>   
        </>
    )
}

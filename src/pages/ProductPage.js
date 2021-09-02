import React, { useContext, useEffect, useState } from 'react'

//Component
import Client from '../components/Client'
import Admin from '../components/Admin'

//User Context
import UserContext from '../UserContext'

//Bootstrap
import { Container } from 'react-bootstrap'

//Spinners
import PacmanLoader from 'react-spinners/PacmanLoader'

export default function ProductPage() {
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

    const [ product, setProduct ] = useState([]);
    const [ adminProduct, setAdminProduct ] = useState([]);

    const { user } = useContext(UserContext)

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_URL}/products/all`, {
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => res.json())
        .then(data => {
            setProduct(data)
        })
    } 

    useEffect(()=>{
        fetchData()
    }, [])

    const adminData = () => {
        fetch(`${process.env.REACT_APP_API_URL}/products/all/admin`, {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setAdminProduct(data)
        })
    } 

    useEffect(()=>{
        adminData()
    }, [])

    
    

    return (
        <Container>
			{
                loading ?
                <div className="pacman">
                <PacmanLoader color={"#76b900"} loading={loading} size={30} />
                </div>

                :
				user.isAdmin === true
				?
				<Admin productData={adminProduct} fetchData={adminData}/>
				:
                <Client data={product}/>
                
			}
		</Container>
    )
}

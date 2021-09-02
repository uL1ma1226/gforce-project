import React, { useState, useEffect} from 'react';

//Components
import Banner from '../components/Banner';
import Feature from '../components/Feature';

//Spinners
import PacmanLoader from 'react-spinners/PacmanLoader'

export default function Home() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
        setLoading(false)
        }, 1000)
    }, [])

    const data = {
        title: "GForce Computer",
        content: "",
        destination: "/products",
        label: "Shop now"
    }

    return (
        <>
        {
            loading ?
        <div className="pacman">
          <PacmanLoader color={"#76b900"} loading={loading} size={30} />
        </div>

        :
        <>
            < Banner data={data}/>
            <h3 className="text-center my-5">Featured Products</h3>
            < Feature />
        </>
        }
        </>
    )
}

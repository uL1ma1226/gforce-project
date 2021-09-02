import React, { useContext, useEffect } from 'react';

//Route 
import { Redirect } from 'react-router-dom';

//userContext
import UserContext from '../UserContext'

export default function Logout() {

    const { setUser, unsetUser } = useContext(UserContext);

    unsetUser()

    useEffect(() => {
        setUser({accessToken:null})
    })

    return (
        <Redirect to="/login" />
    )
}

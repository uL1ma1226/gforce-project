import React, { useState, useEffect } from 'react';
import './App.css';

//Routing
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

//Components
import AppNavbar from './components/AppNavbar';

//Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import Register from './pages/Register';
import ProductPage from './pages/ProductPage';
import Details from './pages/Details'
import Cart from './pages/Cart';
import Orders from './pages/Orders'

//User Context
import { UserProvider } from './UserContext'

//Spinners
import PacmanLoader from 'react-spinners/PacmanLoader'


function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  const [user, setUser] = useState({
    email: localStorage.getItem('email'), 
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    accessToken: localStorage.getItem('accessToken')
  });

  const unsetUser = () => {
    localStorage.clear()
  }

  useEffect(() => {
    if(user.email !== null){
      fetch(`${process.env.REACT_APP_API_URL}/users/`, {
        headers: { authorization: `Bearer ${localStorage.getItem('accessToken')}`}
      })
      .then(res => res.json())
      .then(data => {
  
        if(typeof data._id !== 'undefined'){
          setUser({ id: data._id, isAdmin: data.isAdmin })
        }else{
          setUser({ id: null, isAdmin: null })
        }
      })
    }

  }, [])

  return (
    <div className="app">
      {
        loading ?
        <div className="pacman">
          <PacmanLoader color={"#76b900"} loading={loading} size={30} />
        </div>

        :
      <UserProvider value={{user, setUser, unsetUser}}>
        <Router>
          <AppNavbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/products" component={ProductPage} />
              <Route path="/products/:productId" component={Details} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/orders" component={Orders} />
              <Route component={Error} />
            </Switch>
        </Router>
      </UserProvider>
      }
    </div>
  );
}

export default App;

import React from 'react';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import { Provider } from 'unstated';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import Notifications from 'react-notify-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
//import { AnimatePresence } from 'framer-motion';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Nav from './Nav';
import CreateCustomer from './customers/CreateCustomer';
import UpdateCustomer from './customers/UpdateCustomer';
import ViewCustomer from './customers/ViewCustomer';
import Customers from './customers/Customers';
import CreateOrder from './orders/CreateOrder';
import UpdateOrder from './orders/UpdateOrder';
import ViewOrder from './orders/ViewOrder';
import Orders from './orders/Orders';
import CreateProduct from './products/CreateProduct';
import UpdateProduct from './products/UpdateProduct';
import ViewProduct from './products/ViewProduct';
import Products from './products/Products';
import _CustomersContainer  from './customers/CustomersContainer';
import _OrdersContainer  from './orders/OrdersContainer';
import _ProductsContainer from './products/ProductsContainer';



function App() {
  //const location = useLocation();
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      
      <ReactNotification/>
      <ToastContainer/>
      <Provider inject={[_CustomersContainer, _OrdersContainer, _ProductsContainer]}>
          <Nav>
              <Switch>
                <Route path="/create-customer">
                  <CreateCustomer/>
                </Route>
                <Route path="/update-customer" >
                  <UpdateCustomer/>
                </Route>
                <Route path="/view-customer">
                  <ViewCustomer/>
                </Route>
                <Route path="/customers">
                  <Customers/>
                </Route>
                <Route path="/create-order">
                  <CreateOrder/>
                </Route>
                <Route path="/update-order">
                  <UpdateOrder/>
                </Route>
                <Route path="/view-order">
                  <ViewOrder/>
                </Route>
                <Route exact path="/">
                  <Orders/>
                </Route>
                <Route path="/create-product">
                  <CreateProduct/>
                </Route>
                <Route path="/update-product">
                  <UpdateProduct/>
                </Route>
                <Route path="/view-product">
                  <ViewProduct/>
                </Route>
                <Route path="/products">
                  <Products/>
                </Route>
              </Switch>
          </Nav>
      </Provider> 
    </MuiPickersUtilsProvider>
  );
}

export default App;

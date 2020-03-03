import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import _OrdersContainer from './OrdersContainer';
import Transition from '../shared/Transition';
import { Subscribe } from 'unstated';
import { Table, TableHead, TableBody,TableRow, TableCell, IconButton, TablePagination, Tooltip } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {
    Formik, Form, Field, ErrorMessage,
  } from 'formik';
import * as Yup from 'yup';
import { TextField, Select } from 'formik-material-ui';
import NumberFormat from 'react-number-format';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import LaunchIcon from '@material-ui/icons/Launch';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
//import { BASE_URL } from '../shared/Constants';
import ConfirmDialog from '../shared/ConfirmDialog';
import MessageDialog from '../shared/MessageDialog';
import Loading from '../shared/Loading';
import { openToast } from '../utils/utility';
import useAxios from 'axios-hooks';

const useStyles = makeStyles({
  root: {
      width: '100%',
      overflowX: 'auto',
  },
  table: {
      minWidth: 650,
  }
})



const searchByOptions = [
    'All',
    'Order ID',
    'Customer ID'
]

const orderByOptions = [
  'Order ID_Asc',
  'Order ID_Desc',
  'Customer ID_Asc',
  'Customer ID_Desc',
  'Order Date_Asc',
  'Order Date_Desc'
]

const sampleOrders = [
  {
    orderID: 0,
    customerName: "Wayne Stewart",
    deliveryAddress: "25 Betway Road",
    total: "4000",
    currency: "R",
    orderDate: "31/1/2018"
  },
  {
    orderID: 0,
    customerName: "John Barnes",
    deliveryAddress: "1 Leonora Drive",
    total: "4000",
    currency: "R",
    orderDate: "31/1/2018"
  }
]


const Orders = () => {
    const [anchorEl0, setAnchorEl0] = React.useState(null);
    const [searchBy, setSearchBy] = useState(null);
    const [searchTerm, setSearchTerm] = useState(null);
    const [orderBy, setOrderBy] = useState(null);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [pageTotal, setPageTotal] = useState(0);
    const [currentOrder, setCurrentOrder] = useState({});
    const [openAlert, setOpenAlert] = React.useState(false);
    const [confirmAlert, setConfirmAlert] = React.useState(false);
    const [alertTitle, setAlertTitle] = React.useState("");
    const [alertDescription, setAlertDescription] = React.useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmConfirmDialog, setConfirmConfirmDialog] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = React.useState("");
    const [confirmDialogDescription, setConfirmDialogDescription] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const BASE_URL = `${window.location.protocol}//${window.location.host}`

    const classes = useStyles();
    const history = useHistory();

    const [{data: getData, loading: getLoading, error: getError}, executeGet] = useAxios({
      url: BASE_URL,
      method: "GET"
    },{
        manual: true
    });

    const [{data: deleteData, loading: deleteLoading, error: deleteError}, executeDelete] = useAxios({
      url: BASE_URL,
      method: "DELETE"
    },{
    manual: true
    });

    const getOrders = () => {
      const query = {
        SearchBy: searchBy,
        SearchTerm: searchTerm,
        OrderBy: orderBy,
        PageNumber: currentPage,
        PageSize: perPage
      };

      executeGet({
        method: 'get',
        url: BASE_URL + '/api/orders',
        data: {
          ...query
        }})
    }

    const deleteOrder = (_order) => {
      executeDelete({
        method: 'delete',
        url: BASE_URL + '/api/orders/' + _order.orderID ,
        })
    }

    const openConfirmDialogDialog = () => {
      setOpenConfirmDialog(true);
    };

    const handleConfirmDialogClose = value => {
      setOpenConfirmDialog(false);
      setConfirmConfirmDialog(value);
      if(value) {
          deleteOrder(currentOrder);
      }
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
        getOrders()
    }

    const handleChangeRowsPerPage = event => {
        setPerPage(parseInt(event.target.value), 10);
        setCurrentPage(0);
        getOrders()
    }

    const addOrder = () => {
        history.push('/create-order');
    }

    const handleActionsMenuClick = event => {
        setAnchorEl0(event.currentTarget);
    }
  
    const handleActionsMenuClose = () => {
        setAnchorEl0(null);
    }

    const handleDeleteOrder = () => {
      setConfirmDialogTitle('Delete Order');
      setConfirmDialogDescription(`Are you sure you want to delete order with ID: ${currentOrder.orderID}`);
      openConfirmDialogDialog();
  }

    const handleMessageClose = value => {
      setOpenMessage(false);
      setConfirmMessage(value);
    };

    if(getData){
      setOrders(getData.data)
    }

    //if get error show alert
    if( getError ) {
      openToast("error", getError.message );
    } 

    //if delete error show alert
    if( deleteError ) {
      openToast("error", deleteError.message );
    } 

    //if delete success show alert
    if( deleteData ) {
      openToast("success", deleteData.message );
    } 
    
  
  return (
      <Transition>
          <Subscribe to = {[_OrdersContainer]}>
            {(ordersStore) => {
                const { state: {_orders, _currentPage, _perPage, _pageTotal, _searchBy, _searchTerm, _orderBy }, 
                _setSelectedOrder, 
                _setOrders, 
                _setCurrentPage,
                _setPageTotal, 
                _setPerPage,
                _setSearchBy,
                _setSearchTerm,
                _setOrderBy } = ordersStore;
                setOrders(_orders);
                console.log(_orders);
                setCurrentPage(_currentPage);
                setPerPage(_perPage);
                setPageTotal(_pageTotal);

                const handleViewOrder = () => {
                  _setOrders(orders);
                  _setCurrentPage(currentPage);
                  _setPerPage(perPage);
                  _setPageTotal(pageTotal);
                  _setSearchBy(searchBy);
                  _setSearchTerm(searchTerm);
                  _setOrderBy(orderBy);
                  _setSelectedOrder(currentOrder);
                  history.push('/view-order');
                }
          
                const handleEditOrder = () => {
                  _setOrders(orders);
                  _setCurrentPage(currentPage);
                  _setPerPage(perPage);
                  _setPageTotal(pageTotal);
                  _setSearchBy(searchBy);
                  _setSearchTerm(searchTerm);
                  _setOrderBy(orderBy);
                  _setSelectedOrder(currentOrder);
                  _setSelectedOrder(currentOrder);
                  history.push('/update-order');
                }
          
                

                return (
                  <Grid container>
                    <Grid item xs={8}>
                      <Paper>
                        <Typography variant="h6" style={{margin: 15}} >
                            Orders
                        </Typography>
                        <Divider style={{margin: 15}}/>
                        <Button
                            variant="contained" 
                            color="primary"
                            style={{marginLeft: 15, textTransform: 'none'}}
                            startIcon={<AddIcon/>}
                            onClick={() => { addOrder()}}>
                              Add Order
                        </Button>
                        <Formik
                            initialValues={{
                              searchBy: _searchBy,
                              searchTerm: _searchTerm,
                              orderBy: _orderBy
                          }}

                          validationSchema={Yup.object().shape({
                            searchBy: Yup.string()
                              .required('Required'),
                            searchTerm: Yup.string(),
                            orderBy: Yup.string()
                              .required('Required'),
                          })}

                          onSubmit={(values) => {
                            setSearchBy(values.searchBy);
                            setSearchTerm(values.searchTerm);
                            setOrderBy(values.orderBy);
                          }}>
                            {({submitForm, isSubmitting, values, dirty, setFieldValue}) => (
                              <Form style={{margin: 15}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Field
                                            type="text"
                                            label="Search By"
                                            select
                                            name="searchBy"
                                            component={TextField}
                                            fullWidth
                                        >
                                            {searchByOptions.map((option, index) => (
                                                <MenuItem key={index} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Field> 
                                    </Grid>
                                    {values.searchBy !== "All" && (
                                        <Grid item xs={4}>
                                            <Field
                                                type="text"
                                                label="Search Term"
                                                name="searchTerm"
                                                component={TextField}
                                                fullWidth
                                            />
                                        </Grid>
                                    )}
                                    <Grid item xs={4}>
                                        <Field
                                            type="text"
                                            label="Order By"
                                            select
                                            name="orderBy"
                                            component={TextField}
                                            fullWidth
                                        >
                                            {orderByOptions.map((option, index) => (
                                                <MenuItem key={index} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Field> 
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button
                                            type="submit"
                                            variant="contained" 
                                            color="primary"
                                            onClick={submitForm}
                                            style={{textTransform: 'none'}}
                                            startIcon={<SearchIcon/>}
                                        >
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                          )}
                        </Formik>
                        <br></br>
                        {orders.length !== 0 &&(
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={orders.length}
                            rowsPerPage={perPage}
                            page={currentPage}
                            backIconButtonProps={{
                              'aria-label': 'previous page'
                            }}
                            nextIconButtonProps={{
                              'aria-label': 'next page'
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                          />
                        )}
                        
                        <Paper className={classes.root}>
                          <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>OrderID</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Delivery Address</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>Order Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>      
                            </TableHead>
                            <TableBody>
                            {orders.map((row, index) => (
                              <TableRow key={index}>
                                  <TableCell component="th" scope="row">
                                    {row.OrderID}
                                  </TableCell>
                                  <TableCell>
                                    {row.CustomerName}
                                  </TableCell>
                                  <TableCell>
                                    {row.DeliveryAddress}
                                  </TableCell>
                                  <TableCell>
                                    <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={row.Total} displayType={'text'} prefix={row.Currency} />
                                  </TableCell>
                                  <TableCell>
                                    {row.OrderDate}
                                  </TableCell>
                                  <TableCell onClick={() => { setCurrentOrder(row)}}>
                                    <IconButton aria-label="edit" aria-controls="actions-menu" aria-haspopup="true" color="inherit" onClick={handleActionsMenuClick}>
                                      <MoreVertIcon/>
                                    </IconButton>
                                    <Menu
                                      id="actions-menu"
                                      anchorEl={anchorEl0}
                                      keepMounted
                                      open={Boolean(anchorEl0)}
                                      onClose={handleActionsMenuClose}
                                    >
                                      <MenuItem onClick={() => { handleActionsMenuClose(); handleViewOrder()}}>
                                        <ListItemIcon>
                                          <LaunchIcon/>
                                        </ListItemIcon>
                                        <Typography>View Order</Typography>
                                      </MenuItem>
                                      <MenuItem onClick={() => { handleActionsMenuClose(); handleEditOrder()}}>
                                        <ListItemIcon>
                                          <EditIcon/>
                                        </ListItemIcon>
                                        <Typography>Update Order</Typography>
                                      </MenuItem>
                                      <MenuItem onClick={() => { handleActionsMenuClose(); handleDeleteOrder()}}>
                                        <ListItemIcon>
                                            <DeleteIcon/>
                                        </ListItemIcon>
                                        <Typography>Delete Order</Typography>
                                      </MenuItem>
                                    </Menu>
                                  </TableCell>
                              </TableRow>
                            ))}
                            </TableBody>
                          </Table>
                        </Paper>
                        <ConfirmDialog confirmConfirmDialog={confirmConfirmDialog} open={openConfirmDialog} onClose={handleConfirmDialogClose} title={confirmDialogTitle} description={confirmDialogDescription} />
                        <MessageDialog confirmMessage={confirmMessage} open={openMessage} onClose={handleMessageClose}  description={messageDescription} />
                        <Loading open={getLoading || deleteLoading} />
                      </Paper>
                    </Grid>
                  </Grid>
                )}}
          </Subscribe>
      </Transition>
  )
}


export default Orders

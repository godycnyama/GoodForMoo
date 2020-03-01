import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import _ProductsContainer from './ProductsContainer';
import PageAnimation from '../shared/PageAnimation';
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
import Button from '@material-ui/core/Button';
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
    'Product ID',
    'Product Name'
]

const orderByOptions = [
    'Product ID_Asc',
    'Product ID_Desc',
    'Product Name_Asc',
    'Product Name_Desc'
]

const Products = () => {
    const [anchorEl0, setAnchorEl0] = useState(null);
    const [searchBy, setSearchBy] = useState(null);
    const [searchTerm, setSearchTerm] = useState(null);
    const [orderBy, setOrderBy] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [pageTotal, setPageTotal] = useState(0);
    const [currentProduct, setCurrentProduct] = useState({});
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmConfirmDialog, setConfirmConfirmDialog] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = React.useState("");
    const [confirmDialogDescription, setConfirmDialogDescription] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState(false);
    const [messageDescription, setMessageDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
  
    const BASE_URL = `${window.location.protocol}//${window.location.host}` ;

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

    const getProducts = () => {
      const query = {
        SearchBy: searchBy,
        SearchTerm: searchTerm,
        OrderBy: orderBy,
        PageNumber: currentPage,
        PageSize: perPage
      };

      executeGet({
        method: 'get',
        url: BASE_URL + '/api/products',
        data: {
          ...query
        }})
    }

    const deleteProduct = (_product) => {
      executeDelete({
        method: 'delete',
        url: BASE_URL + '/api/products/' + _product.productID ,
        })
    }
    const openConfirmDialogDialog = () => {
      setOpenConfirmDialog(true);
    };

    const handleConfirmDialogClose = value => {
      setOpenConfirmDialog(false);
      setConfirmConfirmDialog(value);
      if(value) {
          deleteProduct(currentProduct);
      }
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
        getProducts()
    }

    const handleChangeRowsPerPage = event => {
        setPerPage(parseInt(event.target.value), 10);
        setCurrentPage(0);
        getProducts()
    }

    const addProduct = () => {
        history.push('/create-product');
    }

    const handleActionsMenuClick = event => {
        setAnchorEl0(event.currentTarget);
    }
  
    const handleActionsMenuClose = () => {
        setAnchorEl0(null);
    }

    const handleDeleteProduct = () => {
      setConfirmDialogTitle('Delete Product');
      setConfirmDialogDescription(`Are you sure you want to delete product with ID: ${currentProduct.productID}`);
      openConfirmDialogDialog();
  }

  const handleMessageClose = value => {
    setOpenMessage(false);
    setConfirmMessage(value);
  };

  if(getData){
    setProducts(getData.data)
  }

  if( getError ) {
    setMessageDescription(getError.message);
    setOpenMessage(true);
  } 

  if( deleteError ) {
    setMessageDescription(deleteError.message);
    setOpenMessage(true);
  } 

  if( deleteData ) {
    setMessageDescription(deleteData.message);
    setOpenMessage(true);
  } 

  
  
  return (
      <Transition>
          <Subscribe to = {[_ProductsContainer]}>
            {(productsStore) => {
                const { state: {_products, _currentPage, _perPage, _pageTotal, _searchBy, _searchTerm, _orderBy }, 
                setSelectedProduct, 
                _setProducts, 
                _setCurrentPage,
                _setPageTotal, 
                _setPerPage,
                _setSearchBy,
                _setSearchTerm,
                _setOrderBy } = productsStore;;
                setProducts(_products);
                setCurrentPage(_currentPage);
                setPerPage(_perPage);
                setPageTotal(_pageTotal);

                const handleViewProduct = () => {
                  _setProducts(products);
                  _setCurrentPage(currentPage);
                  _setPerPage(perPage);
                  _setPageTotal(pageTotal);
                  _setSearchBy(searchBy);
                  _setSearchTerm(searchTerm);
                  _setOrderBy(orderBy);
                  setSelectedProduct(currentProduct);
                  history.push('/view-product');
                }
          
                const handleEditProduct = () => {
                  _setProducts(products);
                  _setCurrentPage(currentPage);
                  _setPerPage(perPage);
                  _setPageTotal(pageTotal);
                  _setSearchBy(searchBy);
                  _setSearchTerm(searchTerm);
                  _setOrderBy(orderBy);
                  setSelectedProduct(currentProduct);
                  history.push('/update-product');
                }

                return (
                  <Grid container>
                    <Grid item xs={8}>
                      <Paper>
                        <Typography variant="h6" style={{margin: 15}} >
                            Products
                        </Typography>
                        <Divider style={{margin: 15}}/>
                        <Button
                            variant="contained" 
                            color="primary"
                            style={{marginLeft: 15, textTransform: 'none'}}
                            startIcon={<AddIcon/>}
                            onClick={() => { addProduct()}}>
                              Add Product
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
                        {products.length !== 0 &&(
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={products.length}
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
                                    <TableCell>Product ID</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Unit Price</TableCell>
                                    <TableCell>Unit of Measure</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>      
                            </TableHead>
                            <TableBody>
                            {products.map((row, index) => (
                              <TableRow key={index}>
                                  <TableCell component="th" scope="row">
                                    {row.productID}
                                  </TableCell>
                                  <TableCell>
                                    {row.productName}
                                  </TableCell>
                                  <TableCell>
                                    <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={row.unitPrice} displayType={'text'} prefix={row.currency} />
                                  </TableCell>
                                  <TableCell>
                                    {row.unitOfMeasure}
                                  </TableCell>
                                  <TableCell onClick={() => { setCurrentProduct(row)}}>
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
                                      <MenuItem onClick={() => { handleActionsMenuClose(); handleViewProduct()}}>
                                        <ListItemIcon>
                                          <LaunchIcon/>
                                        </ListItemIcon>
                                        <Typography>View Product</Typography>
                                      </MenuItem>
                                      <MenuItem onClick={() => { handleActionsMenuClose(); handleEditProduct()}}>
                                        <ListItemIcon>
                                          <EditIcon/>
                                        </ListItemIcon>
                                        <Typography>Update Product</Typography>
                                      </MenuItem>
                                      <MenuItem onClick={() => { handleActionsMenuClose(); handleDeleteProduct()}}>
                                        <ListItemIcon>
                                            <DeleteIcon/>
                                        </ListItemIcon>
                                        <Typography>Delete Product</Typography>
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
                        <Loading open={loading} />
                      </Paper>
                    </Grid>
                  </Grid>
                )}}
          </Subscribe>
      </Transition>
  )
}


export default Products

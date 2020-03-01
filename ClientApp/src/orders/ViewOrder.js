import React from 'react';
import { Subscribe } from 'unstated';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Table, TableHead, TableBody,TableRow, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import _OrdersContainer from './OrdersContainer';
import Transition  from '../shared/Transition';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    }
  })

const ViewOrder = () => {
    const classes = useStyles();

    return (
        <Transition>
          <Subscribe to = {[_OrdersContainer]}>
          { ordersStore => {
            const { state: { selectedOrder }} = ordersStore;
            return (
              <Grid container>
                <Grid item xs={12} lg={6}>
                  <Paper>
                    <div style={{margin: 15}}>
                      <Typography variant="h6" >
                          View Order
                      </Typography>
                      <Divider/>
                      <br/>
                      <p><b>Order ID:</b> {selectedOrder.OrderID}</p>
                      <p><b>Customer Name:</b> {selectedOrder.CustomerName}</p>
                      <p><b>Order Total:</b> <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={selectedOrder.Total} displayType={'text'} prefix={selectedOrder.Currency} /></p>
                      <p><b>Order Date:</b> {selectedOrder.OrderDate}</p>
                      <p><b>Delivery Date:</b> {selectedOrder.DeliveryDate}</p>
                    </div>
                    <br/>
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product ID</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Unit Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>      
                            </TableHead>
                            <TableBody>
                            {selectedOrder.OrderDetails.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {row.Product.ProductID}
                                </TableCell>
                                <TableCell>
                                    {row.Product.ProductName}
                                </TableCell>
                                <TableCell>
                                    <NumberFormat thousandSeparator={true} decimalSeparator={'.'} decimalScale={2} value={row.Product.UnitPrice} displayType={'text'} prefix={row.Product.Currency} />
                                </TableCell>
                                <TableCell>
                                    {row.Product.Quantity} {row.Product.UnitOfMeasure}
                                </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                    
                  </Paper>
                </Grid>
              </Grid>
            )
          }}
          </Subscribe>
        </Transition>
        )
}

export default ViewOrder

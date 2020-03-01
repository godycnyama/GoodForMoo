using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DataAccess;
using WebApplication1.DataModels;

namespace WebApplication1.Services
{
    public class OrdersService: IOrdersService
    {
        DataAccessContext db;
        public OrdersService(DataAccessContext c)
        {
            db = c;
        }
        CultureInfo en = new CultureInfo("en");

        //Get products records
        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            return await db.Orders.ToListAsync();
        }

        //Get order by records
        public async Task<IQueryable<Order>> GetOrdersBy(SearchParameters searchParameters)
        {
            if (searchParameters.SearchBy == "OrderID")
            {
                var orders = await db.Orders.Where(i => i.OrderID == Convert.ToInt64(searchParameters.SearchTerm))
                  .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                  .Take(searchParameters.PageSize)
                  .ToListAsync();

                return sortBy(orders.AsQueryable(), searchParameters);


            }

            if (searchParameters.SearchBy == "CustomerID")
            {
                var orders = await db.Orders.Where(i => i.CustomerID == Convert.ToInt64(searchParameters.SearchTerm))
                  .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                  .Take(searchParameters.PageSize)
                  .ToListAsync();
                
                return sortBy(orders.AsQueryable(), searchParameters);
                

            }
            else if (searchParameters.SearchBy == "Order Date")
            {
                var orders = await db.Orders.Where(i => i.OrderDate == DateTime.ParseExact(searchParameters.Date, "dd/mm/yyyy", en))
                   .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                   .Take(searchParameters.PageSize)
                   .ToListAsync(); 

                    return sortBy(orders.AsQueryable(), searchParameters);
                
            }

            else if (searchParameters.SearchBy == "Delivery Date")
            {
                var orders = await db.Orders.Where(i => i.DeliveryDate == DateTime.ParseExact(searchParameters.Date, "dd/mm/yyyy", en))
                   .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                   .Take(searchParameters.PageSize)
                   .ToListAsync();

                return sortBy(orders.AsQueryable(), searchParameters);

            }
            else
            {
                var orders = await db.Orders
                    .Skip((searchParameters.PageNumber - 1) * searchParameters.PageSize)
                    .Take(searchParameters.PageSize)
                    .ToListAsync();

                return sortBy(orders.AsQueryable(), searchParameters);
            };
        }
        //Add new order record     
        public async Task AddOrder(OrderDTO orderDTO)
        {
            
            CultureInfo en = new CultureInfo("en");

            /*
            // convert delivery date date string into DateTime object
            DateTime deliveryDate;
            try
            {
                deliveryDate = DateTime.ParseExact(orderDTO.deliveryDate, "dd/mm/yyyy", en);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            */

            //search for a product record to get the price
            Product product = await db.Products.FindAsync(orderDTO.ProductID);

            if (product == null)
            {
                throw new Exception("Product not found");
            }

            //search for a customer record
            Customer customer = await db.Customers.FindAsync(orderDTO.CustomerID);

            if (customer == null)
            {
                throw new Exception("Customer not found");
            }

            Order order = new Order
            {
                CustomerID = customer.CustomerID,
                Total = product.UnitPrice * orderDTO.Quantity,
                OrderDate = new DateTime(),
                DeliveryDate = DateTime.ParseExact(orderDTO.DeliveryDate, "dd/mm/yyyy", en)
            };

            order.OrderDetails.Add(
                new OrderDetail
                {
                    Order = order,
                    Product = product,
                    Quantity = orderDTO.Quantity,
                });

            db.Orders.Add(order);
            await db.SaveChangesAsync();
        }   
        //Update order record   
        public async Task UpdateOrder(int id, OrderDTO orderDTO)
        {
            
            CultureInfo en = new CultureInfo("en");
            /*
            // convert delivery date date string into DateTime object
            DateTime deliveryDate;
            try
            {
                deliveryDate = DateTime.ParseExact(orderDTO.deliveryDate, "dd/mm/yyyy", en);
            }
            catch (FormatException ex)
            {
                throw new Exception(ex.Message);
            }
            */

            //search for order record
            Order order = await db.Orders.FindAsync(id);

            if (order == null)
            {
                throw new Exception("Order not found");
            }

            //search for a product record to get the price
            Product product = await db.Products.FindAsync(orderDTO.ProductID);

            if (product == null)
            {
                throw new Exception("Product not found");
            }

            //search for a customer record
            Customer customer = await db.Customers.FindAsync(orderDTO.CustomerID);

            if (customer == null)
            {
                throw new Exception("Customer not found");
            }

            order.CustomerID = customer.CustomerID;
            order.Total = product.UnitPrice * orderDTO.Quantity;
            order.DeliveryDate = DateTime.ParseExact(orderDTO.DeliveryDate, "dd/mm/yyyy", en);

            //update orderDetail
            order.OrderDetails.Clear();
            order.OrderDetails.Add(
                new OrderDetail
                {
                    Order = order,
                    Product = product,
                    Quantity = orderDTO.Quantity,
                });
            
            db.Orders.Update(order);

            await db.SaveChangesAsync();
        }
        //Get order record   
        public async Task<Order> GetOrder(int id)
        {
           return await db.Orders.FindAsync(id);
        }

        //Delete order record   
        public async Task DeleteOrder(int id)
        {
            Order order = await db.Orders.FindAsync(id);
            if (order == null)
            {
                throw new Exception("Order not found");
            }
            db.Orders.Remove(order);
            await db.SaveChangesAsync();
        }

        private IQueryable<Order> sortBy(IQueryable<Order> _orders, SearchParameters searchParameters)
        {
            switch (searchParameters.OrderBy)
            {
                case "Order ID_Asc":
                    _orders.OrderBy(on => on.OrderID);
                    break;
                case "Order ID_Desc":
                    _orders.OrderByDescending(on => on.OrderID);
                    break;
                case "Customer ID_Asc":
                    _orders.OrderBy(on => on.CustomerID);
                    break;
                case "Customer ID_Desc":
                    _orders.OrderByDescending(on => on.CustomerID);
                    break;
                case "Order Date_Asc":
                    _orders.OrderBy(on => on.OrderDate);
                    break;
                case "Order Date_Desc":
                    _orders.OrderByDescending(on => on.OrderDate);
                    break;
                case "Delivery Date_Asc":
                    _orders.OrderBy(on => on.DeliveryDate);
                    break;
                case "Delivery Date_Desc":
                    _orders.OrderByDescending(on => on.DeliveryDate);
                    break;
                default:
                    _orders.OrderBy(on => on.OrderDate);
                    break;
            }
            return _orders; 
        }

    }
}

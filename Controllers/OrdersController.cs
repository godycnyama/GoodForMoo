using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DataModels;
using WebApplication1.Services;


namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersService _ordersService;
        public OrdersController(IOrdersService ordersService)
        {
            this._ordersService = ordersService;
        }

        // GET: api/orders/getAllOrders
        [Route("api/orders/getAllOrders")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _ordersService.GetAllOrders();
                if (orders == null)
                {
                    return BadRequest("No orders found!");
                }
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/orders/getOrdersBy
        [Route("api/orders/getOrdersBy")]
        [HttpGet]
        public async Task<IActionResult> GetOrdersBy([FromQuery] SearchParameters searchParameters)
        {
            try
            {
                var orders = await _ordersService.GetOrdersBy(searchParameters);
                if (orders == null)
                {
                    return BadRequest("No orders found!");
                }
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/orders/5
        [Route("api/orders/{id}")]
        [HttpGet]
        public async Task<IActionResult> Get(int id)
        {
            var order = await _ordersService.GetOrder(id);
            if(order == null)
            {
                return BadRequest("Order not found");
            }
            return Ok(order);
        }

        // POST: api/orders
        [Route("api/orders")]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OrderDTO orderDAO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            } 

            try
            {
                await _ordersService.AddOrder(orderDAO);
                return Ok("Order record added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/orders/5
        [Route("api/orders/{id}")]
        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] OrderDTO orderDAO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            } 

            try
            {
                await _ordersService.UpdateOrder(id, orderDAO);
                return Ok("Order record updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/orders/5
        [Route("api/orders/{id}")]
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _ordersService.DeleteOrder(id);
                return Ok("Order record deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

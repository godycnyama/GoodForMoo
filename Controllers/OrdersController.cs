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
    [Route("/api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersService _ordersService;
        public OrdersController(IOrdersService ordersService)
        {
            this._ordersService = ordersService;
        }

        // GET: /api/orders/getAllOrders
        [HttpGet("getAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var orders = await _ordersService.GetAllOrders();
                var _orders = orders.ToArray();
                if (_orders.Length == 0)
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

        // GET: /api/orders/getOrdersBy
        [HttpGet("getOrdersBy")]
        public async Task<IActionResult> GetOrdersBy([FromQuery] SearchParameters searchParameters)
        {
            try
            {
                var orders = await _ordersService.GetOrdersBy(searchParameters);
                var _orders = orders.ToArray();
                if (_orders.Length == 0)
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

        // GET: /api/orders/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var order = await _ordersService.GetOrder(id);
            if(order == null)
            {
                return BadRequest("Order not found");
            }
            return Ok(order);
        }

        // POST: /api/orders
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] OrderDTO orderDTO)
        {
            try
            {
                await _ordersService.AddOrder(orderDTO);
                return Ok("Order record added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: /api/orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromForm] OrderDTO orderDTO)
        {
            try
            {
                await _ordersService.UpdateOrder(id, orderDTO);
                return Ok("Order record updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: /api/orders/5
        [HttpDelete("{id}")]
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

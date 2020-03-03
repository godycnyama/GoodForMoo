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
    [Route("/api/customers")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomersService _customersService;
        public CustomersController(ICustomersService customersService)
        {
            this._customersService = customersService;
        }
        // GET: /api/customers/getAllCustomers
        [HttpGet("getAllCustomers")]
        public async Task<IActionResult> GetAllCustomers()
        {
            try
            {
                var customers = await _customersService.GetAllCustomers();
                var _customers = customers.ToArray();
                if (_customers.Length == 0)
                {
                    return BadRequest("No customers found!");
                }
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: /api/customers/getCustomersBy
        [HttpGet("getCustomersBy")]
        public async Task<IActionResult> GetCustomersBy([FromQuery] SearchParameters searchParameters)
        {
            try
            {
                var customers = await _customersService.GetCustomersBy(searchParameters);
                var _customers = customers.ToArray();
                if (_customers.Length == 0)
                {
                    return BadRequest("No customers found!");
                }
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // GET: /api/customers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var customer = await _customersService.GetCustomer(id);
                if (customer == null)
                {
                    return BadRequest("Customer not found!");
                }
                return Ok(customer);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: /api/customers
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] CustomerDTO customerDTO)
        {
            try
            {
                await _customersService.AddCustomer(customerDTO);
                return Ok("Customer record added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: /api/customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromForm] CustomerDTO customerDTO)
        {
            try
            {
                await _customersService.UpdateCustomer(id,customerDTO);
                return Ok("Customer record updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: /api/customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _customersService.DeleteCustomer(id);
                return Ok("Customer record deleted successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DataModels;

namespace WebApplication1.Services
{
   public interface ICustomersService
    {
        public Task<IEnumerable<Customer>> GetAllCustomers();
        public Task<IQueryable<Customer>> GetCustomersBy(SearchParameters searchParameters);
        public Task AddCustomer(CustomerDTO customerDTO);
        public Task UpdateCustomer(int id, CustomerDTO customerDTO);
        public Task<Customer> GetCustomer(int id);
        public Task DeleteCustomer(int id);
    }
}

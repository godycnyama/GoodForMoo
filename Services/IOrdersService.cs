using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.DataModels;

namespace WebApplication1.Services
{
   public interface IOrdersService
    {
        public Task<IEnumerable<Order>> GetAllOrders();
        public Task<IQueryable<Order>> GetOrdersBy(SearchParameters searchParameters);
        public Task AddOrder(OrderDTO orderDTO);
        public Task UpdateOrder(int id, OrderDTO orderDTO);
        public Task<Order> GetOrder(int id);
        public Task DeleteOrder(int id);
    }
}

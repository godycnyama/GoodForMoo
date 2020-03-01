using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DataModels
{
    public class OrderDTO
    {
        public OrderDTO()
        {

        }
        [Required]
        [MaxLength(50)]
        public int CustomerID { get; set; }
        [Required]
        [MaxLength(50)]
        public int ProductID { get; set; }
        [Required]
        [MaxLength(50)]
        public int Quantity { get; set; }
        [Required]
        public string DeliveryDate { get; set; }
    }
}

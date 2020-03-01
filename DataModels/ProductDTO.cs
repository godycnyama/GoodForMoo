using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DataModels
{
    public class ProductDTO
    {
        public ProductDTO()
        {

        }
        [Required]
        [MaxLength(50)]
        public string ProductName { get; set; }
        [Required]
        public decimal UnitPrice { get; set; }
        [Required]
        [MaxLength(10)]
        public string Currency { get; set; }
        [Required]
        [MaxLength(50)]
        public string UnitOfMeasure { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.DataModels
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderID { get; set; }
        [Required]
        public int CustomerID { get; set; }
        [Required]
        [ForeignKey("CustomerID")]
        public Customer Customer { get; set; }
        [Required]
        public DateTime OrderDate { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        [Required]
        public decimal Total { get; set; }
        [Required]
        public DateTime DeliveryDate { get; set; }
        [Required]
        public ICollection<OrderDetail> OrderDetails { get; set; }

    }
}

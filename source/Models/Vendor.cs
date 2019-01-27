﻿
using System.Data;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using source.Database;

namespace source.Models
{

    public class Vendor
    {
        public int id { get; set; }
        public string userName { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public int addressId { get; set; }
        public string website { get; set; }
        public string phoneNumber { get; set; }
    }
}
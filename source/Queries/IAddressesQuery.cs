﻿using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;

namespace source.Queries
{
    public interface IAddressesQuery
    {
        Task Deactivate(string userName);
        Task Reactivate(string userName);
        Task<List<Address>> GetAll();
        Task<Address> GetById(int id);
        Task<int> Insert(Address address);
        Task Update(Address address);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.UserEntities;
using Persistence.Dto;

namespace Persistence.ServiceContracts
{
    public interface IJwtService
    {
        public AuthenticationResponse GenerateToken(AppUser user);
    }
}
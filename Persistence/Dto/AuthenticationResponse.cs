using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Persistence.Dto
{
    public class AuthenticationResponse
    {
        public string? Token { get; set; }
        public string? Name { get; set; }
        public DateTime Expiration { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiration { get; set; }
    }
}
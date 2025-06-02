using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Domain.UserEntities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Persistence.Dto;
using Persistence.ServiceContracts;

namespace Persistence.Services
{
    public class JwtService : IJwtService
    {
        public IConfiguration _configuration;
        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public AuthenticationResponse GenerateToken(AppUser user)
        {
            var now = DateTime.UtcNow;
            var expiration = now.AddMinutes(Convert.ToDouble(_configuration["Jwt:Expiration"]));

            Claim[] claims =
            [
                new (JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new (JwtRegisteredClaimNames.Iat, new DateTimeOffset(expiration).ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
                new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new (ClaimTypes.Name, user.UserName ?? "")
            ];

            SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_configuration["Jwt:key"] ?? ""));

            SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

            JwtSecurityToken token = new(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: expiration,
            signingCredentials: credentials
            );
            var tokenHandler = new JwtSecurityTokenHandler();
            var generatedToken = tokenHandler.WriteToken(token);


            return new AuthenticationResponse()
            {
                Name = user.UserName,
                Token = generatedToken,
                Expiration = expiration,
                RefreshToken = GenerateRefreshToken(),
                RefreshTokenExpiration = now.AddMinutes(Convert.ToDouble(_configuration["RefreshToken:Expiration"]))
            };

        }

        private string GenerateRefreshToken()
        {
            byte[] bytes = new byte[64];
            var randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }
    }
}
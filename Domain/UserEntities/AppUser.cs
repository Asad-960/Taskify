using Microsoft.AspNetCore.Identity;

namespace Domain.UserEntities;


public class AppUser : IdentityUser<Guid>
{
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpirationDate { get; set; }
}
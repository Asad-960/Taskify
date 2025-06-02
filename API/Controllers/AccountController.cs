using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dto;
using Domain.UserEntities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence.ServiceContracts;

namespace API.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="userManager"></param>
    /// <param name="jwtService"></param>
    [Route("[controller]/[action]")]
    public class AccountController(UserManager<AppUser> userManager, IJwtService jwtService) : ControllerBase
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto user)
        {
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }

            if (user == null)
            {
                ModelState.AddModelError("User", "Incorrect User Information");
                return BadRequest(ModelState);
            }
            var usr = await userManager.FindByEmailAsync(user?.Email ?? "");
            if (usr == null)
            {
                ModelState.AddModelError("Email", "No user with such Email");
                return BadRequest(ModelState);
            }
            if (!await userManager.CheckPasswordAsync(usr, user?.Password ?? ""))
            {
                ModelState.AddModelError("Password", "Incorrect Password");
                return BadRequest(ModelState);
            }

            var authenticationresponse = jwtService.GenerateToken(usr);

            usr.RefreshToken = authenticationresponse.RefreshToken;
            usr.RefreshTokenExpirationDate = authenticationresponse.RefreshTokenExpiration;

            await userManager.UpdateAsync(usr);


            return Ok(authenticationresponse);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="registerDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDto? registerDto)
        {
            System.Console.WriteLine(registerDto?.Email);
            System.Console.WriteLine(registerDto?.Name);
            System.Console.WriteLine(registerDto?.Password);
            System.Console.WriteLine(registerDto?.ConfirmPassword);
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }
            if (registerDto == null)
            {
                return BadRequest("Invalid data");
            }
            AppUser? email = await userManager.FindByEmailAsync(registerDto.Email ?? "");
            if (email != null)
            {
                ModelState.AddModelError("Email", "Email already exists");
                return BadRequest(ModelState);
            }
            var user = new AppUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Name,
            };
            IdentityResult result = await userManager.CreateAsync(user, registerDto.Password ?? "");
            if (result.Succeeded == false)
            {
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return BadRequest(ModelState);
            }
            return Ok();
        }
    }
}
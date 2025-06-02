using Application.Dto;
using AutoMapper;
using Domain;
using SQLitePCL;

namespace Application.MappingProfiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TaskItem, TaskResponse>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
            .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Category != null ? src.Category.Color : null));
        CreateMap<TaskResponse, TaskItem>();
        CreateMap<TaskRequest, TaskItem>();
        CreateMap<CategoryDto, Category>();
        CreateMap<Category, CategoryDto>();
    }
}
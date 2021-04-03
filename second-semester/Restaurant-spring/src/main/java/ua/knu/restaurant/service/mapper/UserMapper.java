package ua.knu.restaurant.service.mapper;

import org.mapstruct.Mapper;
import ua.knu.restaurant.dto.user.UserReadDto;
import ua.knu.restaurant.dto.user.UserWriteDto;
import ua.knu.restaurant.persistence.domain.User;

@Mapper(componentModel = "spring", config = CommonMapper.class)
public interface UserMapper extends CommonMapper<UserReadDto, UserWriteDto, User> {
}

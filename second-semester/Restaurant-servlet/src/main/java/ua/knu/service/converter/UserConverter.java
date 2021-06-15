package ua.knu.service.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import ua.knu.persistence.model.User;

public class UserConverter extends AbstractConverter<User> {
    @Override
    public User toEntity(String json) throws JsonProcessingException {
        return objectMapper.readValue(json, User.class);
    }
}

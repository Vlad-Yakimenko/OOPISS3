package ua.knu.service.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import ua.knu.persistence.model.Credentials;

public class CredentialsConverter extends AbstractConverter<Credentials> {
    @Override
    public Credentials toEntity(String json) throws JsonProcessingException {
        return objectMapper.readValue(json, Credentials.class);
    }
}

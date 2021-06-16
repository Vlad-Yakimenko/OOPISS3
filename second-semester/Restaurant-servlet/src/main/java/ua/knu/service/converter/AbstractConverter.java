package ua.knu.service.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class AbstractConverter<E> {

    protected static final ObjectMapper objectMapper = new ObjectMapper();

    public String toJson(E entity) throws JsonProcessingException {
        return objectMapper.writeValueAsString(entity);
    }

    public abstract E toEntity(String json) throws JsonProcessingException;

    public static ObjectMapper getObjectMapper() {
        return objectMapper;
    }
}

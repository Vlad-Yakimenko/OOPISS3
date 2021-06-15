package ua.knu.service.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ua.knu.persistence.model.Credentials;

import static org.junit.jupiter.api.Assertions.*;

class CredentialsConverterTest {

    private String credentialsJson;
    private Credentials credentialsEntity;

    private CredentialsConverter credentialsConverter;

    @BeforeEach
    void setUp() {
        credentialsJson = "{\"username\":\"username\",\"password\":\"password\"}";
        credentialsEntity = new Credentials()
                .setUsername("username")
                .setPassword("password");

        credentialsConverter = new CredentialsConverter();
    }

    @Test
    void toJson() throws JsonProcessingException {
        assertEquals(credentialsEntity, credentialsConverter.toEntity(credentialsJson));
    }

    @Test
    void toEntity() throws JsonProcessingException {
        assertEquals(credentialsJson, credentialsConverter.toJson(credentialsEntity));
    }
}

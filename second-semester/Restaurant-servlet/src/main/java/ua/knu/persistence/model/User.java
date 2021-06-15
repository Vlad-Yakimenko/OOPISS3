package ua.knu.persistence.model;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class User {

    public enum ROLE {
        ADMIN, USER, GUEST
    }

    private Long id;
    private String username;
    private String password;
    private ROLE role;
    private Integer balance;
}

package ua.knu.persistence.model;

import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;

@Data
@Accessors(chain = true)
public class Credentials implements Serializable {

    private static final long serialVersionUID = 867988443265641124L;

    private String username;
    private String password;
}

package ua.knu.persistence.model;

import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;

@Data
@Accessors(chain = true)
public class Dish implements Serializable {

    private static final long serialVersionUID = 7007068566729218748L;

    private Integer id;

    private String name;

    private Double price;

    private String description;
}

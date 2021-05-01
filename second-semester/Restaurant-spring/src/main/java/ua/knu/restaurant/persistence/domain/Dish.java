package ua.knu.restaurant.persistence.domain;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "dishes")
@Data
public class Dish implements Serializable {

    private static final long serialVersionUID = 7007068566729218748L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dish_id")
    private Integer id;

    private String name;

    private Double price;

    private String description;
}

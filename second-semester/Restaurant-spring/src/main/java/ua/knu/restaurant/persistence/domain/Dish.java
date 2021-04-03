package ua.knu.restaurant.persistence.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "dishes")
@Data
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dish_id")
    private Integer id;

    private String name;

    private Double price;

    private String description;
}

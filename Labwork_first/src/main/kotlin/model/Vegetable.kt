package model

abstract class Vegetable() : SaladComponent()

class Cucumber(override var price: Int, override var weight: Int) : Vegetable() {
    override var cal: Int = 15
}

class Tomato(override var price: Int, override var weight: Int) : Vegetable() {
    override var cal: Int = 18
}

class Radish(override var price: Int, override var weight: Int) : Vegetable() {
    override var cal: Int = 16
}
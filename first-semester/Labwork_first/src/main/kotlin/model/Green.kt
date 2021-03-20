package model

abstract class Green : SaladComponent()

class Kale(override var price: Int, override var weight: Int) : Green() {
    override var cal: Int = 49
}

class Spinach(override var price: Int, override var weight: Int) : Green() {
    override var cal: Int = 23
}

class Dill(override var price: Int, override var weight: Int) : Green() {
    override var cal: Int = 23
}
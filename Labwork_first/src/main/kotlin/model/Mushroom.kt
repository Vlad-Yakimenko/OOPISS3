package model

abstract class Mushroom() : SaladComponent()

class WhiteButton(override var price: Int, override var weight: Int) : Mushroom() {
    override var cal: Int = 22
}

class Shiitake(override var price: Int, override var weight: Int) : Mushroom() {
    override var cal: Int = 34
}

class Beech(override var price: Int, override var weight: Int) : Mushroom() {
    override var cal: Int = 26
}
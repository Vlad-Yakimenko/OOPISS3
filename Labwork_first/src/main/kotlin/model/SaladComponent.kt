package model

abstract class SaladComponent {
    abstract val cal: Int
    abstract val price: Int
    abstract val weight: Int

    override fun toString(): String = "[${this.javaClass.simpleName}: cal = $cal, price = $price, weight = $weight]"
}
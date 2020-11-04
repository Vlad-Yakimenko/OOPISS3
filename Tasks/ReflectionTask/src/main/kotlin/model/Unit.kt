package model

class Unit(private val name: String, private val age: Int): Comparable<Unit> {

    override fun compareTo(other: Unit): Int {
        return this.age.compareTo(other.age)
    }
}
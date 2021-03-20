package model

data class Unit(private var name: String, private var age: Int) : Testable, Comparable<Unit> {

    override fun test() {
        // do nothing
    }

    override fun compareTo(other: Unit): Int {
        return this.age.compareTo(other.age)
    }
}
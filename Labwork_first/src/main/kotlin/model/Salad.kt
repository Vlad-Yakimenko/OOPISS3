package model

class Salad(private val ingredients: MutableList<SaladComponent>) {

    fun calculateCals(): Double = ingredients.sumByDouble { it.cal * (it.weight / 100.0) }

    fun sortedByComponent(comparator: Comparator<SaladComponent>) = ingredients.sortedWith(comparator)

    fun filteredByCal(start: Int, end: Int): List<SaladComponent> = ingredients.filter { it.cal in start..end }

    override fun toString(): String = ingredients.toString()

    class Builder {
        private var ingredients: MutableList<SaladComponent> = mutableListOf()

        fun add(saladComponent: SaladComponent): Builder {
            ingredients.add(saladComponent)
            return this
        }

        fun build() = Salad(ingredients)
    }
}
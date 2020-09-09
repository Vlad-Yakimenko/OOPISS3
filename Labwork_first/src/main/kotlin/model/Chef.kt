package model

class Chef {

    private val salad: MutableList<SaladComponent> = mutableListOf()

    fun addComponent(component: SaladComponent) = salad.add(component)

    fun calculateCals() : Double = salad.sumByDouble { it.cal * (it.weight / 100.0) }

    fun sortByComponent(comparator: Comparator<SaladComponent>) = salad.sortWith(comparator)

    fun filterByCal(start: Int, end: Int): List<SaladComponent> = salad.filter { it.cal in start..end }

    override fun toString(): String = salad.toString()
}
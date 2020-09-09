package controller.command

import model.Chef
import model.SaladComponent

class Sort(private val chef: Chef) : Command {
    override fun canProcess(command: String): Boolean = command.startsWith("sort")

    override fun process(command: String): String {
        val params = command.split(" ")

        if (params.size != 3) throw IllegalArgumentException("Expected amount of words 3, but actual: " + params.size)

        val comparator: Comparator<SaladComponent> = when (params[2]) {
            "cal" -> Comparator { o1, o2 -> o1.cal - o2.cal }
            "price" -> Comparator { o1, o2 -> o1.price - o2.price }
            "weight" -> Comparator { o1, o2 -> o1.weight - o2.weight }
            else -> throw IllegalArgumentException("Unresolved sorting parameter: " + params[2])
        }

        chef.sortByComponent(comparator)

        return "Ingredients sorted successfully"
    }
}
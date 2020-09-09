package controller.command

import model.Chef

class Find(private val chef: Chef) : Command {

    override fun canProcess(command: String): Boolean = command.startsWith("find")

    override fun process(command: String): String {
        val params = command.split(" ")

        if (params.size != 3) throw IllegalArgumentException("Expected amount of parameters 3, but actual: " + params.size)

        return try {
            val start = params[1].toInt()
            val end = params[2].toInt()
            chef.filterByCal(start, end).toString()
        } catch (e: NumberFormatException) {
            throw IllegalArgumentException("Incorrect params, try again, numbers must be integers")
        }
    }
}
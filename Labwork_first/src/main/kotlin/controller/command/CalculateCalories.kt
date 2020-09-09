package controller.command

import model.Chef

class CalculateCalories(private val chef: Chef) : Command {

    override fun canProcess(command: String): Boolean = command.startsWith("calories")

    override fun process(command: String): String = "Sum of calories: " + chef.calculateCals()
}
package controller.command

import model.Salad

class CalculateCalories(private val salad: Salad) : Command {

    override fun canProcess(command: String): Boolean = command.startsWith("calories")

    override fun process(command: String): String = "Sum of calories: " + salad.calculateCals()
}
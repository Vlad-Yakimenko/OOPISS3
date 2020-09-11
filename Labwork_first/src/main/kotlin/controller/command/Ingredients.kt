package controller.command

import model.Salad

class Ingredients(private val salad: Salad) : Command {

    override fun canProcess(command: String): Boolean = command.startsWith("ingredients")

    override fun process(command: String): String = salad.toString()
}
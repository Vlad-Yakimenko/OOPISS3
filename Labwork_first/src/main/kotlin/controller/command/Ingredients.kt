package controller.command

import model.Chef

class Ingredients(private val chef: Chef) : Command {

    override fun canProcess(command: String): Boolean = command.startsWith("ingredients")

    override fun process(command: String): String = chef.toString()
}
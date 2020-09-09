package controller.command

import model.*

class Add(private val chef: Chef) : Command {

    override fun canProcess(command: String): Boolean = command.startsWith("add")

    override fun process(command: String): String? {
        val parametersToAdd = command.split(" ")

        if (parametersToAdd.size != 4) throw IllegalArgumentException("Expected amount of parameters 4, but actual: " + parametersToAdd.size)

        val price = parametersToAdd[2].toInt()
        val weight = parametersToAdd[3].toInt()

        val component: SaladComponent = when (parametersToAdd[1]) {
            "cucumber" -> Cucumber(price, weight)
            "tomato" -> Tomato(price, weight)
            "radish" -> Radish(price, weight)
            "kale" -> Kale(price, weight)
            "spinach" -> Spinach(price, weight)
            "dill" -> Dill(price, weight)
            "white_button" -> WhiteButton(price, weight)
            "shiitake" -> Shiitake(price, weight)
            "beech" -> Beech(price, weight)
            else -> throw IllegalArgumentException("Nu such ingredient: " + parametersToAdd[1])
        }

        chef.addComponent(component)

        return null
    }
}
package controller

import controller.command.*
import model.Chef
import view.View

class MainController(private val view: View) {

    private val chef = Chef()

    private val commands: List<Command> =
        listOf(Add(chef), CalculateCalories(chef), Ingredients(chef), Find(chef), Sort(chef), Help(), Exit(view))

    fun run() {
        doWork()
    }

    private fun doWork() {
        view.write("Let's make salad!")

        while (true) {
            view.write("Please, enter option or help for info.")
            val input = view.read()

            for (command in commands) {
                try {
                    if (command.canProcess(input!!)) {
                        command.process(input)?.let { println(it) }
                        break
                    }
                } catch (e: Exception) {
                    println(e.message)
                }
            }
        }
    }
}
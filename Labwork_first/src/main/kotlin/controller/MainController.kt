package controller

import controller.command.*
import model.Salad
import view.View

class MainController(private val view: View) {

    private val saladBuilder = Salad.Builder()
    private lateinit var salad: Salad

    private var commands: List<Command> =
        listOf(Add(saladBuilder), Help(), Exit(view))

    private var message: String = "Please, add ingredients and mix them when finish to make salad ;)"

    fun run() {
        doWork()
    }

    private fun doWork() {
        view.write("Let's make salad!")

        while (true) {
            view.write(message)
            val input = view.read()

            for (command in commands) {
                try {
                    if (command.canProcess(input!!)) {
                        command.process(input)?.let { println(it) }
                        break
                    } else if (input.startsWith("mix")) {
                        salad = saladBuilder.build()

                        commands = listOf(
                            CalculateCalories(salad),
                            Find(salad),
                            Ingredients(salad),
                            Sort(salad),
                            Help(),
                            Exit(view)
                        )

                        message = "Enter option or help for info."
                        break
                    }
                } catch (e: Exception) {
                    println(e.message)
                }
            }
        }
    }
}
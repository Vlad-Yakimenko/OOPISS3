package controller.command

import view.View
import kotlin.system.exitProcess

class Exit(private val view: View) : Command {

    override fun canProcess(command: String): Boolean = command.startsWith("exit")

    override fun process(command: String): String? {
        view.write("Goodbye!")
        exitProcess(0)
    }
}
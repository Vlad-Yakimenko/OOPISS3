package controller.command

interface Command {
    fun canProcess(command: String): Boolean
    fun process(command: String): String?
}
package view

import java.util.*

class Console : View {
    override fun write(message: String) {
        println(message)
    }

    override fun read(): String? {
        return try {
            val scanner = Scanner(System.`in`)
            scanner.nextLine()
        } catch (e: NoSuchElementException) {
            null
        }
    }
}
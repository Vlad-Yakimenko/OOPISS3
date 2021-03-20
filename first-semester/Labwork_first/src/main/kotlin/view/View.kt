package view

interface View {
    fun write(message: String)
    fun read(): String?
}
package util

class ClassInfoReader(private val `class`: Class<*>) {

    fun read(): String {
        return printCommonInfo() + '\n' +
                printNestedClasses() + '\n' +
                printInterfaces() + '\n' +
                printFields()
    }

    private fun printCommonInfo(): String {
        return """
            Class: ${`class`.simpleName}
            ${if (`class`.superclass != null) "This class extends ${`class`.superclass}" else "This class doesn't extend any class"}
            This class is${if (`class`.isAnnotation) "" else " not"} annotation
            This class is${if (`class`.isEnum) "" else " not"} enum
            This class is${if (`class`.isInterface) "" else " not"} interface
            This class is${if (`class`.isAnonymousClass) "" else " not"} anonymous class
            
        """.trimIndent()

    }

    private fun <T> printArrayOfMetadata(
        arrayOfMetadata: Array<T>,
        message: String,
        emptyArrayMessage: String
    ): String {

        val stringBuilder = StringBuilder(
            if (arrayOfMetadata.isEmpty()) emptyArrayMessage
            else message
        )

        for (metadata in arrayOfMetadata) {
            stringBuilder.append(metadata).append('\n')
        }

        return stringBuilder.toString()
    }

    private fun printNestedClasses(): String {
        return printArrayOfMetadata(`class`.classes, "Nested classes are:\n", "Class doesn't have nested classes.\n")
    }

    private fun printInterfaces(): String {
        return printArrayOfMetadata(
            `class`.interfaces,
            "Implemented interfaces are:\n",
            "Class doesn't implement interfaces.\n"
        )
    }

    private fun printFields(): String {
        return printArrayOfMetadata(`class`.fields, "Fields are:\n", "Class doesn't have fields.\n")
    }
}
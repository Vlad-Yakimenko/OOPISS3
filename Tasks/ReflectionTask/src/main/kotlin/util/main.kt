package util

import util.MyClassLoader
import java.io.File

fun main() {
    val loader = MyClassLoader()
    val clazz = loader.findClass("model.Test")

    println(clazz.simpleName)
}
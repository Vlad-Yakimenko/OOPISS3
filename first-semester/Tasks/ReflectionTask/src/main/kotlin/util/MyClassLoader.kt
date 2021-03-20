package util

import java.io.ByteArrayOutputStream
import java.io.IOException

class MyClassLoader : ClassLoader() {

    public override fun findClass(name: String?): Class<*> {
        val bytes: ByteArray = loadClassInBytes(name)

        return defineClass(name, bytes, 0, bytes.size)
    }

    private fun loadClassInBytes(className: String?): ByteArray {
        val input = javaClass.classLoader
            .getResourceAsStream(className?.replace('.', '\\') + ".class")
            ?: throw IllegalArgumentException("Unknown class: $className")

        val output = ByteArrayOutputStream()

        var buffer: Int

        try {
            buffer = input.read()
            while (buffer != -1) {
                output.write(buffer)
                buffer = input.read()
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }

        return output.toByteArray()
    }
}
package util

import junit.framework.Assert.assertEquals
import org.junit.Test
import java.lang.IllegalArgumentException

internal class MyClassLoaderTest {

    @Test
    fun findClassIncorrectCaseTest() {
        // given
        val classLoader = MyClassLoader()

        // when
        try {
            classLoader.findClass("unknown")
        } catch (e: IllegalArgumentException) {
            // then
            assertEquals("Unknown class: unknown", e.message)
        }
    }

    @Test
    fun findClassCorrectCaseTest() {
        // given
        val classLoader = MyClassLoader()
        val originalClass = this.javaClass

        // when
        val loadedClass = classLoader.findClass("util.MyClassLoaderTest")

        // then
        assertEquals(originalClass.simpleName, loadedClass.simpleName)
    }
}
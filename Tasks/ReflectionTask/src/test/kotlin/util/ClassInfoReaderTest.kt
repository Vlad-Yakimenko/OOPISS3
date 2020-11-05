package util

import junit.framework.Assert.assertEquals
import org.junit.Test

internal class ClassInfoReaderTest {

    @Test
    fun readClassInfoTest() {
        // given
        val `class` = MyClassLoader().findClass("model.Unit")

        // when
        val result = ClassInfoReader(`class`).read()

        // then
        assertEquals(
            """
                Class: Unit
                This class extends class java.lang.Object
                This class is not annotation
                This class is not enum
                This class is not interface
                This class is not anonymous class
                
                Class doesn't have nested classes.
                
                Implemented interfaces are:
                interface model.Testable
                interface java.lang.Comparable
                
                Class doesn't have fields.

                """.trimIndent(), result
        )
    }

    @Test
    fun readEnumClassInfoTest() {
        // given
        val `class` = MyClassLoader().findClass("model.Structure")

        // when
        val result = ClassInfoReader(`class`).read()

        // then
        assertEquals(
            """
                Class: Structure
                This class extends class java.lang.Enum
                This class is not annotation
                This class is enum
                This class is not interface
                This class is not anonymous class
                
                Nested classes are:
                class model.Structure${'$'}StructureIterator
                
                Class doesn't implement interfaces.
                
                Fields are:
                public static final model.Structure model.Structure.INSTANCE
                
                """.trimIndent(), result
        )
    }

    @Test
    fun readInterfaceInfoTest() {
        // given
        val `class` = MyClassLoader().findClass("model.Testable")

        // when
        val result = ClassInfoReader(`class`).read()

        // then
        assertEquals(
            """
                Class: Testable
                This class doesn't extend any class
                This class is not annotation
                This class is not enum
                This class is interface
                This class is not anonymous class
                
                Class doesn't have nested classes.
                
                Class doesn't implement interfaces.
                
                Class doesn't have fields.

                """.trimIndent(), result
        )
    }
}
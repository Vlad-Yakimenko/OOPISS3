package controller.command

import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.mockito.Mockito.`when`

class FindTest : CommandTest() {

    @Before
    override fun setUp() {
        super.setUp()
        command = Find(saladBuilder.build())
    }

    @Test
    fun findCanProcessCorrectTest() {
        `when`(view.read()).thenReturn("find 1 1")
        assertTrue(command.canProcess(view.read()!!))
    }

    @Test
    fun findCanProcessIncorrectTest() {
        `when`(view.read()).thenReturn("test 1 1")
        assertFalse(command.canProcess(view.read()!!))
    }

    @Test
    fun findNoneOfElementsInSaladTest() {
        `when`(view.read())
            .thenReturn("add cucumber 100 100")
            .thenReturn("add white_button 20 210")
            .thenReturn("add spinach 12 42")
            .thenReturn("add tomato 7 250")
            .thenReturn("add shiitake 21 90")
            .thenReturn("add radish 4 110")
            .thenReturn("add kale 9 130")
            .thenReturn("add dill 9 130")
            .thenReturn("add beech 14 60")

        val add = Add(saladBuilder)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)

        command = Find(saladBuilder.build())

        assertEquals(
            "[]",
            command.process("find 1 10")
        )
    }

    @Test
    fun findPartOfElementsInSaladTest() {
        `when`(view.read())
            .thenReturn("add cucumber 100 100")
            .thenReturn("add white_button 20 210")
            .thenReturn("add spinach 12 42")
            .thenReturn("add tomato 7 250")
            .thenReturn("add shiitake 21 90")
            .thenReturn("add radish 4 110")
            .thenReturn("add kale 9 130")
            .thenReturn("add dill 9 130")
            .thenReturn("add beech 14 60")

        val add = Add(saladBuilder)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)

        command = Find(saladBuilder.build())

        assertEquals(
            "[[Cucumber: cal = 15, price = 100, weight = 100], " +
                    "[Tomato: cal = 18, price = 7, weight = 250], " +
                    "[Radish: cal = 16, price = 4, weight = 110]]",
            command.process("find 15 20")
        )
    }

    @Test
    fun findAllElementsInSaladTest() {
        `when`(view.read())
            .thenReturn("add cucumber 100 100")
            .thenReturn("add white_button 20 210")
            .thenReturn("add spinach 12 42")
            .thenReturn("add tomato 7 250")
            .thenReturn("add shiitake 21 90")
            .thenReturn("add radish 4 110")
            .thenReturn("add kale 9 130")
            .thenReturn("add dill 9 130")
            .thenReturn("add beech 14 60")

        val add = Add(saladBuilder)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)

        command = Find(saladBuilder.build())

        assertEquals(
            "[[Cucumber: cal = 15, price = 100, weight = 100], " +
                    "[WhiteButton: cal = 22, price = 20, weight = 210], " +
                    "[Spinach: cal = 23, price = 12, weight = 42], " +
                    "[Tomato: cal = 18, price = 7, weight = 250], " +
                    "[Shiitake: cal = 34, price = 21, weight = 90], " +
                    "[Radish: cal = 16, price = 4, weight = 110], " +
                    "[Kale: cal = 49, price = 9, weight = 130], " +
                    "[Dill: cal = 23, price = 9, weight = 130], " +
                    "[Beech: cal = 26, price = 14, weight = 60]]",
            command.process("find 10 50")
        )
    }

    @Test(expected = IllegalArgumentException::class)
    fun findIncorrectNumberFormatForRangeTest() {
        `when`(view.read())
            .thenReturn("add cucumber 100 100")
            .thenReturn("add white_button 20 210")
            .thenReturn("add spinach 12 42")
            .thenReturn("add tomato 7 250")
            .thenReturn("add shiitake 21 90")
            .thenReturn("add radish 4 110")
            .thenReturn("add kale 9 130")
            .thenReturn("add dill 9 130")
            .thenReturn("add beech 14 60")

        val add = Add(saladBuilder)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)

        command = Find(saladBuilder.build())

        command.process("find qwe 2")
    }
}
package controller.command

import org.junit.Before
import org.junit.Test
import org.mockito.Mockito.`when`
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class SortTest : CommandTest() {

    @Before
    override fun setUp() {
        super.setUp()
        command = Sort(chef)
    }

    @Test
    fun sortCanProcessCorrectTest() {
        `when`(view.read()).thenReturn("sort by price")
        assertTrue(command.canProcess(view.read()!!))
    }

    @Test
    fun sortCanProcessIncorrectTest() {
        `when`(view.read()).thenReturn("so by weight")
        assertFalse(command.canProcess(view.read()!!))
    }

    @Test(expected = IllegalArgumentException::class)
    fun sortIncorrectAmountOfWordsTest() {
        command.process("sort by weight smth")
    }

    @Test
    fun sortByPriceTest() {
        `when`(view.read())
            .thenReturn("add beech 14 60")
            .thenReturn("add white_button 20 210")
            .thenReturn("add kale 9 130")
            .thenReturn("add spinach 12 42")
            .thenReturn("add dill 9 130")

        val add = Add(chef)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)

        command.process("sort by price")

        assertEquals(
            "[[Kale: cal = 49, price = 9, weight = 130], " +
                    "[Dill: cal = 23, price = 9, weight = 130], " +
                    "[Spinach: cal = 23, price = 12, weight = 42], " +
                    "[Beech: cal = 26, price = 14, weight = 60], " +
                    "[WhiteButton: cal = 22, price = 20, weight = 210]]", chef.toString()
        )
    }

    @Test
    fun sortByWeightTest() {
        `when`(view.read())
            .thenReturn("add beech 14 60")
            .thenReturn("add white_button 20 210")
            .thenReturn("add kale 9 130")
            .thenReturn("add spinach 12 42")
            .thenReturn("add dill 9 130")

        val add = Add(chef)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)

        command.process("sort by weight")

        assertEquals(
            "[[Spinach: cal = 23, price = 12, weight = 42], " +
                    "[Beech: cal = 26, price = 14, weight = 60], " +
                    "[Kale: cal = 49, price = 9, weight = 130], " +
                    "[Dill: cal = 23, price = 9, weight = 130], " +
                    "[WhiteButton: cal = 22, price = 20, weight = 210]]", chef.toString()
        )
    }

    @Test
    fun sortByCaloriesTest() {
        `when`(view.read())
            .thenReturn("add beech 14 60")
            .thenReturn("add white_button 20 210")
            .thenReturn("add kale 9 130")
            .thenReturn("add spinach 12 42")
            .thenReturn("add dill 9 130")

        val add = Add(chef)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)

        command.process("sort by cal")

        assertEquals(
            "[[WhiteButton: cal = 22, price = 20, weight = 210], " +
                    "[Spinach: cal = 23, price = 12, weight = 42], " +
                    "[Dill: cal = 23, price = 9, weight = 130], " +
                    "[Beech: cal = 26, price = 14, weight = 60], " +
                    "[Kale: cal = 49, price = 9, weight = 130]]", chef.toString()
        )
    }

    @Test(expected = IllegalArgumentException::class)
    fun sortIncorrectSortParameterTest() {
        command.process("sort by smth")
    }
}
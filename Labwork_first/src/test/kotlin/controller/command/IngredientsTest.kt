package controller.command

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.mockito.Mockito.`when`

class IngredientsTest : CommandTest() {

    @Before
    override fun setUp() {
        super.setUp()
        command = Ingredients(saladBuilder.build())
    }

    @Test
    fun ingredientsCanProcessCorrectTest() {
        `when`(view.read()).thenReturn("ingredients")
        assertTrue(command.canProcess(view.read()!!))
    }

    @Test
    fun ingredientsCanProcessIncorrectTest() {
        `when`(view.read()).thenReturn("smth")
        assertFalse(command.canProcess(view.read()!!))
    }

    @Test
    fun ingredientsProcessTest() {
        `when`(view.read())
            .thenReturn("add beech 14 60")
            .thenReturn("add white_button 20 210")
            .thenReturn("add kale 9 130")
            .thenReturn("add spinach 12 42")
            .thenReturn("add dill 9 130")

        val add = Add(saladBuilder)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)

        command = Ingredients(saladBuilder.build())

        kotlin.test.assertEquals(
            "[[Beech: cal = 26, price = 14, weight = 60], " +
                    "[WhiteButton: cal = 22, price = 20, weight = 210], " +
                    "[Kale: cal = 49, price = 9, weight = 130], " +
                    "[Spinach: cal = 23, price = 12, weight = 42], " +
                    "[Dill: cal = 23, price = 9, weight = 130]]", command.process("ingredients")
        )
    }
}
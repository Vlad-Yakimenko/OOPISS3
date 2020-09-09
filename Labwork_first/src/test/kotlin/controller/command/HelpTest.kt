package controller.command

import org.junit.Before
import org.junit.Test

import org.junit.Assert.*
import org.mockito.Mockito
import org.mockito.Mockito.`when`

class HelpTest : CommandTest() {

    @Before
    override fun setUp() {
        super.setUp()
        command = Help()
    }

    @Test
    fun helpCanProcessCorrectTest() {
        `when`(view.read()).thenReturn("help")
        assertTrue(command.canProcess(view.read()!!))
    }

    @Test
    fun helpCanProcessIncorrectTest() {
        `when`(view.read()).thenReturn("hi")
        assertFalse(command.canProcess(view.read()!!))
    }

    @Test
    fun helpProcessTest() {
        assertEquals("Commands:\n" +
                "\t'add vegetable_name price weight'\n" +
                "\t\tAdd ingredient to salad.\n" +
                "\t\tList of available ingredients:\n" +
                "\t\t\t-cucumber\n" +
                "\t\t\t-tomato\n" +
                "\t\t\t-radish\n" +
                "\t\t\t-kale\n" +
                "\t\t\t-spinach\n" +
                "\t\t\t-dill\n" +
                "\t\t\t-white_button\n" +
                "\t\t\t-shiitake\n" +
                "\t\t\t-beech\n" +
                "\t'ingredients'\n" +
                "\t\tShow all ingredients in the salad.\n" +
                "\t'calories'\n" +
                "\t\tShow total sum of calories.\n" +
                "\t'sort by param'\n" +
                "\t\tWhere 'param' is 'cal', 'price' or 'weight'.\n" +
                "\t\tSort ingredients by set param.\n" +
                "\t'find start end'\n" +
                "\t\tWhere 'start' and 'end' are integer values.\n" +
                "\t\tFind ingredients in set range of calories.\n", command.process("help"))
    }
}
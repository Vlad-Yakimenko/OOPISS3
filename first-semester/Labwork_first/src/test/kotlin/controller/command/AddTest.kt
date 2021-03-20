package controller.command

import org.junit.Before
import org.junit.Test
import org.mockito.Mockito.`when`
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class AddTest : CommandTest() {

    @Before
    override fun setUp() {
        super.setUp()
        command = Add(saladBuilder)
    }

    @Test
    fun addCanProcessCorrectTest() {
        `when`(view.read()).thenReturn("add cucumber 100 100")
        assertTrue(command.canProcess(view.read()!!))
    }

    @Test
    fun addCanProcessIncorrectTest() {
        `when`(view.read()).thenReturn("ad cucumber 100 100")
        assertFalse(command.canProcess(view.read()!!))
    }

    @Test
    fun addOneElementTest() {
        `when`(view.read()).thenReturn("add cucumber 100 100")

        command.process(view.read()!!)
        salad = saladBuilder.build()

        assertEquals("[[Cucumber: cal = 15, price = 100, weight = 100]]", salad.toString())
    }

    @Test
    fun addFewElementsTest() {
        `when`(view.read())
            .thenReturn("add cucumber 100 100")
            .thenReturn("add white_button 20 210")

        command.process(view.read()!!)
        command.process(view.read()!!)
        salad = saladBuilder.build()

        assertEquals(
            "[[Cucumber: cal = 15, price = 100, weight = 100], [WhiteButton: cal = 22, price = 20, weight = 210]]",
            salad.toString()
        )
    }

    @Test
    fun addAllAvailableElementsTest() {
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

        command.process(view.read()!!)
        command.process(view.read()!!)
        command.process(view.read()!!)
        command.process(view.read()!!)
        command.process(view.read()!!)
        command.process(view.read()!!)
        command.process(view.read()!!)
        command.process(view.read()!!)
        command.process(view.read()!!)
        salad = saladBuilder.build()

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
            salad.toString()
        )
    }

    @Test(expected = IllegalArgumentException::class)
    fun addUnavailableIngredientTest() {
        `when`(view.read()).thenReturn("add smth 100 100")
        command.process(view.read()!!)
    }

    @Test(expected = IllegalArgumentException::class)
    fun addIncorrectAmountOfParametersLess() {
        `when`(view.read()).thenReturn("add")
        command.process(view.read()!!)
    }

    @Test(expected = IllegalArgumentException::class)
    fun addIncorrectAmountOfParametersMore() {
        `when`(view.read()).thenReturn("add cucumber 10 10\nadd cucumber 10 10")
        command.process(view.read()!!)
    }
}
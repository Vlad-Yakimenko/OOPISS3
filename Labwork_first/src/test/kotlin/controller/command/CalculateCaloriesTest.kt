package controller.command

import org.junit.Before
import org.junit.Test
import org.mockito.Mockito.`when`
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class CalculateCaloriesTest : CommandTest() {

    @Before
    override fun setUp() {
        super.setUp()
        command = CalculateCalories(chef)
    }

    @Test
    fun caloriesCanProcessCorrectTest() {
        `when`(view.read()).thenReturn("calories")
        assertTrue(command.canProcess(view.read()!!))
    }

    @Test
    fun caloriesCanProcessIncorrectTest() {
        `when`(view.read()).thenReturn("cals")
        assertFalse(command.canProcess(view.read()!!))
    }

    @Test
    fun caloriesForNoneElementsTest() {
        assertEquals("Sum of calories: 0.0", command.process("calories"))
    }

    @Test
    fun caloriesForOneGrammTest() {
        `when`(view.read()).thenReturn("add radish 100 1")
        Add(chef).process(view.read()!!)

        assertEquals("Sum of calories: 0.16", command.process("calories"))
    }

    @Test
    fun caloriesForFewElements() {
        `when`(view.read())
            .thenReturn("add radish 100 123")
            .thenReturn("add shiitake 20 15")
            .thenReturn("add kale 41 54")

        val add = Add(chef)
        add.process(view.read()!!)
        add.process(view.read()!!)
        add.process(view.read()!!)

        assertEquals("Sum of calories: 51.24", command.process("calories"))
    }
}
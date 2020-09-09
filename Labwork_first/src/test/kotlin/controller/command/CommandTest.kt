package controller.command

import model.Chef
import org.junit.Before
import org.mockito.Mockito
import view.View

abstract class CommandTest {

    protected lateinit var chef: Chef
    protected lateinit var command: Command
    protected val view: View = Mockito.mock(View::class.java)

    @Before
    open fun setUp() {
        chef = Chef()
    }
}
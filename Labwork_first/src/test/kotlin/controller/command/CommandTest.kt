package controller.command

import model.Salad
import org.junit.Before
import org.mockito.Mockito
import view.View

abstract class CommandTest {

    protected lateinit var salad: Salad
    protected lateinit var saladBuilder: Salad.Builder
    protected lateinit var command: Command
    protected val view: View = Mockito.mock(View::class.java)

    @Before
    open fun setUp() {
        saladBuilder = Salad.Builder()
    }
}
import junit.framework.TestCase.assertEquals
import org.junit.Before
import org.junit.Test
import java.io.ByteArrayOutputStream
import java.io.OutputStream
import java.io.PrintStream


class ThreadGroupPrinterTest {

    private lateinit var outputStreamCaptor: OutputStream
    private lateinit var threadGroups: List<ThreadGroup>

    @Before
    fun setUp() {
        outputStreamCaptor = ByteArrayOutputStream()
        System.setOut(PrintStream(outputStreamCaptor))

        val forefatherGroup = ThreadGroup("Forefather")
        val fatherGroup = ThreadGroup(forefatherGroup, "Father")
        val firstSiblingGroup = ThreadGroup(fatherGroup, "First sibling")
        val secondSiblingGroup = ThreadGroup(fatherGroup, "Second sibling")

        this.threadGroups = listOf(forefatherGroup, fatherGroup, firstSiblingGroup, secondSiblingGroup)

        val firstSampleRunnable = Runnable {
            try {
                Thread.sleep(5000)
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
        }

        val secondSampleRunnable = Runnable {
            try {
                Thread.sleep(2000)
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
        }

        val thirdSampleRunnable = Runnable {
            try {
                Thread.sleep(7000)
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
        }

        var thread = Thread(forefatherGroup, firstSampleRunnable)
        thread.name = "First thread"
        thread.start()

        thread = Thread(forefatherGroup, thirdSampleRunnable)
        thread.name = "Second thread"
        thread.start()

        thread = Thread(fatherGroup, firstSampleRunnable)
        thread.name = "Third thread"
        thread.start()

        thread = Thread(firstSiblingGroup, firstSampleRunnable)
        thread.name = "Fourth thread"
        thread.start()

        thread = Thread(firstSiblingGroup, secondSampleRunnable)
        thread.name = "Fifth thread"
        thread.start()

        thread = Thread(firstSiblingGroup, thirdSampleRunnable)
        thread.name = "Sixth thread"
        thread.start()

        thread = Thread(secondSiblingGroup, secondSampleRunnable)
        thread.name = "Seventh thread"
        thread.start()
    }

    @Test
    fun printGroupTreeFromForefatherTest() {
        val printer = ThreadGroupPrinter(threadGroup = threadGroups[0])
        printer.print(8000)
        Thread.sleep(8000)
        assertEquals(
            "Root group: Forefather\r\n" +
                    "\tthread: First thread\r\n" +
                    "\tthread: Second thread\r\n" +
                    "\r\n" +
                    "\tgroup: Father\r\n" +
                    "\t\tthread: Third thread\r\n" +
                    "\r\n" +
                    "\t\tgroup: First sibling\r\n" +
                    "\t\t\tthread: Fourth thread\r\n" +
                    "\t\t\tthread: Fifth thread\r\n" +
                    "\t\t\tthread: Sixth thread\r\n" +
                    "\r\n" +
                    "\t\tgroup: Second sibling\r\n" +
                    "\t\t\tthread: Seventh thread\r\n" +
                    "\r\n", outputStreamCaptor.toString()
        )
    }

    @Test
    fun printGroupTreeFromFatherTest() {
        val printer = ThreadGroupPrinter(threadGroup = threadGroups[1])
        printer.print(8000)
        Thread.sleep(8000)
        assertEquals(
            "Root group: Father\r\n" +
                    "\tthread: Third thread\r\n" +
                    "\r\n" +
                    "\tgroup: First sibling\r\n" +
                    "\t\tthread: Fourth thread\r\n" +
                    "\t\tthread: Fifth thread\r\n" +
                    "\t\tthread: Sixth thread\r\n" +
                    "\r\n" +
                    "\tgroup: Second sibling\r\n" +
                    "\t\tthread: Seventh thread\r\n" +
                    "\r\n", outputStreamCaptor.toString()
        )
    }

    @Test
    fun printGroupTreeFromFirstSiblingTest() {
        val printer = ThreadGroupPrinter(threadGroup = threadGroups[2])
        printer.print(8000)
        Thread.sleep(8000)
        assertEquals(
            "Root group: First sibling\r\n" +
                    "\tthread: Fourth thread\r\n" +
                    "\tthread: Fifth thread\r\n" +
                    "\tthread: Sixth thread\r\n" +
                    "\r\n", outputStreamCaptor.toString()
        )
    }

    @Test
    fun printGroupTreeFromSecondSiblingTest() {
        val printer = ThreadGroupPrinter(threadGroup = threadGroups[3])
        printer.print(8000)
        Thread.sleep(8000)
        assertEquals(
            "Root group: Second sibling\r\n" +
                    "\tthread: Seventh thread\r\n" +
                    "\r\n", outputStreamCaptor.toString()
        )
    }
}

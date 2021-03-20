import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.ScheduledThreadPoolExecutor
import java.util.concurrent.TimeUnit
import java.util.function.Consumer


class ThreadGroupPrinter(private val threadGroup: ThreadGroup) {

    private lateinit var executorService: ScheduledExecutorService

    private val separatorPrinter = Consumer<Int> {
        repeat(IntRange(0, it - 1).count()) { print("\t") }
    }

    fun print(period: Long) {
        Thread {
            executorService = ScheduledThreadPoolExecutor(0)
            executorService.scheduleAtFixedRate(
                {
                    if (threadGroup.activeCount() == 0) {
                        executorService.shutdownNow()
                    } else {
                        printGroupTree(threadGroup, 0)
                        println()
                    }
                },
                0,
                period,
                TimeUnit.MILLISECONDS
            )
        }.start()
    }

    private fun printGroupTree(group: ThreadGroup, level: Int) {
        var level = level
        separatorPrinter.accept(level)

        if (level == 0) {
            print("Root ")
        }

        println("group: ${group.name}")
        level += 1
        printActiveThreads(group, level)
        printActiveGroups(group, level)
    }

    private fun printActiveGroups(group: ThreadGroup, level: Int) {
        val activeThreadGroups = arrayOfNulls<ThreadGroup>(group.activeGroupCount())
        group.enumerate(activeThreadGroups)

        for (threadGroup in activeThreadGroups) {
            if (threadGroup!!.parent == group) {
                println()
                printGroupTree(threadGroup, level)
            }
        }
    }

    private fun printActiveThreads(group: ThreadGroup, level: Int) {
        val activeThreads = arrayOfNulls<Thread>(group.activeCount())
        group.enumerate(activeThreads)

        for (thread in activeThreads) {
            if (thread!!.threadGroup == group) {
                separatorPrinter.accept(level)
                println("thread: ${thread.name}")
            }
        }
    }
}
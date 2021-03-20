import java.util.*
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.BlockingQueue


class ThreadPool(amountOfThreads: Int, amountOfTasks: Int) {

    private val taskQueue: BlockingQueue<Runnable> = ArrayBlockingQueue(amountOfTasks)
    private val threads: MutableList<PoolThread> = ArrayList<PoolThread>()
    private var isStopped = false

    init {
        for (i in 0 until amountOfThreads) {
            threads.add(PoolThread(taskQueue))
        }

        for (thread in threads) {
            thread.start()
        }
    }

    @Synchronized
    @Throws(Exception::class)
    fun execute(task: Runnable) {
        check(!isStopped) { "ThreadPool is stopped" }
        taskQueue.put(task)
    }

    @Synchronized
    fun stop() {
        isStopped = true

        for (thread in threads) {
            thread.doStop()
        }
    }
}

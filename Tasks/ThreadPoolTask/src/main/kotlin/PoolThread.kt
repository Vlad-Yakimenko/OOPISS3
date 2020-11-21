import java.util.concurrent.BlockingQueue


class PoolThread(private val queue: BlockingQueue<Runnable>) : Thread() {

    @get:Synchronized
    var isStopped = false
        private set

    override fun run() {
        while (!isStopped) {
            try {
                val runnable = queue.take()
                runnable.run()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    @Synchronized
    fun doStop() {
        isStopped = true
        interrupt() //break pool thread out of dequeue() call.
    }
}

package app.vercel.naturalCommands

import app.vercel.naturalCommands.commands.VerifyCommand
import com.github.shynixn.mccoroutine.bukkit.setSuspendingExecutor
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import org.bukkit.plugin.java.JavaPlugin

class NaturalCommands : JavaPlugin() {

    val apiClient = HttpClient(CIO)

    override fun onEnable() {
        getCommand("verify")?.setSuspendingExecutor(VerifyCommand(this))

        logger.info("NaturalCommands enabled")
    }

    override fun onDisable() {
        // apiClient.close()
        logger.info("NaturalCommands disabled")
    }
}

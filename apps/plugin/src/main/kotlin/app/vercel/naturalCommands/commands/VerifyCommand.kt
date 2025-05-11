package app.vercel.naturalCommands.commands

import app.vercel.naturalCommands.NaturalCommands
import com.github.shynixn.mccoroutine.bukkit.SuspendingCommandExecutor
import io.ktor.client.request.post
import org.bukkit.command.Command
import org.bukkit.command.CommandSender

class VerifyCommand(private val plugin: NaturalCommands) : SuspendingCommandExecutor {

    override suspend fun onCommand(sender: CommandSender, command: Command, label: String, args: Array<out String>): Boolean {
        if (args.size != 1) {
            return false
        }

        val serverConnectionToken = args[0]

        try {
            val response = plugin.apiClient.post("http://localhost:3000/v1/serverConnection/")
        } catch (e: Exception) {

        }

        return true
    }
}

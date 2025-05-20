package app.vercel.naturalCommands.commands

import com.github.shynixn.mccoroutine.bukkit.SuspendingCommandExecutor
import net.kyori.adventure.text.Component
import net.kyori.adventure.text.format.NamedTextColor
import org.bukkit.command.Command
import org.bukkit.command.CommandSender
import org.bukkit.entity.Player

class FollowUpCommand(private val promptCommand: PromptCommand) : SuspendingCommandExecutor {
    override suspend fun onCommand(
        sender: CommandSender,
        command: Command,
        label: String,
        args: Array<out String>,
    ): Boolean {
        if (sender !is Player) {
            return true
        }

        if (!promptCommand.startFollowUp(sender)) {
            // Error message already sent by startFollowUp
            return true
        }

        return true
    }
} 
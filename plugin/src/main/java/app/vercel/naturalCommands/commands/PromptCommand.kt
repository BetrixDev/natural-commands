package app.vercel.naturalCommands.commands

import app.vercel.naturalCommands.NaturalCommands
import app.vercel.naturalCommands.dto.ChatCompletionsMessage
import app.vercel.naturalCommands.dto.ChatCompletionsRequest
import app.vercel.naturalCommands.dto.ChatCompletionsResponse
import com.github.shynixn.mccoroutine.bukkit.SuspendingCommandExecutor
import com.github.shynixn.mccoroutine.bukkit.launch
import io.ktor.client.call.body
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import net.kyori.adventure.text.Component
import net.kyori.adventure.text.event.ClickEvent
import net.kyori.adventure.text.event.HoverEvent
import net.kyori.adventure.text.format.NamedTextColor
import net.kyori.adventure.text.format.TextDecoration
import org.bukkit.command.Command
import org.bukkit.command.CommandSender
import org.bukkit.entity.Player
import java.time.Instant
import java.time.Duration

class PromptCommand(private val plugin: NaturalCommands) : SuspendingCommandExecutor {
    private data class PendingCommand(val command: String, val timestamp: Instant)
    private val pendingCommands = ConcurrentHashMap<UUID, PendingCommand>()

    init {
        plugin.launch {
            while (true) {
                val now = Instant.now()
                pendingCommands.entries.removeIf { (_, command) ->
                    Duration.between(command.timestamp, now).toMinutes() >= 10
                }

                delay(10 * 60 * 1000)
            }
        }
    }

    override suspend fun onCommand(
        sender: CommandSender,
        command: Command,
        label: String,
        args: Array<out String>,
    ): Boolean {
        if (sender !is Player) return true

        if (args.isEmpty()) {
            sender.sendMessage(Component.text("Please provide a prompt!").color(NamedTextColor.RED))
            return true
        }

        val userPrompt = args.joinToString(" ")

        withContext(Dispatchers.IO) {
            val response =
                plugin.apiClient.post("https://openrouter.ai/api/v1/chat/completions") {
                    header(
                        "Authorization",
                        "Bearer ${plugin.config.getString("open_router_token")}",
                    )
                    header("HTTP-Referer", "https://natural-commands.vercel.app")
                    header("X-Title", "Natural Commands")
                    contentType(ContentType.Application.Json)
                    setBody(
                        ChatCompletionsRequest(
                            plugin.config.getString("open_router_model")!!,
                            listOf(
                                ChatCompletionsMessage("system", getSystemPrompt(sender)),
                                ChatCompletionsMessage("user", userPrompt),
                            ),
                        )
                    )
                }

            handleApiResponse(response, sender)
        }

        return true
    }

    private fun getSystemPrompt(player: Player): String {
        return """
            You are an AI specialized in generating Minecraft: Java Edition commands.
            Your primary function is to translate user requests from plain English into valid Minecraft commands.

            Guidelines:
            1. Output only the command itself, without any explanations or the leading slash (/).
            2. Generate exactly one command per request.
            3. If a request cannot be fulfilled with a single command, return nothing.
            4. Ensure all NBT data in commands is accurate and properly formatted.
            5. Utilize available tools for command generation when applicable.
            6. Do not use aliases for commands.
            7. Do not generate /tell or /say commands.

            Context:
            - Minecraft version: ${player.server.minecraftVersion}
            - User's name: ${player.name}
            - User's UUID: ${player.uniqueId}
            - User is operator: ${player.isOp}

            When processing requests:
            - Analyze the user's intent carefully.
            - Consider command syntax, parameters, and limitations.
            - Prioritize efficiency and accuracy in command construction.
            - If multiple approaches exist, choose the most straightforward and reliable method.
            - Ensure you are using the correct syntax when a command is using NBT data / extra data for entities, etc.
            - Do not break the command on to multiple lines.

            Remember, your goal is to provide precise, executable Minecraft commands that exactly match the user's specifications.

            Example:
            User: summon a zombie with full diamond armor and a sharpness 5 diamond sword
            AI: summon zombie ~ ~1 ~ {PersistenceRequired:1,equipment:{mainhand:{count:1,id:diamond_sword,components:{enchantments:{'sharpness':5}}},head:{count:1,id:diamond_helmet},chest:{count:1,id:diamond_chestplate},legs:{count:1,id:diamond_leggings},feet:{count:1,id:diamond_boots}}}

            User: give me a diamond sword
            AI: give @s diamond_sword

            User: set the time to day
            AI: time set day

            User: give me a stack of golden apples with the name "Healing Fruit"
            AI: give @p golden_apple[custom_name="Healing Fruit"] 64
        """
            .trimIndent()
    }

    private suspend fun handleApiResponse(
        response: io.ktor.client.statement.HttpResponse,
        player: Player,
    ) {
        if (response.status.value in 200..299) {
            val responseBody: ChatCompletionsResponse = response.body()
            val choice = responseBody.choices.find { it.finishReason == "stop" }

            if (choice != null) {
                val generatedCommand = choice.message.content
                sendCommandMessage(player, generatedCommand)
            } else {
                player.sendMessage(
                    Component.text("Something went wrong with AI response")
                        .color(NamedTextColor.RED)
                )
            }
        } else {
            player.sendMessage(Component.text("Something went wrong!").color(NamedTextColor.RED))
        }
    }

    private fun sendCommandMessage(player: Player, generatedCommand: String) {
        val isLongCommand = generatedCommand.length > 256
        val message = buildCommandMessage(generatedCommand, isLongCommand)

        if (isLongCommand) {
            storePendingCommand(player, generatedCommand)
            player.sendMessage(
                Component.text(
                        "This command is too long to execute directly. Click the command above to execute it via the server."
                    )
                    .color(NamedTextColor.YELLOW)
            )
        }

        player.sendMessage(message)
    }

    private fun buildCommandMessage(generatedCommand: String, isLongCommand: Boolean): Component {
        return Component.text()
            .append(Component.text("----------------------", NamedTextColor.GRAY))
            .append(Component.newline())
            .append(
                Component.text("✨ Natural Commands ✨", NamedTextColor.GOLD, TextDecoration.BOLD)
            )
            .append(Component.newline())
            .append(Component.text("Generated command:", NamedTextColor.YELLOW))
            .append(Component.newline())
            .append(
                Component.text("/$generatedCommand")
                    .color(NamedTextColor.AQUA)
                    .clickEvent(
                        if (isLongCommand) {
                            ClickEvent.clickEvent(ClickEvent.Action.RUN_COMMAND, "/ncconfirm")
                        } else {
                            ClickEvent.clickEvent(
                                ClickEvent.Action.SUGGEST_COMMAND,
                                "/$generatedCommand",
                            )
                        }
                    )
                    .hoverEvent(
                        HoverEvent.showText(
                            Component.text(
                                if (isLongCommand) "Click to execute via server" else "Click to run"
                            )
                        )
                    )
            )
            .append(Component.newline())
            .append(Component.text("➥ ", NamedTextColor.GRAY))
            .append(
                Component.text(
                        if (isLongCommand) "Click to execute via server" else "Click to execute"
                    )
                    .color(NamedTextColor.GREEN)
                    .decorate(TextDecoration.ITALIC)
            )
            .append(Component.newline())
            .append(Component.text("----------------------", NamedTextColor.GRAY))
            .build()
    }

    private fun storePendingCommand(player: Player, command: String) {
        pendingCommands[player.uniqueId] = PendingCommand(command, Instant.now())
    }

    fun executePendingCommand(player: Player): Boolean {
        val pendingCommand = pendingCommands.remove(player.uniqueId) ?: return false

        return try {
            player.server.dispatchCommand(player, pendingCommand.command)
        } catch (e: Exception) {
            plugin.logger.warning("Failed to execute command for ${player.name}: ${e.message}")
            player.sendMessage(
                Component.text("Failed to execute command: ${e.message}").color(NamedTextColor.RED)
            )
            false
        }
    }
}

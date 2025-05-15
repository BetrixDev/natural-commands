package app.vercel.naturalCommands.commands

import app.vercel.naturalCommands.NaturalCommands
import app.vercel.naturalCommands.dto.ChatCompletionsMessage
import app.vercel.naturalCommands.dto.ChatCompletionsRequest
import app.vercel.naturalCommands.dto.ChatCompletionsResponse
import com.github.shynixn.mccoroutine.bukkit.SuspendingCommandExecutor
import io.ktor.client.call.body
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.kyori.adventure.text.Component
import net.kyori.adventure.text.format.NamedTextColor
import net.kyori.adventure.text.minimessage.MiniMessage
import org.bukkit.command.Command
import org.bukkit.command.CommandSender
import org.bukkit.entity.Player

class PromptCommand(private val plugin: NaturalCommands) : SuspendingCommandExecutor {
    override suspend fun onCommand(
        sender: CommandSender,
        command: Command,
        label: String,
        args: Array<out String>,
    ): Boolean {
        val player = sender

        if (player !is Player) {
            return true
        }

        if (args.isEmpty()) {
            player.sendMessage(Component.text("Please provide a prompt!").color(NamedTextColor.RED))
            return true
        }

        val userPrompt = args.joinToString("")

        withContext(Dispatchers.IO) {
            val response =
                plugin.apiClient.post("https://openrouter.ai/api/v1/chat/completions") {
                    header(
                        "Authorization",
                        "Bearer ${plugin.config.getString("open-router-token")}",
                    )
                    header("HTTP-Referer", "https://natural-commands.vercel.app")
                    header("X-Title", "Natural Commands")
                    contentType(ContentType.Application.Json)
                    setBody(
                        ChatCompletionsRequest(
                            "google/gemini-2.5-flash-preview",
                            listOf(
                                ChatCompletionsMessage(
                                    "system",
                                    """
                                    You are an AI specialized in generating Minecraft: Java Edition commands.
                                    Your primary function is to translate user requests from plain English into valid Minecraft commands.

                                    Guidelines:
                                    1. Output only the command itself, without any explanations or the leading slash (/).
                                    2. Generate exactly one command per request.
                                    3. If a request cannot be fulfilled with a single command, return nothing.
                                    4. Ensure all NBT data in commands is accurate and properly formatted.
                                    6. Utilize available tools for command generation when applicable.
                                    7. Do not use aliases for commands.
                                    8. Do not generate /tell or /say commands.

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
                                """
                                        .trimIndent(),
                                ),
                                ChatCompletionsMessage("user", userPrompt),
                            ),
                        )
                    )
                }

            if (response.status.value in 200..299) {
                val responseBody: ChatCompletionsResponse = response.body()

                val choice = responseBody.choices.find { it.finishReason == "stop" }

                if (choice != null) {
                    val generatedCommand = choice.message.content

                    val message =
                        MiniMessage.miniMessage()
                            .deserialize(
                                listOf(
                                        "<gold>The following command has been generated for you</gold>",
                                        "<aqua><insert:/${generatedCommand}>${generatedCommand}</insert></aqua>",
                                        "<gold>Click the command above to run</gold>",
                                    )
                                    .joinToString("<newline>")
                            )

                    player.sendMessage(message)
                } else {
                    player.sendPlainMessage("Something went wrong with AI response")
                }
            } else {
                player.sendPlainMessage("Something went wrong!")
            }
        }

        return true
    }
}

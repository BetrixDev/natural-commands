package app.vercel.naturalCommands

import app.vercel.naturalCommands.commands.ConfirmCommand
import app.vercel.naturalCommands.commands.PromptCommand
import com.github.shynixn.mccoroutine.bukkit.SuspendingJavaPlugin
import com.github.shynixn.mccoroutine.bukkit.setSuspendingExecutor
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.logging.DEFAULT
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logger
import io.ktor.client.plugins.logging.Logging
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonNamingStrategy

class NaturalCommands : SuspendingJavaPlugin() {

    @OptIn(ExperimentalSerializationApi::class)
    val apiClient =
        HttpClient(CIO) {
            install(ContentNegotiation) {
                json(
                    Json {
                        isLenient = true
                        ignoreUnknownKeys = true
                        namingStrategy = JsonNamingStrategy.SnakeCase
                    }
                )
            }
            install(Logging) {
                logger = Logger.DEFAULT
                level = LogLevel.ALL
            }
        }

    override fun onEnable() {
        saveDefaultConfig()

        logger.info("NaturalCommands enabled")

        val promptCommand = PromptCommand(this)
        getCommand("prompt")?.setSuspendingExecutor(promptCommand)
        getCommand("nc")?.setSuspendingExecutor(promptCommand)
        getCommand("naturalcommands")?.setSuspendingExecutor(promptCommand)

        val confirmCommand = ConfirmCommand(promptCommand)
        getCommand("ncconfirm")?.setSuspendingExecutor(confirmCommand)
    }

    override fun onDisable() {
        apiClient.close()

        logger.info("NaturalCommands disabled")
    }
}

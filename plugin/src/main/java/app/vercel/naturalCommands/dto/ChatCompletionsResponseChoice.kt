package app.vercel.naturalCommands.dto

import kotlinx.serialization.Serializable

@Serializable
data class ChatCompletionsResponseChoice(
    val finishReason: String,
    val message: ChatCompletionsMessage,
)

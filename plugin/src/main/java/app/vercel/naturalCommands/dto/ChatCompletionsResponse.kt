package app.vercel.naturalCommands.dto

import kotlinx.serialization.Serializable

@Serializable
data class ChatCompletionsResponse(
    val id: String,
    val model: String,
    val choices: List<ChatCompletionsResponseChoice>,
)

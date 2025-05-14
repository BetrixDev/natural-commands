package app.vercel.naturalCommands.dto

import kotlinx.serialization.Serializable

@Serializable
data class ChatCompletionsMessage(val role: String, val content: String)

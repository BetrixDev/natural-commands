package app.vercel.naturalCommands.dto

import kotlinx.serialization.Serializable

@Serializable
data class ChatCompletionsRequest(val model: String, val messages: List<ChatCompletionsMessage>)

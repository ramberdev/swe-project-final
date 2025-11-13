import { useEffect, useState, useRef } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Chat.css'

const Chat = () => {
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    if (selectedChat) {
      fetchMessages()
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [selectedChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchChats = async () => {
    try {
      // Fetch links first, then get/create chats for each link
      const linksResponse = await api.get('/links')
      const links = linksResponse.data || []
      
      // Filter only approved links
      const approvedLinks = links.filter(
        (link) => (link.status || link.Status)?.toLowerCase() === 'approved'
      )
      
      // For each approved link, get or create a chat
      const chatPromises = approvedLinks.map(async (link) => {
        try {
          const chatResponse = await api.get(`/chat/link/${link.link_id || link.LinkID}`)
          return chatResponse.data
        } catch (error) {
          // Chat might not exist yet, that's okay
          return null
        }
      })
      
      const chats = (await Promise.all(chatPromises)).filter(Boolean)
      setChats(chats)
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!selectedChat) return
    try {
      const response = await api.get(`/chat/${selectedChat.chat_id || selectedChat.ChatID}/messages`)
      setMessages(response.data || [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    try {
      const userId = user?.UserID || user?.user_id || 1
      await api.post('/chat/messages', {
        chat_id: selectedChat.chat_id || selectedChat.ChatID,
        content: newMessage,
        message_type: 'text',
      }, {
        params: { user_id: userId }
      })
      setNewMessage('')
      fetchMessages()
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message')
    }
  }

  const getOrCreateChat = async (linkId) => {
    try {
      const response = await api.get(`/chat/link/${linkId}`)
      const chat = response.data
      setSelectedChat(chat)
      if (!chats.find((c) => (c.chat_id || c.ChatID) === (chat.chat_id || chat.ChatID))) {
        setChats([...chats, chat])
      }
    } catch (error) {
      console.error('Failed to get chat:', error)
    }
  }

  if (loading) {
    return <div className="page-loading">Loading chats...</div>
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h2>Chats</h2>
        <div className="chats-list">
          {chats.length === 0 ? (
            <div className="no-chats">No active chats</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.chat_id || chat.ChatID}
                className={`chat-item ${selectedChat?.chat_id === chat.chat_id || selectedChat?.ChatID === chat.ChatID ? 'active' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chat-item-header">
                  <span className="chat-link-id">Link #{chat.link_id || chat.LinkID}</span>
                  <span className="chat-time">
                    {chat.last_message_at || chat.LastMessageAt
                      ? new Date(chat.last_message_at || chat.LastMessageAt).toLocaleDateString()
                      : ''}
                  </span>
                </div>
                {chat.last_message || chat.LastMessage && (
                  <p className="chat-preview">{chat.last_message || chat.LastMessage}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h3>Chat - Link #{selectedChat.link_id || selectedChat.LinkID}</h3>
            </div>
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="no-messages">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.message_id || message.MessageID}
                    className={`message ${message.is_sender || message.IsSender ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.content || message.Content}</p>
                      <span className="message-time">
                        {new Date(message.created_at || message.CreatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="message-input-form" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="message-input"
              />
              <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat from the sidebar to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat


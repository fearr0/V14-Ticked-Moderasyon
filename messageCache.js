const messageCache = new Map();

function cacheMessage(message) {
    if (message.author.bot) return;
    messageCache.set(message.id, { content: message.content, authorTag: message.author.tag, authorId: message.author.id, createdAt: message.createdAt });
    if (messageCache.size > 1000) {
        const firstKey = messageCache.keys().next().value;
        messageCache.delete(firstKey);
    }
}

module.exports = { messageCache, cacheMessage };

module.exports = {
    name: 'interactionCreate',
    execute(client, interaction) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            command.execute(interaction);
        } catch (error) {
            console.error('Komut çalıştırılırken hata:', error);
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({ content: 'Komut çalıştırılırken hata oluştu.', ephemeral: true });
            } else {
                interaction.reply({ content: 'Komut çalıştırılırken hata oluştu.', ephemeral: true });
            }
        }
    }
};

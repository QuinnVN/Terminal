const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require("discord.js");
const { inspect } = require("util");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Chạy thử code JS và cho biết kết quả")
        .addStringOption((options) =>
            options.setName("code").setDescription("Đoạn code cần chạy").setRequired(true)
        ),
    catergory: "⌨️ Developers",
    async execute(client, interaction) {
        return; //This command has a big security vunerability that can show your IP
                // so I strongly don't recommend you to use the command if you cannot fix the vunerability.
        await interaction.deferReply();

        const code = interaction.options.getString("code");

        if (code.startsWith("client"))
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("DarkRed")
                        .setTitle("Lỗi")
                        .setDescription(
                            `${client.emojisManager.crossmark} Code này hiển thị thông tin nhạy cảm nên đã bị chặn`
                        ),
                ],
                ephemeral: true,
            });

        try {
            const result = await eval(code);
            let output = result;

            if (typeof result !== "string") {
                output = inspect(result);
            }

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle("Code chạy thành công!")
                        .setDescription(
                            `${
                                client.emojisManager.checkmark
                            } Code chạy thành công và trả về: \n${codeBlock("yaml", output)}`
                        ),
                ],
                ephemeral: true,
            });
        } catch (err) {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("Code chạy thất bại...")
                        .setDescription(
                            `${
                                client.emojisManager.crossmark
                            } Code chạy thất bại và trả về: \n${codeBlock("ansi", err.message)}`
                        ),
                ],
                ephemeral: true,
            });
        }
    },
};

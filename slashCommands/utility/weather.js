const axios = require('axios').default;
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { openWeather } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Lấy thông tin thời tiết')
        .addStringOption((options) =>
            options
                .setName('city')
                .setDescription('thành phố bạn muốn lấy thông tin')
                .setRequired(true)
        ),
    catergory: '🧰 Utility',
    // async autocomplete(interaction, client) {
    //     const focusedValue = interaction.options.getFocused();

    //     const filtered = cities.filter((city) => city.startsWith(focusedValue));
    //     await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
    // },
    async execute(client, interaction) {
        await interaction.deferReply();
        const city = interaction.options.getString('city');
        let weatherData;
        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: city,
                    appid: openWeather.apiKey,
                    units: 'metric',
                    lang: 'vi',
                },
            });

            weatherData = res.data;
        } catch (err) {
            return interaction.editReply({
                content: `${client.emojisManager.crossmark} Không tìm thấy thành phố`,
            });
        }

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor('White')
                    .setTitle(`Thời tiết tại ${weatherData.name}`)
                    .setThumbnail(
                        `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
                    )
                    .addFields([
                        {
                            name: '☀️ Tình trạng thời tiết',
                            value: weatherData.weather[0].description,
                            inline: true,
                        },
                        {
                            name: '🌡️ Nhiệt độ',
                            value: weatherData.main.temp + '°C',
                            inline: true,
                        },
                        {
                            name: '🖐️ Cảm giác như',
                            value: weatherData.main.feels_like + '°C',
                            inline: true,
                        },
                        {
                            name: '👀 Khoảng cách nhìn được',
                            value:
                                weatherData.visibility < 1000
                                    ? weatherData.visibility + 'm'
                                    : weatherData.visibility / 1000 + 'km',
                            inline: true,
                        },
                        {
                            name: '💨 Tốc độ gió',
                            value: '~' + Math.floor(weatherData.wind.speed / 3.6) + 'km/h',
                            inline: true,
                        },
                        {
                            name: '🏳️ Hướng gió',
                            value: weatherData.wind.deg + '°',
                            inline: true,
                        },
                    ])
                    .setFooter({
                        text: 'Source: openweathermap.org',
                    }),
            ],
        });
    },
};

# Terminal

An easy to use & setup, versatile multipurpose bot

![Dependabot](https://img.shields.io/badge/dependabot-025E8C?style=for-the-badge&logo=dependabot&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)

---

## How to run the bot locally

#### 1. Clone the project

Download the project's zip file
![download.png](./assets/pic/download.png)

When complete, open it in a terminal and type

```shell
npm run build
```

#### 2. Configure the bot

Open the `config.json` file and fill in all the necessary fields (see **_Configuration_**)
![config.png](./assets/pic/config.png)

#### 3.Start the bot

Double check if all the above steps have been complete. If so, run this command

```shell
npm run start
```

If your terminal shows this, then the bot has been started successfully
![start.png](./assets/pic/start.png)

---

## Configuration

You can configure the bot in the `config.json` file:

Bot:

-   <`token`>: Your bot token
-   <`mongoURL`>: The MongoDB URL

Nodes (Lavalink Nodes):

-   `host`: Lavalink server hostname
-   `port`: Lavalink server port (Default is _443_)
-   `password`: Lavalink server password
-   `secure`: Is Lavalink server secured? (Default is _`false`_)

Google:

-   `engineID`: Google custom search engine ID
-   `apiKey`: Google custom search engine API key

openWeather:

-   `apiKey`: OpenWeather API key

**Note:** _<>: required_

---

## Support

You can DM me **(Quinn#2872)** for support until this line says **_End of support_**

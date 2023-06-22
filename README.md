# Terminal

1 Con bot Dễ sử dụng, setup và làm quen

![Dependabot](https://img.shields.io/badge/dependabot-025E8C?style=for-the-badge&logo=dependabot&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)

---

## How to run the bot locally

#### 1. Tải dự án về (việc này không dành cho người không am hiểu về setup bot)

Tải file zip của dự án về
![download.png](./assets/pic/download.png)

Khi hoàn thành, mở CMD trong thư mục của bot và nhập lệnh:

```shell
npm run build
```

#### 2. Thiết lập bot

Mở file `config.json` và điền vào những mục cần thiết
![config.png](./assets/pic/config.png)

#### 3.Bật bot

Kiểm tra lại xem tất cả những bước trên đã được hoàn tất hay chưa, nếu đã hoàn thành thì dùng lệnh:

```shell
npm run start
```

Nếu CMD hiện như thế này thì bot đã bật thành công
![start.png](./assets/pic/start.png)

---

## Các Thiết lập của bot

Bạn có thể chỉnh sửa thiết lập của bot trong file `config.json`:

Bot:

-   <`token`>: Bot token
-   <`mongoURL`>: URL của MongoDB

Các máy chủ lavalink

-   `host`: Lavalink server hostname
-   `port`: Lavalink server port (Mặc định là _443_)
-   `password`: Lavalink server password
-   `secure`: Máy chủ lavalink có an toàn không (Mặc định là _`false`_)

Google:

-   `engineID`: Google custom search engine ID
-   `apiKey`: Google custom search engine API key

openWeather:

-   `apiKey`: OpenWeather API key

**Note:** _<>: required_

---

## Support

**END OF SUPPORT**

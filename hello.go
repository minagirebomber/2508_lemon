package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/basicauth"
	_ "github.com/mattn/go-sqlite3"
)

func main() {

	app := fiber.New()

	initDB()

	// Basic認証ミドルウェア設定
	app.Use(basicauth.New(basicauth.Config{
		Users: map[string]string{
			"michael": "vu1nera", // ユーザー名: パスワード
		},
		Realm: "Protected Area", // 認証ダイアログの表示名
	}))

	// 認証が通った場合のルート
	app.Get("/", Index)
	app.Get("/docs", getdocs) // documents.html

	app.Post("/post", post)
	app.Listen(":3000")
}

func Index(c *fiber.Ctx) error {
	return c.SendFile("./views/index.html")
}

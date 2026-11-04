import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiohttp import web
import os

logging.basicConfig(level=logging.INFO)

# Твой токен вшит прямо сюда
BOT_TOKEN = "9082465498:AAH9zejaIozcGEnGcxZb6CgAPD3eW8kksTE"
WEBAPP_URL = "https://justgeniousstudent.github.io/botbotbot/"

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start(message: types.Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎮 Открыть игры", web_app=WebAppInfo(url=WEBAPP_URL))]
    ])
    await message.answer("Первые 10 минут бесплатно.", reply_markup=kb)

# --- Заглушка-сервер для Render, чтобы он не ругался ---
async def handle(request):
    return web.Response(text="Bot is running!")

async def main():
    # Запускаем веб-сервер на порту Render
    app = web.Application()
    app.router.add_get("/", handle)
    runner = web.AppRunner(app)
    await runner.setup()
    port = int(os.environ.get("PORT", 8080))
    site = web.TCPSite(runner, "0.0.0.0", port)
    await site.start()
    logging.info(f"Веб-сервер запущен на порту {port}")
    
    # Запускаем бота
    logging.info("Бот запускается...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

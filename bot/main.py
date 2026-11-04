import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiohttp import web

# Токен берем из переменных окружения Render
BOT_TOKEN = os.environ.get("9082465498:AAF7tQumBnwc6x_srZ89UyqxjwQt22r46r0")
WEBAPP_URL = "https://justgeniousstudent.github.io/botbotbot/webapp/index.html"

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start(message: types.Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎮 Открыть игры", web_app=WebAppInfo(url=WEBAPP_URL))]
    ])
    await message.answer("Первые 10 минут бесплатно.", reply_markup=kb)

# --- Крошечный веб-сервер для Render ---
async def handle(request):
    return web.Response(text="Bot is running!")

async def main():
    # Запускаем веб-сервер на порту, который дает Render
    app = web.Application()
    app.router.add_get("/", handle)
    runner = web.AppRunner(app)
    await runner.setup()
    port = int(os.environ.get("PORT", 8080))
    site = web.TCPSite(runner, "0.0.0.0", port)
    await site.start()
    logging.info(f"Веб-сервер запущен на порту {port}")
    
    # Запускаем самого бота
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

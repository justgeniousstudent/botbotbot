import asyncio, logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

BOT_TOKEN = "9082465498:AAF7tQumBnwc6x_srZ89UyqxjwQt22r46r0"
WEBAPP_URL = "https://justgeniousstudent.github.io/botbotbot/"

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start(message: types.Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎮 Открыть игры", web_app=WebAppInfo(url=WEBAPP_URL))]
    ])
    await message.answer("Первые 10 минут бесплатно.", reply_markup=kb)

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

import os
import asyncio
import time
import subprocess

import yt_dlp
import pyaudio
import disnake as discord

from disnake.ext import commands
from pygame import mixer
from pydub import AudioSegment
from pytube import YouTube

SUCCESS_COLOR = discord.Color.green
ERROR_COLOR = discord.Color.red

ytdlopts = { 
    'format': 'bestaudio/best',
    'outtmpl': 'downloads/%(extractor)s-%(id)s.%(ext)s',
    # 'restrictfilenames': True,
    'noplaylist': True,
    'nocheckcertificate': True,
    'ignoreerrors': True,
    'logtostderr': False,
    'quiet': True,
    'default_search': 'youtube',
    'source_address': '0.0.0.0',
    'preferredcodec': 'mp3',
    'cachedir': 'cache_music',
    'downloader': 'ffmpeg',
    'extract_flat': True,
    'http_chunk_size': 10485760,
    # 'external_downloader': 'ffmpeg',
    # 'external_downloader_args': ['-phantomjs', 'C:\\Users\\User\\Desktop\\bbot\\phantomjs-2.1.1-windows\\bin\\phantomjs']
}

ffmpeg_options = {
    'options': '-vn',
}

bot = commands.Bot(
    command_prefix="*",
    intents=discord.Intents.all(),
    help_command=None,
    strip_after_prefix=True,
    case_insensitive=True,
)

AudioSegment.converter = r"C:/Users/User/Desktop/bbot/ffmpeg/bin/ffmpeg.exe"
AudioSegment.ffmpeg = r"C:/Users/User/Desktop/bbot/ffmpeg/bin/ffmpeg.exe"
AudioSegment.ffprobe =r"C:/Users/User/Desktop/bbot/ffmpeg/bin/ffprobe.exe"

ydl = yt_dlp.YoutubeDL(ytdlopts)
mixer.init(devicename="CABLE Input (VB-Audio Virtual Cable)")
music_list = [mixer.Sound(r"C:/Users/User/Downloads/metro_boomin.mp3"),
            mixer.Sound(r"C:/Users/User/Downloads/ooo-gorokhovyi-supchik.mp3"),
            mixer.Sound(r"C:/Users/User/Downloads/whatswrong.mp3"),
            mixer.Sound(r"C:/Users/User/Downloads/talking-ben-saying-yes.mp3"),
            mixer.Sound(r"C:/Users/User/Downloads/sir-get-down.mp3"),
            mixer.Sound(r"C:/Users/User/Downloads/dikiy-smeh-obezyanyi.mp3"),
            mixer.Sound(r"C:/Users/User/Downloads/jixaw-metal-pipe-falling-sound.mp3")]
music_play = 0
isloop = False
loop_channel = mixer.find_channel(0)
if not os.path.exists("cache_music"):
    os.makedirs("cache_music")

class PyAudioPCM(discord.AudioSource):
    def __init__(self, channels=2, rate=48000, chunk=960, input_device=3) -> None:
        p = pyaudio.PyAudio()
        self.chunks = chunk
        self.input_stream = p.open(format=pyaudio.paInt16, channels=channels, rate=rate, input=True, input_device_index=input_device, frames_per_buffer=chunk)

    def read(self) -> bytes:
        return self.input_stream.read(self.chunks)

async def check_music(voice_client):
    music_play
    if music_play == 0:
        voice_client.stop()

async def loop_music(music, duration):
    loop_channel.play(music)
    await asyncio.sleep(duration)
    if isloop:
        await loop_music(music, duration)

@commands.command(aliases=["p"])
async def play(ctx, *text):
    voice_client = ctx.guild.voice_client
    try:
        ctx.author.voice.channel
    except AttributeError:
        return await ctx.send("Зайди в канал")
    if not voice_client:
        await ctx.author.voice.channel.connect()
        voice_client = discord.utils.get(bot.voice_clients, guild=ctx.guild)

    looping = text[-1]
    if looping.lower() in ['yes', 'да', 'true']:
        looping = True
    else:
        looping = False
    if looping == True: search_url = text[:-1][0]
    else: search_url = text[0]
    time1 = time.perf_counter()
    data = YouTube(search_url)
    title = data.title
    pathforfile = f"downloads\youtube-{data.video_id}.webm"
    print(f"Информация: {time.perf_counter() - time1}")

    sound = f"{pathforfile[:-4]}ogg"
    if not os.path.exists(sound):
        with ydl:
            time2 = time.perf_counter()
            ydl.download([search_url])
            time3 = time.perf_counter()
            print(f"Скачивание: {time3 - time2}с")
            # subprocess.run(f"ffmpeg -i {pathforfile} -vn -b:a 64k {pathforfile[:-4]}.wav", shell=True)
            subprocess.run(f"ffmpeg -i {pathforfile} -vn -c:a copy {sound}", shell=True)
            os.remove(pathforfile)
            # sound = f"{pathforfile[:-4]}wav" # AudioSegment.from_file(pathforfile).export(f"{pathforfile[:-4]}wav", format="wav")
            print(f"Компилирование: {time.perf_counter() - time3}")
            print(f"Всего: {time.perf_counter() - time1}")
    global loop
    if looping == False:
        await ctx.send(f"""**Сейчас будет играть:** {title}
                       Чтобы включить цикл, после ссылки оставьте \"да\"""")
        # voice_client.play(discord.FFmpegPCMAudio(source=pathforfile, executable="ffmpeg.exe"), after=lambda e: print(f'Player error: {e}') if e else None)
        mixer.Sound(sound).play()
        if voice_client.is_playing() == False:
            voice_client.play(PyAudioPCM(), after=lambda e: print(f'Player error: {e}') if e else None)
        # mixer.Sound(sound).play()
        music_play += 1
        await asyncio.sleep(data.length+0.5)
        music_play -= 1
        await check_music(voice_client=voice_client)
    elif loop == False:
        await ctx.send(f"**24/7 будет играть:** {title}")
        if voice_client.is_playing() == False:
            voice_client.play(PyAudioPCM(), after=lambda e: print(f'Player error: {e}') if e else None)
        music_play += 1
        loop = True
        await loop_music(mixer.Sound(sound), data.length+1)
    else:
        await ctx.send("Выключите цикл чтобы включить новый: h!loop")

@commands.command(aliases=["l"])
async def loop(ctx):
    global loop
    if loop == True:
        voice_client = ctx.guild.voice_client
        try:
            ctx.author.voice.channel
        except AttributeError:
            return await ctx.send("Отказано в доступе. Зайди в канал")
        if not voice_client:
            await ctx.author.voice.channel.connect()
            voice_client = discord.utils.get(bot.voice_clients, guild=ctx.guild)

        loop = False
        loop_channel.stop()
        await ctx.send("**Цикл выключен**")
        music_play -= 1
        await check_music(voice_client=voice_client)
    else:
        await ctx.send("Цикл не включен")
        
bot.run("MTAzNjIwMzQ1ODI5MTgzMDc5Ng.Gra-O2.sGyBViX1kBi5iZri4vFzBRpACc9ffkJLzgrjtE")
import os
import asyncio
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent
from livekit.plugins import (
    openai,
    assemblyai,
    rime,
    silero,
    noise_cancellation,
)
from livekit.agents import RoomInputOptions
from livekit.plugins.turn_detector.multilingual import MultilingualModel

# Load environment variables from .env.local
script_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(script_dir, ".env.local")
load_dotenv(env_path)


class HostAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=(
                "You are a podcast host. "
                "Your job is to keep the conversation flowing, "
                "ask thoughtful and fun questions, and guide the discussion. "
                "Always speak in a friendly, welcoming, and curious tone."
            )
        )


class GuestAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=(
                "You are a podcast guest. "
                "Answer the host's questions warmly, share stories, and elaborate. "
                "Keep your answers engaging and natural, like you're chatting on a podcast."
            )
        )


async def entrypoint(ctx: agents.JobContext):
    # Host agent setup
    host_session = AgentSession(
        stt=assemblyai.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=rime.TTS(model="mist",
                     speaker="abbie", # all voices at https://users.rime.ai/data/voices/all-v2.json
                     speed_alpha=0.9,
                     reduce_latency=True),
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )

    # Guest agent setup
    guest_session = AgentSession(
        stt=assemblyai.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=rime.TTS(model="mist",
                     speaker="rainforest",
                     speed_alpha=0.9,
                     reduce_latency=True),
        turn_detection=MultilingualModel(),
    )

    # Start both sessions in the same room
    await host_session.start(
        room=ctx.room,
        agent=HostAgent(),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )
    await guest_session.start(
        room=ctx.room,
        agent=GuestAgent(),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Simple alternating loop for demo
    # In real use, you might let turn detection run free instead
    for _ in range(3):  # do 3 back-and-forth exchanges
        await host_session.generate_reply(
            instructions="Ask the guest a new, interesting question."
        )
        await asyncio.sleep(3)  # wait a moment before guest answers
        await guest_session.generate_reply(
            instructions="Reply to the host's question with detail and personality."
        )
        await asyncio.sleep(3)

    # After scripted exchanges, agents can free-talk or wait for a human to join
    await host_session.generate_reply(
        instructions="Wrap up this segment and invite the audience to stay tuned."
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))

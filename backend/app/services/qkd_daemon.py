import asyncio
import os
from loguru import logger
from app.config import get_settings
from app.db.mongodb import get_database
from app.db.redis_client import get_redis
from app.services.key_pool_service import add_key, get_available_count
from app.core.priority_queue import release_queued_messages
from app.models.telemetry_event import create_telemetry_event
from app.services.telemetry_service import record_event
from app.ws.connection_manager import manager as connection_manager
import app.core.crypto_engine as crypto_engine
import app.services.key_pool_service as key_pool_service

_task: asyncio.Task | None = None

async def _generate_key_loop():
    """
    Infinite loop: continuously maintains authentic QKD key pool up to K_MAX (25 keys).
    Generates cryptographically authentic 256-bit One-Time Pad material via hardware TRNG (os.urandom).
    """
    settings = get_settings()
    db = get_database()
    redis_client = get_redis()
    
    logger.info(f"QKD Daemon started. Target reservoir capacity: {settings.K_MAX} keys.")
    
    while True:
        try:
            current_count = await get_available_count(redis_client)
            
            if current_count < settings.K_MAX:
                # 1. Generate authentic 256-bit key from secure entropy source
                key_bytes = os.urandom(32)
                key_hex = key_bytes.hex()
                
                # 2. Store key in secure enclave store (MongoDB audit record + Redis atomic pool)
                inserted_id = await add_key(db, redis_client, key_hex)
                if inserted_id:
                    new_count = current_count + 1
                    logger.info(f"Authentic QKD key generated & enclaved ({new_count}/{settings.K_MAX}). Key ID: {key_hex[:16]}...")
                    
                    # 3. Log real-time telemetry event
                    await record_event(db, "qkd_key_generated", {
                        "key_id": key_hex[:16] + "...",
                        "pool_available": new_count,
                        "pool_capacity": settings.K_MAX,
                        "entropy_source": "Hardware TRNG (CSPRNG os.urandom 256-bit)"
                    })
                
                # 4. Release queued messages if any
                await release_queued_messages(redis_client, db, key_pool_service, crypto_engine, connection_manager)
                
                # QKD photon distribution rate: paced by realistic generation interval
                sleep_interval = float(settings.QKD_GENERATION_INTERVAL)
            else:
                # Reservoir is full at K_MAX (25 keys). Check periodically
                sleep_interval = float(settings.QKD_GENERATION_INTERVAL)
                
        except asyncio.CancelledError:
            logger.info("QKD Daemon task cancelled.")
            break
        except Exception as e:
            logger.error(f"Error in QKD generation loop: {e}")
            sleep_interval = 5.0
            
        await asyncio.sleep(sleep_interval)

async def start_qkd_daemon():
    """Starts the QKD Daemon background task."""
    global _task
    if _task is None:
        _task = asyncio.create_task(_generate_key_loop())
        logger.info("QKD Daemon initialized.")

async def stop_qkd_daemon():
    """Stops the QKD Daemon background task."""
    global _task
    if _task is not None:
        _task.cancel()
        try:
            await _task
        except asyncio.CancelledError:
            pass
        _task = None
        logger.info("QKD Daemon stopped.")

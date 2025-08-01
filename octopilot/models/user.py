from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, UUID, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String)
    image = Column(String)
    emailVerified = Column(DateTime)
    isVerified = Column(Boolean, default=False)
    
    accounts = relationship("AccountModel", backref="user")
    sessions = relationship("SessionModel", backref="user")
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    

class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    provider = Column(String, nullable=False)
    providerAccountId = Column(String, nullable=False)
    type = Column(String, nullable=False)
    refresh_token = Column(String)
    access_token = Column(String)
    expires_at = Column(Integer)
    token_type = Column(String)
    scope = Column(String)
    id_token = Column(String)
    session_state = Column(String)
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))


class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(UUID, primary_key=True)
    userId = Column(UUID, ForeignKey("users.id"))
    sessionToken = Column(String, nullable=False)
    expires = Column(DateTime, nullable=False)
    



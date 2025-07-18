from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone

engine = create_engine('sqlite:///database.db', echo=True)
Base = declarative_base()


class Challenge(Base):
    __tablename__ = 'challenges'

    id = Column(Integer, primary_key=True)
    difficulty = Column(String, nullable=False)
    date_created = Column(DateTime(timezone=True),
                          default=lambda: datetime.now(timezone.utc))
    created_by = Column(String, nullable=False)
    title = Column(String, nullable=False)
    options = Column(String, nullable=False)
    correct_answer_id = Column(Integer, nullable=False)
    explanation = Column(String, nullable=False)


class ChallengeQuota(Base):
    __tablename__ = 'challenge_quotas'

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False, unique=True)
    quota_remaining = Column(Integer, nullable=False, default=50)
    last_reset_date = Column(DateTime(timezone=True),
                             default=lambda: datetime.now(timezone.utc))


class Rewrite(Base):
    __tablename__ = 'rewrites'

    id = Column(Integer, primary_key=True)
    original_text = Column(String, nullable=False)
    improved_text = Column(String, nullable=False)
    type = Column(String, nullable=False)
    date_created = Column(DateTime(timezone=True),
                          default=lambda: datetime.now(timezone.utc))
    created_by = Column(String, nullable=False)


class Profile(Base):
    __tablename__ = 'profiles'

    id = Column(Integer, primary_key=True)
    clerk_user_id = Column(String, unique=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    xp = Column(Integer, default=0)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True),
                        default=lambda: datetime.now(timezone.utc))


Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

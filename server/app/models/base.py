from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True
    
    def to_dict(self):
        return {key: getattr(self, key) for key in self.__mapper__.c.keys()}
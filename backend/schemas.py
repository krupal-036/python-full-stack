from pydantic import BaseModel, Field, validator
from typing import Optional
import re

EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$'

class UserSchema(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: str = Field(..., pattern=EMAIL_REGEX)
    age: Optional[int] = Field(None, ge=18)
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v

class UserUpdateSchema(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=20)
    email: Optional[str] = Field(None, pattern=EMAIL_REGEX)
    age: Optional[int] = Field(None, ge=18)
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if v is not None and not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v

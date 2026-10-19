from pydantic import BaseModel

class Transaction(BaseModel):
    date: str
    type: str
    category: str
    description: str
    amount: float

from datetime import date
from typing import Literal
from pydantic import BaseModel, Field


class Transaction(BaseModel):
    date: date
    type: Literal["Income", "Expense"]
    category: str
    description: str = ""
    amount: float = Field(gt=0)

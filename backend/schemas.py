from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioSchema(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    seguindo_nome: Optional[list[str]] = []
    seguidores_nomes: Optional[list[str]] = []
    seguidores_contagem: Optional[int] = 0

    class Config:
        from_attributes = True

class ComentarioSchema(BaseModel):
    usuario_id: int
    titulo: Optional[str]
    conteudo: str

    class Config:
        from_attributes = True
        
class EnquetesSchema(BaseModel):
    nome: str
    titulo: Optional[str]
    conteudo: str

    class Config:
        from_attributes = True
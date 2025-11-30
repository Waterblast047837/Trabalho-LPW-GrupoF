from fastapi import APIRouter, Depends, HTTPException
from main import bcrypt_context
from dependencies import pegar_sessao
from models import Usuario
from schemas import UsuarioSchema
from sqlalchemy.orm import Session

user_router = APIRouter(prefix="/users", tags=["users"])

@user_router.get("/")
async def user_root():
    return {"mensagem": "Você está na rota de usuários, seu filho da puta"}

@user_router.post("/registrar")
async def registrar_usuario(usuarioModelo: UsuarioSchema, sessao: Session = Depends(pegar_sessao)):
    usuario_existente = sessao.query(Usuario).filter(Usuario.email == usuarioModelo.email).first()
    
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    else:
        senha_criptografada = bcrypt_context.hash(usuarioModelo.senha)
        novo_usuario = Usuario(nome = usuarioModelo.nome, email = usuarioModelo.email, senha = senha_criptografada)
        sessao.add(novo_usuario)
        sessao.commit()
        return {"mensagem": "cadastro realizado com sucesso"}
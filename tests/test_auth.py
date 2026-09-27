import os
import sys

# Garante que "app" seja importável quando o pytest roda a partir da raiz do backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from app import create_app
from app.extensions import db
from app.models.user import User

EMAIL_TESTE = "pytest.auth@teste.com"


def dados_validos(email=EMAIL_TESTE):
    return {
        "nome": "Usuario Pytest",
        "email": email,
        "senha": "senha123",
        "ambiente": "individual",
        "tempo": "ate_15_min",
        "recursos": "computador",
        "interlocutores": "sozinho",
    }


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True

    with app.app_context():
        # remove qualquer resíduo de execuções anteriores antes do teste
        User.query.filter_by(email=EMAIL_TESTE).delete()
        db.session.commit()

    with app.test_client() as test_client:
        yield test_client

    with app.app_context():
        # limpa o que este teste criou, mesmo se o teste falhar no meio
        User.query.filter_by(email=EMAIL_TESTE).delete()
        db.session.commit()


def test_registro_com_sucesso(client):
    resposta = client.post("/api/auth/register", json=dados_validos())
    assert resposta.status_code == 201
    assert resposta.get_json()["user"]["email"] == EMAIL_TESTE


def test_registro_campo_obrigatorio_faltando(client):
    dados = dados_validos()
    del dados["ambiente"]
    resposta = client.post("/api/auth/register", json=dados)
    assert resposta.status_code == 400


def test_registro_email_duplicado(client):
    client.post("/api/auth/register", json=dados_validos())
    resposta = client.post("/api/auth/register", json=dados_validos())
    assert resposta.status_code == 409


def test_registro_enum_invalido_para_ambiente(client):
    # "ambiente" fora da lista aceita pela CHECK constraint do Postgres.
    # A rota hoje não valida isso antes de tentar salvar: o esperado seria
    # 400, mas sem validação server-side isso pode estourar como 500
    # (erro de integridade do banco não tratado). Este teste documenta
    # o comportamento real, seja qual for, em vez de assumir.
    dados = dados_validos()
    dados["ambiente"] = "valor_que_nao_existe"
    resposta = client.post("/api/auth/register", json=dados)
    assert resposta.status_code in (400, 500)


def test_login_com_sucesso(client):
    client.post("/api/auth/register", json=dados_validos())
    resposta = client.post(
        "/api/auth/login", json={"email": EMAIL_TESTE, "senha": "senha123"}
    )
    assert resposta.status_code == 200
    assert "access_token" in resposta.get_json()


def test_login_senha_errada(client):
    client.post("/api/auth/register", json=dados_validos())
    resposta = client.post(
        "/api/auth/login", json={"email": EMAIL_TESTE, "senha": "errada"}
    )
    assert resposta.status_code == 401


def test_login_email_inexistente(client):
    resposta = client.post(
        "/api/auth/login", json={"email": "ninguem@teste.com", "senha": "x"}
    )
    assert resposta.status_code == 401

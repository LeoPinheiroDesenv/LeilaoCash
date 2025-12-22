# Exemplos de Uso da API VibeGet

## 🔐 Autenticação

### 1. Registro de Novo Usuário

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123",
    "password_confirmation": "senha123",
    "cpf": "12345678900",
    "phone": "(11) 99999-9999",
    "birth_date": "1990-01-01"
  }'
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "cpf": "12345678900",
      "phone": "(11) 99999-9999",
      "balance": "0.00",
      "cashback_balance": "0.00",
      "is_admin": false,
      "is_active": true
    },
    "access_token": "1|a9s8d7f6a5s4d3f2a1s...",
    "token_type": "Bearer"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@teste.com",
    "password": "teste123"
  }'
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 2,
      "name": "Usuário Teste",
      "email": "usuario@teste.com",
      "balance": "500.00",
      "cashback_balance": "50.00"
    },
    "access_token": "2|b8c7d6e5f4g3h2i1j...",
    "token_type": "Bearer"
  }
}
```

**Erro de Credenciais (401):**
```json
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

## 🔒 Rotas Protegidas

**⚠️ Todas as requisições abaixo precisam do header de autenticação:**

```bash
Authorization: Bearer SEU_TOKEN_AQUI
```

### 3. Obter Dados do Usuário Autenticado

```bash
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Usuário Teste",
    "email": "usuario@teste.com",
    "cpf": "11111111111",
    "phone": "(11) 88888-8888",
    "balance": "500.00",
    "cashback_balance": "50.00",
    "is_admin": false,
    "is_active": true,
    "created_at": "2024-12-18T10:00:00.000000Z"
  }
}
```

### 4. Obter Saldo

```bash
curl http://localhost:8000/api/user/balance \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "balance": "500.00",
    "cashback_balance": "50.00"
  }
}
```

### 5. Atualizar Perfil

```bash
curl -X PUT http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "phone": "(11) 88888-8888",
    "address": "Rua Exemplo, 123",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01234-567"
  }'
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Perfil atualizado com sucesso",
  "data": {
    "id": 2,
    "name": "João Silva Atualizado",
    "email": "usuario@teste.com",
    "phone": "(11) 88888-8888",
    "address": "Rua Exemplo, 123",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01234-567"
  }
}
```

### 6. Alterar Senha

```bash
curl -X PUT http://localhost:8000/api/auth/change-password \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "teste123",
    "password": "novasenha123",
    "password_confirmation": "novasenha123"
  }'
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

**Erro - Senha atual incorreta (401):**
```json
{
  "success": false,
  "message": "Senha atual incorreta"
}
```

### 7. Logout

```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

### 8. Logout de Todos os Dispositivos

```bash
curl -X POST http://localhost:8000/api/auth/logout-all \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Logout de todos os dispositivos realizado com sucesso"
}
```

## 🏥 Health Check

### 9. Verificar Status da API

```bash
curl http://localhost:8000/api/health
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "VibeGet API is running",
  "timestamp": "2024-12-18T10:00:00.000000Z"
}
```

## ⚠️ Códigos de Resposta HTTP

| Código | Significado | Quando ocorre |
|--------|-------------|---------------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado (ex: novo usuário) |
| 401 | Unauthorized | Credenciais inválidas ou token expirado |
| 403 | Forbidden | Acesso negado (ex: usuário inativo) |
| 422 | Unprocessable Entity | Erro de validação nos dados enviados |
| 500 | Internal Server Error | Erro interno do servidor |

## 🧪 Testando no Postman/Insomnia

### Configurar Variável de Ambiente

1. Crie uma variável `base_url` com o valor: `http://localhost:8000`
2. Após fazer login, salve o `access_token` em uma variável
3. Configure o header global:
   ```
   Authorization: Bearer {{access_token}}
   ```

### Sequência de Testes Recomendada

1. ✅ Health Check (`GET /api/health`)
2. ✅ Login (`POST /api/auth/login`)
3. ✅ Obter dados do usuário (`GET /api/auth/me`)
4. ✅ Obter saldo (`GET /api/user/balance`)
5. ✅ Atualizar perfil (`PUT /api/auth/profile`)
6. ✅ Alterar senha (`PUT /api/auth/change-password`)
7. ✅ Logout (`POST /api/auth/logout`)

## 📝 Exemplos com JavaScript (Frontend)

### Login e Armazenar Token

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Armazenar token no localStorage
      localStorage.setItem('access_token', data.data.access_token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};
```

### Fazer Requisição Autenticada

```javascript
const getUserProfile = async () => {
  const token = localStorage.getItem('access_token');
  
  try {
    const response = await fetch('http://localhost:8000/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    throw error;
  }
};
```

### Logout

```javascript
const logout = async () => {
  const token = localStorage.getItem('access_token');
  
  try {
    await fetch('http://localhost:8000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Limpar localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};
```

## 🔧 Tratamento de Erros

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Erro de resposta da API
    switch (error.response.status) {
      case 401:
        // Token inválido ou expirado - redirecionar para login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        break;
      case 403:
        // Acesso negado
        alert('Você não tem permissão para acessar este recurso');
        break;
      case 422:
        // Erro de validação
        console.error('Erros de validação:', error.response.data.errors);
        break;
      default:
        alert('Ocorreu um erro. Tente novamente.');
    }
  } else {
    // Erro de rede
    alert('Erro de conexão. Verifique sua internet.');
  }
};
```


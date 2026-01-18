<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinição de Senha</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
        }
        .content {
            padding: 20px 0;
        }
        .content p {
            line-height: 1.6;
            color: #333333;
        }
        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 15px;
            background-color: #E55F52;
            color: #ffffff;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Redefinição de Senha</h2>
        </div>
        <div class="content">
            <p>Olá,</p>
            <p>Você está recebendo este e-mail porque recebemos uma solicitação de redefinição de senha para sua conta.</p>
            <p>Clique no botão abaixo para redefinir sua senha:</p>
            <a href="{{ $resetUrl }}" class="button">Redefinir Senha</a>
            <p>Se você não solicitou uma redefinição de senha, nenhuma ação é necessária.</p>
            <p>O link de redefinição de senha expirará em 60 minutos.</p>
            <p>Se estiver com problemas para clicar no botão "Redefinir Senha", copie e cole o URL abaixo em seu navegador:</p>
            <p><a href="{{ $resetUrl }}">{{ $resetUrl }}</a></p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} LeilaoCash. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>

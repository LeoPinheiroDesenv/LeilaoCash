<x-mail::message>
# Redefinição de Senha

Você está recebendo este e-mail porque recebemos uma solicitação de redefinição de senha para sua conta.

<x-mail::button :url="$url">
Redefinir Senha
</x-mail::button>

Este link de redefinição de senha expirará em 60 minutos.

Se você não solicitou uma redefinição de senha, nenhuma ação adicional é necessária.

Obrigado,<br>
{{ config('app.name') }}
</x-mail::message>

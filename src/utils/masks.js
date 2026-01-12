export const maskCPF = (value) => {
  return value
    .replace(/\D/g, '') // Remove tudo o que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos de novo (para o segundo bloco de números)
    .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o terceiro e o quarto dígitos
    .replace(/(-\d{2})\d+?$/, '$1'); // Captura apenas os dois últimos dígitos
};

export const maskPhone = (value) => {
  return value
    .replace(/\D/g, '') // Remove tudo o que não é dígito
    .replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
    .replace(/(\d)(\d{4})$/, '$1-$2'); // Coloca hífen entre o quarto e o quinto dígitos
};

export const maskCEP = (value) => {
  return value
    .replace(/\D/g, '') // Remove tudo o que não é dígito
    .replace(/^(\d{5})(\d)/, '$1-$2') // Coloca hífen entre o quinto e o sexto dígitos
    .replace(/(-\d{3})\d+?$/, '$1'); // Captura apenas os três últimos dígitos
};

export const unmask = (value) => {
  return value.replace(/\D/g, '');
};

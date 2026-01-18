export const maskCPF = (value) => {
  // Remove tudo que não é dígito e limita a 11 caracteres
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  // Aplica a máscara 000.000.000-00
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const maskPhone = (value) => {
  // Remove tudo que não é dígito e limita a 11 caracteres
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  // Aplica a máscara (00) 00000 0000
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2 $3');
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

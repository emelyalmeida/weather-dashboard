# Weather Dashboard

Aplicação de previsão do tempo feita com HTML, CSS e JavaScript puro. A interface tem uma paleta suave, layout responsivo e opções para consultar e salvar cidades.

## Funcionalidades

- Busca de cidades com sugestões
- Temperatura, sensação térmica, umidade, vento e pressão
- Previsão para os próximos dias
- Ícones que acompanham as condições do tempo
- Opção de usar a localização do dispositivo
- Lista de cidades favoritas salva no navegador
- Tema claro e escuro
- Layout adaptável para desktop e celular
- Modo de demonstração para testar a interface sem uma chave de API

## Como executar

1. Baixe ou clone este repositório.
2. Abra `index.html` no navegador.
3. Sem uma chave de API configurada, a aplicação usa dados de demonstração.

Não é necessário instalar dependências para testar a versão de demonstração.

## Ativar dados meteorológicos reais

A aplicação usa a API da [OpenWeather](https://openweathermap.org/api) para consultar o tempo atual e a previsão.

1. Crie uma conta na OpenWeather e gere uma chave de API.
2. Abra `js/script.js`.
3. Informe a chave na constante `API_KEY`:

```js
const API_KEY = "SUA_CHAVE_AQUI";
```

4. Salve o arquivo e recarregue a página.

**Atenção:** não publique chaves privadas em repositórios públicos. Para um projeto público, o ideal é mover a chamada da API para um backend ou usar uma configuração de desenvolvimento que não exponha segredos.

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeather API (opcional)
- LocalStorage

## Estrutura

```text
weather-dashboard/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Próximas melhorias

- Adicionar testes automatizados
- Tratar estados de carregamento e erros da API com mensagens mais específicas
- Separar configuração e lógica de consulta meteorológica

---

Projeto de portfólio desenvolvido para praticar desenvolvimento front-end e consumo de APIs.

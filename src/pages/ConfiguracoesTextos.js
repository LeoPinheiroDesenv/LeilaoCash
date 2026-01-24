import React, { useState, useMemo } from 'react';
import TextEditor from '../components/TextEditor';
import '../components/TextEditor.css';

const ConfiguracoesTextos = ({ settings, onInputChange }) => {
  const [activeTextTab, setActiveTextTab] = useState('home');

  // Organizar páginas individualmente
  const pageGroups = useMemo(() => {
    const contentSettings = settings.content || [];
    const socialSettings = settings.social || [];
    const textSettings = settings.text || []; // Incluir configurações do grupo 'text'
    
    // Combinar content e text para facilitar a filtragem
    const allTextSettings = [...contentSettings, ...textSettings];
    
    // Organizar textos da Home em subgrupos
    const homeSettings = allTextSettings.filter(s => 
      s.key.startsWith('home_') || 
      s.key.startsWith('why_') || 
      s.key.startsWith('text_why_') ||
      s.key.startsWith('text_hero_') ||
      s.key.startsWith('text_section_') ||
      s.key.startsWith('icon_section_') ||
      s.key === 'text_ver_todos' ||
      s.key === 'text_cta_title' ||
      s.key === 'text_cta_subtitle'
    );

    const groups = {
      home: {
        name: 'Home',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        ),
        settings: homeSettings,
        subgroups: {
          hero: {
            name: 'Seção Hero (Topo da Página)',
            settings: homeSettings.filter(s => 
              s.key.startsWith('text_hero_') && 
              !s.key.includes('stat')
            )
          },
          hero_stats: {
            name: 'Estatísticas do Hero',
            settings: homeSettings.filter(s => 
              s.key.startsWith('text_hero_stat')
            )
          },
          sections: {
            name: 'Seções de Produtos',
            settings: homeSettings.filter(s => 
              s.key.startsWith('text_section_') || 
              s.key.startsWith('icon_section_') ||
              s.key === 'text_ver_todos'
            )
          },
          cta: {
            name: 'Seção CTA (Antes do Rodapé)',
            settings: homeSettings.filter(s => 
              s.key === 'text_cta_title' || 
              s.key === 'text_cta_subtitle'
            )
          }
        }
      },
      why_choose_us: {
        name: 'Por que comprar na VibeGet?',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <path d="M12 17h.01"></path>
          </svg>
        ),
        settings: allTextSettings.filter(s => s.key.startsWith('text_why_'))
      },
      como_funciona: {
        name: 'Como Funciona',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        ),
        settings: allTextSettings.filter(s => s.key === 'page_como_funciona')
      },
      categorias: {
        name: 'Categorias',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        ),
        settings: allTextSettings.filter(s => s.key === 'page_categorias')
      },
      termos: {
        name: 'Termos',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        ),
        settings: allTextSettings.filter(s => s.key === 'page_termos')
      },
      faq: {
        name: 'FAQ',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <path d="M12 17h.01"></path>
          </svg>
        ),
        settings: allTextSettings.filter(s => s.key === 'page_faq')
      },
      privacidade: {
        name: 'Privacidade',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        ),
        settings: allTextSettings.filter(s => s.key === 'page_privacidade')
      },
      regras: {
        name: 'Regras',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
        ),
        settings: allTextSettings.filter(s => s.key === 'page_regras')
      },
      contato: {
        name: 'Fale Conosco',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        ),
        settings: allTextSettings.filter(s => s.key === 'page_contact_text' || s.key.startsWith('text_contact_') || s.key.startsWith('text_header_contact'))
      },
      suba_de_nivel: {
        name: 'Suba de Nível',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        ),
        settings: allTextSettings.filter(s => s.key === 'page_suba_de_nivel')
      },
      header: {
        name: 'Cabeçalho (Header)',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        ),
        settings: allTextSettings.filter(s => 
          s.key.startsWith('text_header_')
        )
      },
      leiloes: {
        name: 'Página de Leilões',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        ),
        settings: allTextSettings.filter(s => 
          s.key.startsWith('text_auctions_') ||
          s.key === 'text_all_categories' ||
          s.key === 'text_no_auctions'
        )
      },
      produtos: {
        name: 'Página de Produto',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <path d="M2 10h20"></path>
          </svg>
        ),
        settings: allTextSettings.filter(s => 
          s.key.startsWith('text_') && (
            s.key.includes('product') ||
            s.key.includes('bid') ||
            s.key.includes('favorite') ||
            s.key.includes('share') ||
            s.key.includes('cashback') ||
            s.key.includes('back') ||
            s.key.includes('image') ||
            s.key.includes('loading') ||
            s.key.includes('error') ||
            s.key.includes('success') ||
            s.key.includes('hot_deal') ||
            s.key.includes('visits') ||
            s.key.includes('category') ||
            s.key.includes('brand') ||
            s.key.includes('model') ||
            s.key.includes('auction') ||
            s.key.includes('status') ||
            s.key.includes('scheduled') ||
            s.key.includes('finished') ||
            s.key.includes('starting_bid') ||
            s.key.includes('time_remaining') ||
            s.key.includes('current_bid') ||
            s.key.includes('current_leader') ||
            s.key.includes('min_bid') ||
            s.key.includes('increment') ||
            s.key.includes('description') ||
            s.key.includes('specifications') ||
            s.key.includes('bid_history') ||
            s.key.includes('no_bids') ||
            s.key.includes('no_leader') ||
            s.key.includes('not_in_auction') ||
            s.key.includes('buy_credits') ||
            s.key.includes('secure_purchase') ||
            s.key.includes('free_shipping') ||
            s.key.includes('warranty') ||
            s.key.includes('active') ||
            s.key.includes('inactive')
          ) && 
          !s.key.startsWith('text_header_') &&
          !s.key.startsWith('text_footer_') &&
          !s.key.startsWith('text_hero_') &&
          !s.key.startsWith('text_section_') &&
          !s.key.startsWith('text_why_') &&
          !s.key.startsWith('text_cta_') &&
          !s.key.startsWith('text_auctions_')
        )
      },
      interface: {
        name: 'Interface Geral',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        ),
        settings: allTextSettings.filter(s => 
          !s.key.startsWith('home_') && 
          !s.key.startsWith('why_') && 
          !s.key.startsWith('text_why_') && 
          !s.key.startsWith('text_hero_') && 
          !s.key.startsWith('text_section_') &&
          !s.key.startsWith('text_header_') &&
          !s.key.startsWith('text_footer_') &&
          !s.key.startsWith('page_') &&
          !s.key.startsWith('social_') &&
          !s.key.includes('product') &&
          !s.key.includes('bid') &&
          !s.key.includes('favorite') &&
          !s.key.includes('share') &&
          !s.key.includes('cashback') &&
          !s.key.includes('back') &&
          !s.key.includes('image') &&
          !s.key.includes('loading') &&
          !s.key.includes('error') &&
          !s.key.includes('success') &&
          !s.key.includes('hot_deal') &&
          !s.key.includes('visits') &&
          !s.key.includes('category') &&
          !s.key.includes('brand') &&
          !s.key.includes('model') &&
          !s.key.includes('auction') &&
          !s.key.includes('status') &&
          !s.key.includes('scheduled') &&
          !s.key.includes('finished') &&
          !s.key.includes('starting_bid') &&
          !s.key.includes('time_remaining') &&
          !s.key.includes('current_bid') &&
          !s.key.includes('current_leader') &&
          !s.key.includes('min_bid') &&
          !s.key.includes('increment') &&
          !s.key.includes('description') &&
          !s.key.includes('specifications') &&
          !s.key.includes('bid_history') &&
          !s.key.includes('no_bids') &&
          !s.key.includes('no_leader') &&
          !s.key.includes('not_in_auction') &&
          !s.key.includes('buy_credits') &&
          !s.key.includes('secure_purchase') &&
          !s.key.includes('free_shipping') &&
          !s.key.includes('warranty') &&
          !s.key.includes('active') &&
          !s.key.includes('inactive') &&
          !s.key.includes('cta')
        )
      },
      redes_sociais: {
        name: 'Redes Sociais',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        ),
        settings: socialSettings
      }
    };

    // Filtrar apenas grupos que têm settings
    return Object.entries(groups).filter(([_, group]) => group.settings.length > 0);
  }, [settings.content, settings.social, settings.text]);

      // Mapear textos para suas localizações no site
      const getTextLocation = (key) => {
        const locations = {
          // Hero Section
          'text_hero_cashback_banner': '📍 Banner verde no topo da página inicial com ícone de raio',
          'text_hero_title': '📍 Primeira parte do título principal grande no centro da página inicial',
          'text_hero_title_highlight': '📍 Parte destacada do título (texto em gradiente colorido)',
          'text_hero_subtitle': '📍 Subtítulo abaixo do título principal',
          'text_hero_search_placeholder': '📍 Texto dentro do campo de busca no Hero',
          'text_hero_stat_users': '📍 Número de usuários nas estatísticas (ex: 15K+)',
          'text_hero_stat_users_label': '📍 Label "Usuários" abaixo do número',
          'text_hero_stat_cashback': '📍 Valor em cashback nas estatísticas (ex: R$2M+)',
          'text_hero_stat_cashback_label': '📍 Label "Em Cashback" abaixo do valor',
          'text_hero_stat_auctions': '📍 Número de leilões nas estatísticas (ex: 1.8K+)',
          'text_hero_stat_auctions_label': '📍 Label "Leilões" abaixo do número',
          
          // Seções da Home
          'text_section_destaques_title': '📍 Título da primeira seção de produtos na página inicial',
          'text_section_destaques_subtitle': '📍 Subtítulo abaixo do título "Em Destaque"',
          'icon_section_destaques': '📍 Ícone ao lado do título "Em Destaque" (pode ser emoji ou código SVG)',
          'text_section_quentes_title': '📍 Título da segunda seção de produtos na página inicial',
          'text_section_quentes_subtitle': '📍 Subtítulo abaixo do título "Ofertas Quentes"',
          'icon_section_quentes': '📍 Ícone ao lado do título "Ofertas Quentes"',
          'text_section_encerrando_title': '📍 Título da terceira seção de produtos na página inicial',
          'text_section_encerrando_subtitle': '📍 Subtítulo abaixo do título "Encerrando em Breve"',
          'icon_section_encerrando': '📍 Ícone ao lado do título "Encerrando em Breve"',
          'text_ver_todos': '📍 Botão ao lado dos títulos das seções de produtos',
          'text_cta_title': '📍 Título da seção CTA antes do rodapé na página inicial',
          'text_cta_subtitle': '📍 Subtítulo da seção CTA',
          
          // Header
          'text_header_home': '📍 Link "Início" no menu de navegação superior',
          'text_header_highlights': '📍 Link "Destaques" no menu de navegação',
          'text_header_ending_soon': '📍 Link "Encerrando" no menu de navegação',
          'text_header_login': '📍 Botão "Entrar" no canto superior direito',
          'text_header_cadastro': '📍 Botão "Cadastrar" no canto superior direito',
          'text_header_search_placeholder': '📍 Placeholder do campo de busca no header (quando não está na home)',
          'text_header_como_funciona': '📍 Link "Como Funciona" no botão CTA',
          'text_header_how_it_works': '📍 Link "Como Funciona" no menu superior',
          'text_header_auctions': '📍 Link "Leilões" no menu superior e mobile',
          'text_header_contact': '📍 Link "Fale Conosco" no menu superior',
          'text_header_contact_subtitle': '📍 Subtítulo na página de contato ("Estamos aqui para ajudar")',
          
          // Cards de Produtos
          'text_ver_leilao': '📍 Botão nos cards de produtos na página inicial',
          'text_bids': '📍 Texto "lances" após o número de lances nos cards',
          
          // Página de Leilões
          'text_auctions_title': '📍 Título principal da página /leiloes',
          'text_auctions_subtitle': '📍 Subtítulo da página /leiloes',
          'text_all_categories': '📍 Opção padrão no filtro de categorias',
          'text_no_auctions': '📍 Mensagem quando não há leilões encontrados',
          
          // Footer
          'text_footer_sobre_desc': '📍 Descrição da empresa na primeira coluna do rodapé',
          'text_footer_quick_links': '📍 Título da coluna "Links Rápidos" no rodapé',
          'text_footer_legal': '📍 Título da coluna "Legal" no rodapé',
          'text_footer_contato': '📍 Título da coluna "Contato" no rodapé',
          'text_footer_copyright': '📍 Texto de copyright no final do rodapé',
          
          // Por que Escolher
          'text_why_title': '📍 Título principal da seção "Por que comprar" no final da página inicial',
          'text_why_card_1_title': '📍 Título do primeiro card na seção "Por que comprar"',
          'text_why_card_1_desc': '📍 Descrição do primeiro card',
          'text_why_card_2_title': '📍 Título do segundo card na seção "Por que comprar"',
          'text_why_card_2_desc': '📍 Descrição do segundo card',
          'text_why_card_3_title': '📍 Título do terceiro card na seção "Por que comprar"',
          'text_why_card_3_desc': '📍 Descrição do terceiro card',
          'text_why_card_4_title': '📍 Título do quarto card na seção "Por que comprar"',
          'text_why_card_4_desc': '📍 Descrição do quarto card',
          
          // Página de Produto
          'text_cashback': '📍 Texto "Cashback" na página do produto',
          'text_current_bid': '📍 Label "Lance atual" na página do produto',
          'text_product_price': '📍 Label "Valor de mercado" na página do produto',
          'text_place_bid': '📍 Botão "Dar Lance" na página do produto',
          'text_bidding': '📍 Texto do botão enquanto envia o lance ("Enviando...")',
          'text_bid_success': '📍 Mensagem de sucesso após dar lance',
          'text_bid_error_generic': '📍 Mensagem de erro genérico ao dar lance',
          'text_favorite': '📍 Botão "Favoritar" na página do produto',
          'text_back': '📍 Botão "Voltar" na página do produto',
          'text_loading': '📍 Mensagem "Carregando..." em várias páginas',
          'text_loading_product': '📍 Mensagem "Carregando produto..." na página do produto',
          'text_try_again': '📍 Botão "Tentar Novamente" em caso de erro',
          
          // Página de Contato
          'page_contact_text': '📍 Texto customizável na página de contato (acima do formulário)',
          'text_contact_form_title': '📍 Título do formulário na página de contato',
          'text_contact_name': '📍 Label do campo "Nome" no formulário de contato',
          'text_contact_name_placeholder': '📍 Placeholder do campo "Nome"',
          'text_contact_email': '📍 Label do campo "E-mail" no formulário de contato',
          'text_contact_email_placeholder': '📍 Placeholder do campo "E-mail"',
          'text_contact_subject': '📍 Label do campo "Assunto" no formulário de contato',
          'text_contact_subject_placeholder': '📍 Placeholder do campo "Assunto"',
          'text_contact_message': '📍 Label do campo "Mensagem" no formulário de contato',
          'text_contact_message_placeholder': '📍 Placeholder do campo "Mensagem"',
          'text_contact_send': '📍 Texto do botão "Enviar Mensagem" no formulário',
          'text_contact_sending': '📍 Texto do botão enquanto envia ("Enviando...")',
          'text_contact_success': '📍 Mensagem de sucesso ao enviar formulário',
          'text_contact_error_name': '📍 Mensagem de erro: campo nome vazio',
          'text_contact_error_email': '📍 Mensagem de erro: e-mail inválido',
          'text_contact_error_subject': '📍 Mensagem de erro: campo assunto vazio',
          'text_contact_error_message': '📍 Mensagem de erro: campo mensagem vazio',
          'text_contact_error_generic': '📍 Mensagem de erro genérico ao enviar',
          'text_contact_info_title': '📍 Título "Outras Formas de Contato" na página de contato',
          'text_contact_email_label': '📍 Label "E-mail" na seção de contato',
          'text_contact_email_value': '📍 Endereço de e-mail na seção de contato',
          'text_contact_phone_label': '📍 Label "Telefone" na seção de contato',
          'text_contact_phone_value': '📍 Número de telefone na seção de contato',
          'text_contact_address_label': '📍 Label "Endereço" na seção de contato',
          'text_contact_address_value': '📍 Endereço físico na seção de contato',
                  // Página Como Funciona
          'page_como_funciona': '📍 Conteúdo principal da página "Como Funciona"',
        };
        return locations[key] || null;
      };

  const renderTextEditor = (setting) => (
    <div key={setting.key} className="setting-item-full">
      <div className="setting-header">
        <label className="setting-label">{setting.description || setting.key}</label>
        <span className="setting-key">{setting.key}</span>
      </div>
      {(() => {
        const location = getTextLocation(setting.key);
        return location ? (
          <div className="text-location-hint">
            {location}
          </div>
        ) : null;
      })()}
      {setting.type === 'html' ? (
        <TextEditor
          value={setting.value || ''}
          onChange={(value) => onInputChange(setting.key, value)}
          placeholder={setting.description}
        />
      ) : (
        <input
          type="text"
          value={setting.value || ''}
          onChange={(e) => onInputChange(setting.key, e.target.value)}
          className="text-input"
          placeholder={setting.description}
        />
      )}
    </div>
  );

  const renderSocialInput = (setting) => (
    <div key={setting.key} className="setting-item">
      <div className="setting-header">
        <label className="setting-label">{setting.description || setting.key}</label>
        <span className="setting-key">{setting.key}</span>
      </div>
      <input
        type="url"
        value={setting.value || ''}
        onChange={(e) => onInputChange(setting.key, e.target.value)}
        className="text-input"
        placeholder={setting.description}
      />
    </div>
  );

  const activeGroup = pageGroups.find(([key]) => key === activeTextTab)?.[1];

  return (
    <div className="configuracoes-textos">
      <div className="text-sub-tabs">
        {pageGroups.map(([key, group]) => (
          <button
            key={key}
            className={`text-tab-button ${activeTextTab === key ? 'active' : ''}`}
            onClick={() => setActiveTextTab(key)}
          >
            {group.icon}
            {group.name}
          </button>
        ))}
      </div>

      <div className="text-content">
        {activeGroup && (
          <div className={activeTextTab === 'redes_sociais' ? 'settings-grid' : 'settings-grid-full'}>
            {activeTextTab === 'redes_sociais' ? (
              <>
                <h3 className="section-subtitle">Links das Redes Sociais</h3>
                {activeGroup.settings.map(renderSocialInput)}
              </>
            ) : activeTextTab === 'home' && activeGroup.subgroups ? (
              <>
                {Object.entries(activeGroup.subgroups).map(([subKey, subgroup]) => {
                  if (subgroup.settings.length === 0) return null;
                  return (
                    <div key={subKey} className="text-subgroup">
                      <h4 className="text-subgroup-title">{subgroup.name}</h4>
                      {subgroup.settings.map(renderTextEditor)}
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <h3 className="section-subtitle">Conteúdo da Página: {activeGroup.name}</h3>
                {activeGroup.settings.map(renderTextEditor)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracoesTextos;

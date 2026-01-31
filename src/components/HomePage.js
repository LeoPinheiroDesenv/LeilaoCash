import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Hero from './Hero';
import WhyChooseUs from './WhyChooseUs';
import ProductSection from './ProductSection';
import AuctionCard from './AuctionCard';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

// Função utilitária movida para fora do componente para evitar recriação
const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return '00:00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const HomePage = ({ searchTerm, onSearch }) => {
    const { getText } = useTheme();
    const [searchParams] = useSearchParams();
    const filter = searchParams.get('filter');

    const [loading, setLoading] = useState(true);
    const [auctions, setAuctions] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [hotOffers, setHotOffers] = useState([]);
    const [endingSoon, setEndingSoon] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [error, setError] = useState(null);
    const resultsRef = useRef(null);

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories/public?is_active=true');
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    const loadAuctionsMemo = useCallback(async (categoryId = null, search = '') => {
        try {
            setLoading(true);
            setError(null);

            let url = '/auctions/public?status=active&per_page=20';
            if (categoryId) {
                url += `&category_id=${categoryId}`;
            }
            if (search) {
                url += `&search=${search}`;
            }

            // Buscar leilões ativos e agendados
            const response = await api.get(url, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                const auctionsData = response.data.data.data || response.data.data || [];

                // Transformar leilões em formato de produtos para exibição
                const nowDate = new Date();
                const products = auctionsData.flatMap(auction =>
                    (auction.products || []).map(product => ({
                        id: product.id,
                        title: product.name,
                        price: `R$ ${parseFloat(auction.current_bid || auction.starting_bid).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        oldPrice: `R$ ${parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        cashbackPercent: `${parseFloat(auction.cashback_percentage || 0).toFixed(0)}%`,
                        discount: Math.round(((parseFloat(product.price) - parseFloat(auction.current_bid || auction.starting_bid)) / parseFloat(product.price)) * 100),
                        isHot: auction.status === 'active',
                        timer: auction.end_date ? calculateTimeRemaining(auction.end_date) : '00:00:00',
                        remainingSeconds: auction.end_date ? Math.max(0, Math.floor((new Date(auction.end_date) - nowDate) / 1000)) : 0,
                        bids: auction.bids_count || '0',
                        url: `/produto/${product.id}`,
                        image: product.image_url
                            ? (product.image_url.startsWith('http')
                                ? product.image_url
                                : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${product.image_url}`)
                            : `${process.env.REACT_APP_API_URL?.replace('/', '') || ''}/uploads/padrao.jpg`,
                        description: product.description || '',
                        visits: product.visits || '0',
                        type: product.categoryModel?.name || product.category || 'Geral',
                        location: 'Online',
                        vibeDate: auction.start_date ? new Date(auction.start_date).toLocaleDateString('pt-BR') : '',
                        initialPrice: `R$ ${parseFloat(auction.starting_bid).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        bidHistory: []
                    }))
                );

                setAuctions(products);

                // Preencher seções: Em Destaque (mais disputados), Ofertas Quentes (maior desconto), Encerrando em Breve (menor tempo restante)
                const productsWithBids = products.map(p => ({...p, bidsCount: parseInt(p.bids, 10) || 0}));

                const featuredList = [...productsWithBids].sort((a,b) => b.bidsCount - a.bidsCount).slice(0, 4);
                const hotList = [...productsWithBids].sort((a,b) => (b.discount || 0) - (a.discount || 0)).slice(0, 4);
                const endingList = [...productsWithBids].filter(p => p.remainingSeconds > 0).sort((a,b) => a.remainingSeconds - b.remainingSeconds).slice(0, 4);

                setFeatured(featuredList);
                setHotOffers(hotList);
                setEndingSoon(endingList);
            }
        } catch (error) {
            console.error('Erro ao carregar leilões:', error);
            setError('Erro ao carregar produtos. Tente novamente mais tarde.');
            setAuctions([]);
        } finally {
            setLoading(false);
        }
    }, []); // Dependências vazias, pois calculateTimeRemaining agora é externa

    useEffect(() => {
        loadCategories();
        const timeoutId = setTimeout(() => {
            loadAuctionsMemo(selectedCategory, searchTerm);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [loadAuctionsMemo, selectedCategory, searchTerm]);

    // Effect para aplicar filtros quando há query params
    useEffect(() => {
        if (filter && auctions.length > 0) {
            let filtered = [];
            const productsWithBids = auctions.map(p => ({...p, bidsCount: parseInt(p.bids, 10) || 0}));

            switch(filter) {
                case 'featured':
                    filtered = [...productsWithBids].sort((a,b) => b.bidsCount - a.bidsCount);
                    break;
                case 'hot':
                    filtered = [...productsWithBids].sort((a,b) => (b.discount || 0) - (a.discount || 0));
                    break;
                case 'ending':
                    filtered = [...productsWithBids].filter(p => p.remainingSeconds > 0).sort((a,b) => a.remainingSeconds - b.remainingSeconds);
                    break;
                default:
                    filtered = auctions;
            }

            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [filter, auctions]);

    // Quando houver um filtro via query string, rola a página até o início da visualização dos resultados.
    useEffect(() => {
        if (!filter) return;

        // Aguarda a renderização dos produtos filtrados e então realiza o scroll.
        const id = setTimeout(() => {
            const el = resultsRef.current;
            if (!el) return;

            // Compensa a altura do cabeçalho sticky
            const header = document.querySelector('.site-header');
            const headerHeight = header ? header.getBoundingClientRect().height : 0;
            const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8; // pequeno espaçamento

            window.scrollTo({ top, behavior: 'smooth' });
        }, 80);

        return () => clearTimeout(id);
    }, [filter, filteredProducts]);

    const handleSelectCategory = (categoryId) => {
        setLoading(true); // [MODIFICAÇÃO]: Define loading imediatamente ao clicar
        setSelectedCategory(categoryId);


    };

    // [MODIFICAÇÃO]: Removido o bloco de retorno antecipado "if (loading && ...)" para que o Hero seja sempre exibido
    // e o loading seja tratado dentro da tag <main> abaixo.

    if (error) {
        return (
            <>
                <Hero
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                    onSearch={onSearch} // Adicionado onSearch que estava faltando no bloco de erro original
                />
                <main>
                    <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <p style={{ color: '#E55F52', marginBottom: '1rem' }}>{error}</p>
                        <button onClick={() => loadAuctionsMemo(selectedCategory, searchTerm)} style={{ padding: '0.75rem 1.5rem', background: '#4A9FD8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            {getText('text_try_again', 'Tentar Novamente')}
                        </button>
                    </div>
                </main>
                <WhyChooseUs />
            </>
        );
    }

    return (
        <>
            <Hero
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onSearch={onSearch}
            />
            <main>
                {loading ? ( // [MODIFICAÇÃO]: Verifica loading aqui para exibir o spinner durante qualquer carregamento
                    <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto', border: '4px solid rgba(255, 255, 255, 0.1)', borderTopColor: '#4A9FD8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ marginTop: '1rem', color: '#8da4bf' }}>{getText('text_loading', 'Carregando...')}</p>
                    </div>
                ) : filter && filteredProducts.length > 0 ? (
                    <div ref={resultsRef} className="container" style={{ padding: '2rem' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <Link to="/" style={{ color: '#4A9FD8', textDecoration: 'none', fontSize: '0.9rem' }}>
                                ← Voltar
                            </Link>
                            <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '2rem', color: '#fff' }}>
                                {filter === 'featured' && getText('text_section_destaques_title', 'Em Destaque')}
                                {filter === 'hot' && getText('text_section_quentes_title', 'Ofertas Quentes')}
                                {filter === 'ending' && getText('text_section_encerrando_title', 'Encerrando em Breve')}
                            </h1>
                            <p style={{ color: '#8da4bf' }}>
                                {filter === 'featured' && getText('text_section_destaques_subtitle', 'Os leilões mais disputados')}
                                {filter === 'hot' && getText('text_section_quentes_subtitle', 'Preços irresistíveis')}
                                {filter === 'ending' && getText('text_section_encerrando_subtitle', 'Última chance!')}
                            </p>
                            <p style={{ color: '#8da4bf', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {filteredProducts.map((product, index) => (
                                <AuctionCard key={index} product={product} />
                            ))}
                        </div>
                    </div>
                ) : filter && filteredProducts.length === 0 ? (
                    <div ref={resultsRef} className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <Link to="/" style={{ color: '#4A9FD8', textDecoration: 'none', fontSize: '0.9rem' }}>
                            ← Voltar
                        </Link>
                        <p style={{ color: '#8da4bf', fontSize: '1.1rem', marginTop: '2rem' }}>
                            Nenhum produto encontrado nesta categoria.
                        </p>
                    </div>
                ) : (
                    <>
                        <ProductSection
                            title={getText('text_section_destaques_title', 'Em Destaque')}
                            subtitle={getText('text_section_destaques_subtitle', 'Os leilões mais disputados')}
                            icon={getText('icon_section_destaques', '⭐')}
                            products={featured}
                            viewAllLink="/?filter=featured"
                        />

                        <ProductSection
                            title={getText('text_section_quentes_title', 'Ofertas Quentes')}
                            subtitle={getText('text_section_quentes_subtitle', 'Preços irresistíveis')}
                            icon={getText('icon_section_quentes', '🔥')}
                            products={hotOffers}
                            viewAllLink="/?filter=hot"
                        />

                        <ProductSection
                            title={getText('text_section_encerrando_title', 'Encerrando em Breve')}
                            subtitle={getText('text_section_encerrando_subtitle', 'Última chance!')}
                            icon={getText('icon_section_encerrando', '⏰')}
                            products={endingSoon}
                            viewAllLink="/?filter=ending"
                        />

                        {auctions.length === 0 && (
                            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                <p style={{ color: '#8da4bf', fontSize: '1.1rem' }}>
                                    Nenhum leilão ativo no momento.
                                </p>
                                <p style={{ color: '#8da4bf', marginTop: '0.5rem' }}>
                                    Volte em breve para ver novos produtos!
                                </p>
                            </div>
                        )}

                        <section className="cta-section">
                            <div className="container">
                                <h2>{getText('text_cta_title', 'Comece a ganhar Cashback agora!')}</h2>
                                <p>{getText('text_cta_subtitle', 'Cadastre-se gratuitamente e participe dos melhores leilões online do Brasil.')}</p>
                                <div className="cta-buttons">
                                    <Link to="/cadastro" className="btn-cta-primary">{getText('text_header_cadastro', 'Criar Conta Grátis')}</Link>
                                    <Link to="/como-funciona" className="btn-cta-secondary">{getText('text_header_como_funciona', 'Como Funciona')}</Link>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
            <WhyChooseUs />
        </>
    );
};

export default HomePage;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Hero from './Hero';
import PegueAVisao from './PegueAVisao';
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
    const { t, i18n } = useTranslation();
    const { getText } = useTheme();
    const [searchParams] = useSearchParams();
    const location = useLocation();
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

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        const loadAuctions = async () => {
            try {
                setLoading(true);
                setError(null);

                let url = '/auctions/public?status=active&per_page=20';
                if (selectedCategory) {
                    url += `&category_id=${selectedCategory}`;
                }
                if (searchTerm) {
                    url += `&search=${searchTerm}`;
                }

                const response = await api.get(url, {
                    headers: { 'Accept': 'application/json' }
                });

                if (response.data.success) {
                    const auctionsData = response.data.data.data || response.data.data || [];
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
                            url: `/produto/${product.slug || product.id}`,
                            image: product.image_url
                                ? (product.image_url.startsWith('http')
                                    ? product.image_url
                                    : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${product.image_url}`)
                                : `${process.env.REACT_APP_API_URL?.replace('/', '') || ''}/uploads/padrao.jpg`,
                            category_id: product.category_id
                        }))
                    );
                    
                    const finalProducts = selectedCategory 
                        ? products.filter(p => String(p.category_id) === String(selectedCategory))
                        : products;

                    setAuctions(finalProducts);

                    if (!selectedCategory && !searchTerm) {
                        const productsWithBids = finalProducts.map(p => ({...p, bidsCount: parseInt(p.bids, 10) || 0}));
                        const featuredList = [...productsWithBids].sort((a,b) => b.bidsCount - a.bidsCount).slice(0, 4);
                        const hotList = [...productsWithBids].sort((a,b) => (b.discount || 0) - (a.discount || 0)).slice(0, 4);
                        const endingList = [...productsWithBids].filter(p => p.remainingSeconds > 0).sort((a,b) => a.remainingSeconds - b.remainingSeconds).slice(0, 4);

                        setFeatured(featuredList);
                        setHotOffers(hotList);
                        setEndingSoon(endingList);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar leilões:', error);
                setError('Erro ao carregar produtos. Tente novamente mais tarde.');
                setAuctions([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(loadAuctions, 300);
        return () => clearTimeout(timeoutId);
    }, [selectedCategory, searchTerm]);

    useEffect(() => {
        // Se a localização mudar para a raiz (sem query params), reseta os filtros.
        // O uso do state.reset (via Header/Footer) garante que o reset ocorra mesmo já estando na Home.
        if (location.pathname === '/' && !location.search) {
            setSelectedCategory(null);
            if (onSearch && searchTerm) onSearch('');
        }
    }, [location, onSearch, searchTerm]);

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

    useEffect(() => {
        if (!filter) return;
        const id = setTimeout(() => {
            const el = resultsRef.current;
            if (!el) return;
            const header = document.querySelector('.site-header');
            const headerHeight = header ? header.getBoundingClientRect().height : 0;
            const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
            window.scrollTo({ top, behavior: 'smooth' });
        }, 80);
        return () => clearTimeout(id);
    }, [filter, filteredProducts]);

    const handleSelectCategory = (categoryId) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(categoryId);
        }
    };

    if (error) {
        return (
            <>
                <Hero
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                    onSearch={onSearch}
                />
                <PegueAVisao />
                <main>
                    <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <p style={{ color: '#E55F52', marginBottom: '1rem' }}>{error}</p>
                        <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 1.5rem', background: '#4A9FD8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            {t('common.try_again', 'Tentar Novamente')}
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
            <PegueAVisao />
            <main>
                {loading ? (
                    <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto', border: '4px solid rgba(255, 255, 255, 0.1)', borderTopColor: '#4A9FD8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ marginTop: '1rem', color: '#8da4bf' }}>{t('common.loading', 'Carregando...')}</p>
                    </div>
                ) : filter && filteredProducts.length > 0 ? (
                    <div ref={resultsRef} className="container" style={{ padding: '2rem' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <Link to="/" style={{ color: '#4A9FD8', textDecoration: 'none', fontSize: '0.9rem' }}>
                                ← {t('common.back', 'Voltar')}
                            </Link>
                            <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '2rem', color: '#fff' }}>
                                {filter === 'featured' && t('home.featured_title')}
                                {filter === 'hot' && t('home.hot_title')}
                                {filter === 'ending' && t('home.ending_title')}
                            </h1>
                            <p style={{ color: '#8da4bf' }}>
                                {filter === 'featured' && t('home.featured_subtitle')}
                                {filter === 'hot' && t('home.hot_subtitle')}
                                {filter === 'ending' && t('home.ending_subtitle')}
                            </p>
                            <p style={{ color: '#8da4bf', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                {filteredProducts.length} {t('home.products_found', 'produto(s) encontrado(s)')}
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
                ) : (
                    <>
                        {selectedCategory || searchTerm ? (
                            <div className="container" style={{ padding: '2rem' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <h1 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontSize: '2rem', color: '#fff' }}>
                                        {searchTerm ? (
                                            <>{t('home.results_for', 'Resultados para')} "{searchTerm}"</>
                                        ) : (
                                            (() => {
                                                const cat = categories.find(c => String(c.id) === String(selectedCategory));
                                                if (!cat) return 'Categoria';
                                                const lang = i18n.language;
                                                if (lang === 'en' && cat.name_en) return cat.name_en;
                                                if (lang === 'es' && cat.name_es) return cat.name_es;
                                                return cat.name;
                                            })()
                                        )}
                                    </h1>
                                    <p style={{ color: '#8da4bf', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                        {auctions.length} {t('home.products_found', 'produto(s) encontrado(s)')}
                                    </p>
                                </div>
                                {auctions.length > 0 ? (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: '1.5rem'
                                    }}>
                                        {auctions.map((product, index) => (
                                            <AuctionCard key={index} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                        <p style={{ color: '#8da4bf', fontSize: '1.1rem' }}>
                                            {t('home.no_auctions_category', 'Nenhum leilão ativo encontrado para esta categoria.')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <ProductSection
                                    title={t('home.featured_title')}
                                    subtitle={t('home.featured_subtitle')}
                                    icon={getText('icon_section_destaques', '⭐')}
                                    products={featured}
                                    viewAllLink="/?filter=featured"
                                />

                                <ProductSection
                                    title={t('home.hot_title')}
                                    subtitle={t('home.hot_subtitle')}
                                    icon={getText('icon_section_quentes', '🔥')}
                                    products={hotOffers}
                                    viewAllLink="/?filter=hot"
                                />

                                <ProductSection
                                    title={t('home.ending_title')}
                                    subtitle={t('home.ending_subtitle')}
                                    icon={getText('icon_section_encerrando', '⏰')}
                                    products={endingSoon}
                                    viewAllLink="/?filter=ending"
                                />

                                {auctions.length === 0 && !loading && (
                                    <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                        <p style={{ color: '#8da4bf', fontSize: '1.1rem' }}>
                                            {t('home.no_auctions_now', 'Nenhum leilão ativo no momento.')}
                                        </p>
                                        <p style={{ color: '#8da4bf', marginTop: '0.5rem' }}>
                                            {t('home.come_back_soon', 'Volte em breve para ver novos produtos!')}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        <section className="cta-section">
                            <div className="container">
                                <h2>{t('home.cta_title')}</h2>
                                <p>{t('home.cta_subtitle')}</p>
                                <div className="cta-buttons">
                                    <Link to="/cadastro" className="btn-cta-primary">{t('header.register')}</Link>
                                    <Link to="/como-funciona" className="btn-cta-secondary">{t('header.how_it_works')}</Link>
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

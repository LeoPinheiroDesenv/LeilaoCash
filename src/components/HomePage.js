import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import Header from './Header';
import WhyChooseUs from './WhyChooseUs';
import ProductSection from './ProductSection';
import api from '../services/api';

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

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

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
            bids: auction.bids_count || '0',
            url: `/produto/${product.id}`,
            image: product.image_url 
              ? (product.image_url.startsWith('http') 
                  ? product.image_url 
                  : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}${product.image_url}`)
              : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000'}/uploads/padrao.jpg`,
            description: product.description || '',
            visits: product.visits || '0',
            type: product.categoryModel?.name || product.category || 'Geral',
            location: 'Online',
            vibeDate: auction.start_date ? new Date(auction.start_date).toLocaleDateString('pt-BR') : '',
            initialPrice: `R$ ${parseFloat(auction.starting_bid).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            bidHistory: []
          }))
        );

        // Dividir produtos em grupos para as seções
        const total = products.length;
        const produtosDestaque = products.slice(0, Math.ceil(total * 0.4));
        const produtosQuentes = products.slice(Math.ceil(total * 0.4), Math.ceil(total * 0.7));
        const produtosEncerrando = products.slice(Math.ceil(total * 0.7));

        setAuctions({
          produtosDestaque,
          produtosQuentes,
          produtosEncerrando
        });
      }
    } catch (error) {
      console.error('Erro ao carregar leilões:', error);
      setError('Erro ao carregar produtos. Tente novamente mais tarde.');
      // Em caso de erro, usar arrays vazios
      setAuctions({
        produtosDestaque: [],
        produtosQuentes: [],
        produtosEncerrando: []
      });
    } finally {
      setLoading(false);
    }
  }, []); // Dependências vazias, pois calculateTimeRemaining agora é externa

  useEffect(() => {
    loadCategories();
    // Adicionando um debounce simples para evitar muitas requisições durante a digitação
    const timeoutId = setTimeout(() => {
        loadAuctionsMemo(selectedCategory, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [loadAuctionsMemo, selectedCategory, searchTerm]);

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading && !categories.length && !auctions.produtosDestaque) {
    return (
      <>
        <Header searchTerm={searchTerm} onSearch={handleSearch} />
        <Hero 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleSelectCategory}
        />
        <main>
          <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div className="spinner" style={{ width: '48px', height: '48px', margin: '0 auto', border: '4px solid rgba(255, 255, 255, 0.1)', borderTopColor: '#4A9FD8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1rem', color: '#8da4bf' }}>Carregando produtos...</p>
          </div>
        </main>
        <WhyChooseUs />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header searchTerm={searchTerm} onSearch={handleSearch} />
        <Hero 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleSelectCategory}
        />
        <main>
          <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <p style={{ color: '#E55F52', marginBottom: '1rem' }}>{error}</p>
            <button onClick={() => loadAuctionsMemo(selectedCategory, searchTerm)} style={{ padding: '0.75rem 1.5rem', background: '#4A9FD8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Tentar Novamente
            </button>
          </div>
        </main>
        <WhyChooseUs />
      </>
    );
  }

  return (
    <>
      <Header searchTerm={searchTerm} onSearch={handleSearch} />
      <Hero 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleSelectCategory}
      />
      <main>
        {auctions.produtosDestaque && auctions.produtosDestaque.length > 0 && (
          <ProductSection 
            title="Em Destaque" 
            subtitle="Os leilões mais disputados"
            icon="⭐"
            products={auctions.produtosDestaque}
          />
        )}
        {auctions.produtosQuentes && auctions.produtosQuentes.length > 0 && (
          <ProductSection 
            title="Ofertas Quentes" 
            subtitle="Preços irresistíveis"
            icon="🔥"
            products={auctions.produtosQuentes}
          />
        )}
        {auctions.produtosEncerrando && auctions.produtosEncerrando.length > 0 && (
          <ProductSection 
            title="Encerrando em Breve" 
            subtitle="Última chance!"
            icon="⏰"
            products={auctions.produtosEncerrando}
          />
        )}
        
        {(!auctions.produtosDestaque || auctions.produtosDestaque.length === 0) && 
         (!auctions.produtosQuentes || auctions.produtosQuentes.length === 0) && 
         (!auctions.produtosEncerrando || auctions.produtosEncerrando.length === 0) && (
          <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <p style={{ color: '#8da4bf', fontSize: '1.1rem' }}>Nenhum leilão ativo no momento.</p>
            <p style={{ color: '#8da4bf', marginTop: '0.5rem' }}>Volte em breve para ver novos produtos!</p>
          </div>
        )}
        
        <section className="cta-section">
          <div className="container">
            <h2>Comece a ganhar Cashback agora!</h2>
            <p>Cadastre-se gratuitamente e participe dos melhores leilões online do Brasil.</p>
            <div className="cta-buttons">
              <Link to="/cadastro" className="btn-cta-primary">Criar Conta Grátis</Link>
              <Link to="/como-funciona" className="btn-cta-secondary">Como Funciona</Link>
            </div>
          </div>
        </section>
      </main>
      <WhyChooseUs />
    </>
  );
};

export default HomePage;

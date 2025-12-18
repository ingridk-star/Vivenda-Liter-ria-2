
import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Layout from './components/Layout';
import BrandLogo from './components/BrandLogo';
import { api } from './services/api';
import { getBookInfoFromCover, getBookRecommendation } from './services/geminiService';
import { AppTab, Review, User } from './types';
import { 
  Camera, BookOpen, Star, Trash2, Edit3, Hash, Heart, 
  PlusCircle, Sparkles, Loader2, Mail, Lock, UserCircle, 
  ArrowRight, LogOut 
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('library');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [feed, setFeed] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<string>('');

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [newContent, setNewContent] = useState('');
  const [newCover, setNewCover] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('vl-current-user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    loadData();
  }, [activeTab, currentUser]);

  const loadData = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    if (activeTab === 'library') {
      const data = await api.getMyReviews();
      setReviews(data);
      if (data.length > 0 && !recommendation) {
        const rec = await getBookRecommendation(data.slice(0, 3).map(r => r.title));
        setRecommendation(rec);
      }
    } else if (activeTab === 'feed') {
      const data = await api.getGlobalFeed();
      setFeed(data);
    }
    setIsLoading(false);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      const newUser: User = {
        id: Date.now().toString(),
        name: authName,
        email: authEmail,
      };
      localStorage.setItem('vl-current-user', JSON.stringify(newUser));
      setCurrentUser(newUser);
    } else {
      // Basic login simulation
      const existingUser: User = {
        id: 'user-1',
        name: authEmail.split('@')[0].charAt(0).toUpperCase() + authEmail.split('@')[0].slice(1),
        email: authEmail,
      };
      localStorage.setItem('vl-current-user', JSON.stringify(existingUser));
      setCurrentUser(existingUser);
    }
  };

  const handleLogout = () => {
    if (confirm("Deseja sair da sua conta?")) {
      localStorage.removeItem('vl-current-user');
      setCurrentUser(null);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setActiveTab('library');
    }
  };

  const handleAddReview = async () => {
    setIsProcessing(true);
    const review: Review = {
      id: Date.now().toString(),
      title: newTitle || 'Sem Título',
      author: newAuthor || 'Anônimo',
      rating: newRating,
      content: newContent,
      coverUrl: newCover || `https://picsum.photos/seed/${Math.random()}/300/450`,
      date: new Date().toLocaleDateString('pt-BR'),
      likes: 0,
      genre: 'Literatura'
    };
    await api.saveReview(review);
    
    // Reset form
    setNewTitle(''); setNewAuthor(''); setNewRating(0); setNewContent(''); setNewCover(null);
    setIsProcessing(false);
    setActiveTab('library');
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setNewCover(base64);
        setIsProcessing(true);
        try {
          const info = await getBookInfoFromCover(base64);
          if (info && info.includes('|')) {
            const [t, a] = info.split('|').map(s => s.trim());
            setNewTitle(t); setNewAuthor(a);
          }
        } catch (err) { console.error(err); }
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm("Deseja remover da sua estante?")) {
      await api.deleteReview(id);
      loadData();
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-[#f8f5f2] flex flex-col p-8 animate-in fade-in duration-700">
        <div className="flex-grow flex flex-col items-center justify-center space-y-8">
          <div className="animate-bounce-slow">
            <BrandLogo size={120} />
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-stone-800 italic mb-2">Vivenda Literária</h1>
            <p className="text-stone-500 font-medium tracking-tight">Abra as portas da sua próxima leitura.</p>
          </div>

          <form onSubmit={handleAuth} className="w-full space-y-4 animate-in slide-in-from-bottom-8 duration-500 bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm">
            {authMode === 'register' && (
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-white border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all shadow-sm"
                />
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
              </div>
            )}
            <div className="relative">
              <input 
                type="email" 
                required
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="E-mail"
                className="w-full bg-white border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all shadow-sm"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
            </div>
            <div className="relative">
              <input 
                type="password" 
                required
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="Senha"
                className="w-full bg-white border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all shadow-sm"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
            </div>

            <button 
              type="submit"
              className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
              <ArrowRight size={18} />
            </button>
          </form>

          <button 
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-stone-500 text-sm font-medium hover:text-stone-800 transition-colors"
          >
            {authMode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </div>
        
        <footer className="py-4 text-center">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Vivenda Literária © 2024</p>
        </footer>
        <SpeedInsights />
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'library' && (
        <div className="p-6">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-stone-800 mb-1">Sua Estante</h2>
              <p className="text-stone-500 text-sm">Olá, {currentUser.name.split(' ')[0]}!</p>
            </div>
          </header>

          {recommendation && (
            <div className="mb-8 p-4 bg-stone-800 rounded-2xl text-white shadow-lg animate-in fade-in zoom-in duration-500">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Sugestão da Vivenda</span>
              </div>
              <p className="text-sm font-serif italic">{recommendation}</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 animate-pulse">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-[2/3] bg-stone-200 rounded-xl"></div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <BookOpen size={48} className="text-stone-200 mb-4" />
              <p className="text-stone-400 italic">Sua estante está vazia.</p>
              <button onClick={() => setActiveTab('add')} className="mt-4 text-stone-800 font-bold text-sm underline">Começar Leitura</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {reviews.map(review => (
                <div key={review.id} className="group relative">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md border border-stone-200">
                    <img src={review.coverUrl} className="w-full h-full object-cover" alt={review.title} />
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur shadow rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="mt-2 px-1">
                    <h3 className="font-bold text-xs text-stone-800 truncate">{review.title}</h3>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={8} fill={i < review.rating ? "#f59e0b" : "none"} className={i < review.rating ? "text-amber-500" : "text-stone-300"} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="p-6 space-y-8">
          <header>
            <h2 className="text-3xl font-bold text-stone-800 mb-1">Comunidade</h2>
            <p className="text-stone-500 text-sm">O que os moradores estão lendo.</p>
          </header>

          {isLoading ? (
            <div className="space-y-6">
               {[1,2].map(i => <div key={i} className="h-64 bg-stone-200 rounded-3xl animate-pulse"></div>)}
            </div>
          ) : (
            <div className="space-y-8">
              {feed.map(item => (
                <article key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100 flex gap-4 animate-in slide-in-from-bottom-4">
                  <div className="w-24 aspect-[2/3] shrink-0 rounded-xl overflow-hidden shadow-lg">
                    <img src={item.coverUrl} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-stone-800 leading-tight mb-1">{item.title}</h3>
                      <p className="text-[10px] text-stone-400 uppercase font-bold mb-2">{item.author}</p>
                      <p className="text-sm text-stone-600 line-clamp-3 italic">"{item.content}"</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="flex items-center gap-1 text-stone-400 text-xs">
                        <Heart size={14} className={item.likes > 50 ? "text-red-400 fill-red-400" : ""} />
                        {item.likes}
                      </button>
                      <span className="text-[10px] text-stone-300">{item.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Nova Entrada</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <label className="relative cursor-pointer group">
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                <div className={`w-32 h-48 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all ${newCover ? 'border-transparent' : 'border-stone-300 hover:border-stone-500'}`}>
                  {isProcessing ? (
                    <Loader2 className="animate-spin text-stone-400" />
                  ) : newCover ? (
                    <img src={newCover} className="w-full h-full object-cover rounded-2xl shadow-xl" />
                  ) : (
                    <>
                      <Camera className="text-stone-400 mb-2" size={32} />
                      <span className="text-[10px] text-stone-400 font-bold">CAPA</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <input 
                type="text" placeholder="Título" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm"
              />
              <input 
                type="text" placeholder="Autor" value={newAuthor} onChange={e => setNewAuthor(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm"
              />
              <div className="flex gap-2 justify-center py-2 bg-white rounded-xl border border-stone-100">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setNewRating(s)}>
                    <Star size={24} fill={s <= newRating ? "#f59e0b" : "none"} className={s <= newRating ? "text-amber-500" : "text-stone-200"} />
                  </button>
                ))}
              </div>
              <textarea 
                rows={4} placeholder="O que achou da leitura?" value={newContent} onChange={e => setNewContent(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm resize-none"
              />
            </div>

            <button 
              onClick={handleAddReview}
              disabled={isProcessing}
              className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} />}
              Salvar na Vivenda
            </button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-6">
          <div className="flex flex-col items-center mb-10">
            <BrandLogo size={80} className="mb-4" />
            <h2 className="text-2xl font-bold text-stone-800">{currentUser.name}</h2>
            <p className="text-stone-400 text-xs uppercase tracking-tighter">{currentUser.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 text-center">
              <span className="block text-2xl font-bold text-stone-800">{reviews.length}</span>
              <span className="text-[10px] text-stone-400 uppercase font-bold">Livros Lidos</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 text-center">
              <span className="block text-2xl font-bold text-stone-800">12/24</span>
              <span className="text-[10px] text-stone-400 uppercase font-bold">Meta Anual</span>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-sm font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition-all shadow-sm"
            >
              <LogOut size={18} className="text-red-500" />
              Sair da Conta
            </button>
            
            <button 
              onClick={async () => {
                if(confirm("Deseja apagar os dados locais (resenhas)?")) {
                  localStorage.removeItem('vl_database_v1');
                  loadData();
                }
              }}
              className="w-full p-4 rounded-2xl text-xs font-bold text-stone-400 hover:text-red-500 transition-all"
            >
              Limpar Dados da Estante
            </button>
          </div>
        </div>
      )}
      <SpeedInsights />
    </Layout>
  );
};

export default App;

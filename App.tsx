
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import BrandLogo from './components/BrandLogo';
import { AppTab, Review, SocialActivity, UserProfile, User } from './types';
import { Camera, Search, BookOpen, Star, Trash2, Edit3, Hash, Heart, MessageCircle, UserPlus, UserCheck, Users, LogIn, UserCircle, Mail, Lock, ArrowRight, LogOut } from 'lucide-react';
import { getBookInfoFromCover } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('library');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // State for the new review form
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [newContent, setNewContent] = useState('');
  const [newCover, setNewCover] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('vl-current-user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    // Load reviews
    const savedReviews = localStorage.getItem('vl-reviews');
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  const saveReviews = (updated: Review[]) => {
    setReviews(updated);
    localStorage.setItem('vl-reviews', JSON.stringify(updated));
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
      const existingUser: User = {
        id: 'user-1',
        name: authEmail.split('@')[0],
        email: authEmail,
      };
      localStorage.setItem('vl-current-user', JSON.stringify(existingUser));
      setCurrentUser(existingUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vl-current-user');
    setCurrentUser(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setActiveTab('library');
  };

  const toggleFollow = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u));
  };

  const handleAddReview = () => {
    const review: Review = {
      id: Date.now().toString(),
      title: newTitle || 'Sem Título',
      author: newAuthor || 'Autor Desconhecido',
      isbn: newIsbn,
      rating: newRating,
      content: newContent,
      coverUrl: newCover || `https://picsum.photos/seed/${Math.random()}/300/450`,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    saveReviews([review, ...reviews]);
    setNewTitle('');
    setNewAuthor('');
    setNewIsbn('');
    setNewRating(0);
    setNewContent('');
    setNewCover(null);
    setActiveTab('library');
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setNewCover(base64);
        try {
          const info = await getBookInfoFromCover(base64);
          if (info && info.includes('|')) {
            const [t, a] = info.split('|').map(s => s.trim());
            setNewTitle(t);
            setNewAuthor(a);
          }
        } catch (err) {
          console.error("Erro ao identificar livro", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteReview = (id: string) => {
    saveReviews(reviews.filter(r => r.id !== id));
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
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'library' && (
        <div className="p-6">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-stone-800 mb-2">Sua Estante</h2>
              <p className="text-stone-500 text-sm">Olá, {currentUser.name.split(' ')[0]}!</p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <BookOpen size={64} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="italic text-center">Nenhuma resenha por aqui ainda.<br/>Que tal começar agora?</p>
              <button 
                onClick={() => setActiveTab('add')}
                className="mt-6 px-6 py-2 bg-stone-800 text-white rounded-full text-sm font-medium"
              >
                Escrever Primeira Resenha
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {reviews.map(review => (
                <div key={review.id} className="group flex flex-col gap-2 relative">
                  <div className="aspect-[2/3] w-full rounded-xl overflow-hidden shadow-lg border border-stone-200 relative">
                    <img src={review.coverUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={review.title} />
                    <div className="absolute top-2 right-2 flex gap-1">
                       <button onClick={() => deleteReview(review.id)} className="p-1.5 bg-white/80 backdrop-blur-md rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="font-bold text-sm text-stone-800 line-clamp-1">{review.title}</h3>
                    <p className="text-xs text-stone-500 mb-1">{review.author}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-amber-500" : "text-stone-300"} />
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
        <div className="animate-in fade-in duration-500">
          <div className="p-6 pb-2 border-b border-stone-100">
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Sugestões Literárias</h3>
            <p className="text-[11px] text-stone-400 italic py-2">Procurando leitores próximos...</p>
          </div>

          <div className="p-6 space-y-8">
            <div className="py-20 text-center text-stone-400 px-10">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <h3 className="text-stone-800 font-bold mb-2">Feed de Lançamentos</h3>
              <p className="italic text-sm">O Vivenda Literária é melhor com amigos. Encontre outros leitores e compartilhe sua jornada!</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="p-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold text-stone-800 mb-6">Nova Resenha</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <label className="relative cursor-pointer group">
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                <div className={`w-32 h-48 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all ${newCover ? 'border-transparent' : 'border-stone-300 hover:border-stone-500'}`}>
                  {newCover ? (
                    <img src={newCover} className="w-full h-full object-cover rounded-2xl shadow-xl" />
                  ) : (
                    <>
                      <Camera className="text-stone-400 mb-2" size={32} />
                      <span className="text-[10px] text-stone-400 uppercase font-bold text-center px-4">Capa do Livro</span>
                    </>
                  )}
                </div>
                {newCover && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <Edit3 className="text-white" />
                  </div>
                )}
              </label>
              <p className="text-[10px] text-stone-400 mt-2 italic">Dica: AI identifica o livro pela foto!</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1 ml-1">Título</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Nome da obra..."
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1 ml-1">Autor</label>
                <input 
                  type="text" 
                  value={newAuthor} 
                  onChange={e => setNewAuthor(e.target.value)}
                  placeholder="Escritor(a)..."
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1 ml-1">ISBN</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={newIsbn} 
                    onChange={e => setNewIsbn(e.target.value)}
                    placeholder="978-..."
                    className="w-full bg-white border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all"
                  />
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1 ml-1">Nota</label>
                <div className="flex gap-2 bg-white border border-stone-200 rounded-xl px-4 py-3 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => setNewRating(star)}
                      className="transition-transform active:scale-125"
                    >
                      <Star 
                        size={28} 
                        fill={star <= newRating ? "#f59e0b" : "none"} 
                        className={star <= newRating ? "text-amber-500" : "text-stone-300"} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1 ml-1">Sua Experiência</label>
                <textarea 
                  rows={6}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Escreva seus sentimentos sobre a leitura..."
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all resize-none"
                />
              </div>
            </div>

            <button 
              onClick={handleAddReview}
              className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all"
            >
              Salvar Resenha
            </button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-6">
          <div className="flex flex-col items-center mb-10">
            <div className="mb-4">
              <BrandLogo size={100} />
            </div>
            <h2 className="text-2xl font-bold text-stone-800">{currentUser.name}</h2>
            <p className="text-stone-500 text-sm">{currentUser.email}</p>
          </div>

          <div className="space-y-4">
             <div className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center justify-between shadow-sm">
               <span className="text-sm font-medium text-stone-700">Total de Resenhas</span>
               <span className="text-sm font-bold text-stone-800">{reviews.length}</span>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center justify-between shadow-sm">
               <span className="text-sm font-medium text-stone-700">Meta de Leitura</span>
               <span className="text-sm font-bold text-stone-800">12 / 24</span>
             </div>
             
             <div className="mt-8 pt-8 border-t border-stone-200 space-y-2">
               <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
               >
                 <LogOut size={18} />
                 Sair da Conta
               </button>
               <button 
                onClick={() => {
                  if(confirm("Tem certeza que deseja apagar todas as suas resenhas?")) {
                    saveReviews([]);
                  }
                }}
                className="w-full text-left p-4 text-xs text-stone-400 hover:text-stone-600 transition-colors"
               >
                 Limpar todos os dados locais
               </button>
             </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;

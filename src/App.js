import React, { useState, useEffect, useCallback } from "react";
import data from "./data/articles.json";
import AdminPanel from './AdminPanel';

function Header({ currentPath, onBack, showBack }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={onBack}
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            ←
          </button>
        )}
        <h1 className="text-lg font-bold text-gray-800">FLISOVICHOK СЕРВИСЫ</h1>
      </div>
      {currentPath.length > 0 && (
        <div className="text-sm text-gray-500 mt-1">
          {currentPath.join(" › ")}
        </div>
      )}
    </header>
  );
}

function MainMenu({ categories, onSelectCategory, onOpenAdmin }) {
  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">FLISOVICHOK СЕРВИСЫ</h1>
        <p className="text-gray-600">Корпоративная база знаний</p>
      </div>
      
      <div className="grid gap-3">
        {Object.keys(categories).map(categoryKey => (
          <button
            key={categoryKey}
            onClick={() => onSelectCategory(categoryKey, categories[categoryKey])}
            className="w-full text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <h2 className="text-lg font-semibold text-gray-800">{categoryKey}</h2>
          </button>
        ))}
      </div>

      {/* Кнопка админки */}
      <button
        onClick={onOpenAdmin}
        className="fixed bottom-6 right-6 bg-green-500 text-white w-12 h-12 rounded-full shadow-lg hover:bg-green-600 transition-colors z-40 flex items-center justify-center"
        title="Добавить статью"
      >
        <span className="text-2xl">+</span>
      </button>
    </div>
  );
}

function Subcategories({ subcategories, onSelectSubcategory, onBack, categoryName }) {
  return (
    <div className="p-4">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700 font-medium"
      >
        ← Назад к разделам
      </button>
      
      <h2 className="text-xl font-bold text-gray-800 mb-4">{categoryName}</h2>
      
      <div className="grid gap-3">
        {Object.keys(subcategories).map(subKey => (
          <button
            key={subKey}
            onClick={() => onSelectSubcategory(subKey, subcategories[subKey])}
            className="w-full text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <h3 className="font-semibold text-gray-800 mb-1">{subKey}</h3>
            <p className="text-sm text-gray-600">
              {subcategories[subKey].length} статей
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Articles({ articles, onSelectArticle, onBack, subcategoryName }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="p-4">
        <button 
          onClick={onBack}
          className="mb-4 flex items-center text-blue-500 hover:text-blue-700 font-medium"
        >
          ← Назад
        </button>
        <div className="text-center py-8">
          <p className="text-gray-500">Статей в этом разделе пока нет.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700 font-medium"
      >
        ← Назад
      </button>
      
      <h2 className="text-xl font-bold text-gray-800 mb-4">{subcategoryName}</h2>
      
      <div className="grid gap-3">
        {articles.map(article => (
          <button
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="w-full text-left p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <h3 className="font-semibold text-gray-800 mb-1">{article.title}</h3>
          </button>
        ))}
      </div>
    </div>
  );
}

function ArticleView({ article, onBack }) {
  if (!article) return null;

  return (
    <div className="p-4">
      <button 
        onClick={onBack}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700 font-medium"
      >
        ← Назад
      </button>
      
      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
          <h1 className="text-xl font-bold text-white">{article.title}</h1>
        </div>
        
        <div className="p-4">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm">
              {article.content}
            </pre>
          </div>
        </div>
      </article>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('main');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [path, setPath] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);

  // Используем useCallback чтобы избежать предупреждения
  const handleBack = useCallback(() => {
    switch (currentView) {
      case 'article':
        setCurrentView('articles');
        setPath(path.slice(0, -1));
        break;
      case 'articles':
        setCurrentView('subcategories');
        setPath(path.slice(0, -1));
        break;
      case 'subcategories':
        setCurrentView('main');
        setPath([]);
        break;
      default:
        setCurrentView('main');
        setPath([]);
    }
  }, [currentView, path]);

  const handleSelectCategory = (categoryKey, category) => {
    setCurrentCategory({ key: categoryKey, data: category });
    setCurrentSubcategory(null);
    setCurrentArticle(null);
    setCurrentView('subcategories');
    setPath([categoryKey]);
  };

  const handleSelectSubcategory = (subKey, articles) => {
    setCurrentSubcategory({ key: subKey, data: articles });
    setCurrentArticle(null);
    setCurrentView('articles');
    setPath([currentCategory.key, subKey]);
  };

  const handleSelectArticle = (article) => {
    setCurrentArticle(article);
    setCurrentView('article');
  };

  const handleSaveArticle = (category, subcategory, newArticle) => {
    // Показываем статью сразу в интерфейсе
    setCurrentCategory({ key: category, data: data[category] });
    setCurrentSubcategory({ key: subcategory, data: [newArticle] });
    setCurrentArticle(newArticle);
    setCurrentView('article');
    setPath([category, subcategory, newArticle.title]);
    
    alert('Статья добавлена! Вы перейдете к ее просмотру.');
  };

  const showBackButton = currentView !== 'main';

  // Telegram Web App integration
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      
      if (currentView !== 'main') {
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
          handleBack();
        });
      } else {
        tg.BackButton.hide();
      }
    }
  }, [currentView, handleBack]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header 
        currentPath={path}
        onBack={handleBack}
        showBack={showBackButton}
      />
      
      <main className="max-w-2xl mx-auto pb-8">
        {currentView === 'main' && (
          <MainMenu 
            categories={data} 
            onSelectCategory={handleSelectCategory}
            onOpenAdmin={() => setShowAdmin(true)}
          />
        )}
        
        {currentView === 'subcategories' && currentCategory && (
          <Subcategories 
            subcategories={currentCategory.data.subcategories}
            onSelectSubcategory={handleSelectSubcategory}
            onBack={handleBack}
            categoryName={currentCategory.key}
          />
        )}
        
        {currentView === 'articles' && currentSubcategory && (
          <Articles 
            articles={currentSubcategory.data}
            onSelectArticle={handleSelectArticle}
            onBack={handleBack}
            subcategoryName={currentSubcategory.key}
          />
        )}
        
        {currentView === 'article' && currentArticle && (
          <ArticleView 
            article={currentArticle}
            onBack={handleBack}
          />
        )}
      </main>

      {/* Админ-панель */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          onSave={handleSaveArticle}
        />
      )}
    </div>
  );
}

export default App;

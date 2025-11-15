import React, { useState, useEffect } from 'react';
import data from './data/articles.json';

function AdminAuth({ onAuthSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Пароль для админа - можете поменять на свой
  const ADMIN_PASSWORD = '0051930Fl';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onAuthSuccess();
    } else {
      setError('Неверный пароль');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Авторизация</h2>
        <p className="text-gray-600 mb-4">Введите пароль для доступа к админ-панели</p>
        
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Введите пароль"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleLogin}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium"
          >
            Войти
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-medium"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ onClose, onSave }) {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [article, setArticle] = useState({
    title: '',
    description: '',
    content: ''
  });

  // Загружаем данные при открытии
  useEffect(() => {
    setCategories(data);
    // Выбираем первую категорию по умолчанию
    const firstCategory = Object.keys(data)[0];
    if (firstCategory) {
      setSelectedCategory(firstCategory);
    }
  }, []);

  // Получаем подкатегории выбранной категории
  const subcategories = selectedCategory ? 
    Object.keys(categories[selectedCategory]?.subcategories || {}) : [];

  const handleAddArticle = () => {
    if (!selectedCategory || !selectedSubcategory || !article.title || !article.content) {
      alert('Заполните все обязательные поля!');
      return;
    }

    // Создаем новую статью
    const newArticle = {
      id: Date.now(), // Простой ID на основе времени
      title: article.title,
      description: article.description,
      content: article.content
    };

    // Вызываем колбэк для сохранения
    onSave(selectedCategory, selectedSubcategory, newArticle);

    // Очищаем форму
    setArticle({
      title: '',
      description: '',
      content: ''
    });
    
    alert('Статья успешно добавлена!');
  };

  const handleAddSubcategory = () => {
    if (!selectedCategory || !newSubcategory) {
      alert('Выберите категорию и введите название подкатегории!');
      return;
    }

    // Добавляем новую подкатегорию
    const updatedCategories = { ...categories };
    if (!updatedCategories[selectedCategory].subcategories[newSubcategory]) {
      updatedCategories[selectedCategory].subcategories[newSubcategory] = [];
      setCategories(updatedCategories);
      setSelectedSubcategory(newSubcategory);
      setNewSubcategory('');
      alert('Подкатегория добавлена!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Добавить статью</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Выбор категории */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категория *
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Выберите категорию</option>
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Добавление новой подкатегории */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Новая подкатегория (опционально)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Введите название подкатегории"
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleAddSubcategory}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Добавить
              </button>
            </div>
          </div>

          {/* Выбор подкатегории */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подкатегория *
            </label>
            <select 
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Выберите подкатегорию</option>
              {subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Форма статьи */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок статьи *
              </label>
              <input
                type="text"
                value={article.title}
                onChange={(e) => setArticle({...article, title: e.target.value})}
                placeholder="Введите заголовок"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание (опционально)
              </label>
              <input
                type="text"
                value={article.description}
                onChange={(e) => setArticle({...article, description: e.target.value})}
                placeholder="Краткое описание"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Содержание статьи *
              </label>
              <textarea
                value={article.content}
                onChange={(e) => setArticle({...article, content: e.target.value})}
                placeholder="Введите содержание статьи. Можно использовать Markdown для форматирования."
                rows="8"
                className="w-full p-2 border border-gray-300 rounded-lg resize-vertical"
              />
              <p className="text-sm text-gray-500 mt-1">
                Поддерживается Markdown: **жирный**, *курсив*, ## заголовки, - списки
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddArticle}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium"
            >
              Добавить статью
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-medium"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Главный компонент админки с авторизацией
function AdminPanelWithAuth({ onClose, onSave }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return <AdminPanel onClose={onClose} onSave={onSave} />;
}

export default AdminPanelWithAuth;
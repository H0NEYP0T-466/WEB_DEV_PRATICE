import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TodoList.css';

function TodoList() {
  const navigate = useNavigate();
  const [todoCards, setTodoCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCard, setEditingCard] = useState(null);
  const [editingSubTodo, setEditingSubTodo] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newSubTodoText, setNewSubTodoText] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Fetch all todos on component mount
  useEffect(() => {
    // Add some mock data for testing when backend is not available
    const mockData = [
      {
        _id: 'mock1',
        title: 'Sample Todo Card',
        subTodos: [
          { _id: 'sub1', text: 'Complete the design', completed: false, pinned: true },
          { _id: 'sub2', text: 'Test the functionality', completed: true, pinned: false },
          { _id: 'sub3', text: 'Write documentation', completed: false, pinned: false },
          { _id: 'sub4', text: 'Review with team', completed: false, pinned: false },
          { _id: 'sub5', text: 'Deploy to staging', completed: false, pinned: false },
          { _id: 'sub6', text: 'Final testing', completed: false, pinned: false }
        ]
      },
      {
        _id: 'mock2', 
        title: 'Another Todo Card',
        subTodos: [
          { _id: 'sub7', text: 'Review the code', completed: false, pinned: false },
          { _id: 'sub8', text: 'Deploy to production', completed: false, pinned: true }
        ]
      }
    ];
    
    // Try to fetch from backend first, if it fails use mock data
    fetchTodos().catch(() => {
      setTodoCards(mockData);
      setLoading(false);
    });
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/todos');
      if (response.data.success) {
        setTodoCards(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Using mock data - backend not available');
      // Don't throw error here so mock data can be used
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createNewCard = async () => {
    // Create an empty card for inline editing
    const newCard = {
      _id: 'temp-' + Date.now(),
      title: '',
      subTodos: [],
      isEditing: true
    };
    setTodoCards(prev => [newCard, ...prev]);
    setEditingCard(newCard._id);
    setNewCardTitle('');
  };

  const saveNewCard = async (tempId) => {
    if (!newCardTitle.trim()) {
      // Remove the empty card if no title
      setTodoCards(prev => prev.filter(card => card._id !== tempId));
      setEditingCard(null);
      setNewCardTitle('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/todos', {
        title: newCardTitle.trim()
      });
      if (response.data.success) {
        setTodoCards(prev => prev.map(card => 
          card._id === tempId ? response.data.data : card
        ));
        setEditingCard(null);
        setNewCardTitle('');
      }
    } catch (error) {
      console.error('Error creating todo card:', error);
      setError('Failed to create todo card');
      // Remove the temporary card on error
      setTodoCards(prev => prev.filter(card => card._id !== tempId));
      setEditingCard(null);
      setNewCardTitle('');
    }
  };

  const deleteCard = async (cardId) => {
    // Handle temporary cards (those created locally but not saved to backend)
    if (cardId.startsWith('temp-')) {
      setTodoCards(prev => prev.filter(card => card._id !== cardId));
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/api/todos/${cardId}`);
      if (response.data.success) {
        setTodoCards(prev => prev.filter(card => card._id !== cardId));
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      setError('Failed to delete card');
    }
  };

  const addSubTodo = async (cardId) => {
    // Add empty sub-todo for inline editing
    const tempSubTodo = {
      _id: 'temp-subtodo-' + Date.now(),
      text: '',
      completed: false,
      isEditing: true
    };
    
    setTodoCards(prev => prev.map(card => 
      card._id === cardId 
        ? { ...card, subTodos: [...card.subTodos, tempSubTodo] }
        : card
    ));
    setEditingSubTodo(tempSubTodo._id);
    setNewSubTodoText('');
  };

  const saveNewSubTodo = async (cardId, tempSubTodoId) => {
    if (!newSubTodoText.trim()) {
      // Remove empty sub-todo
      setTodoCards(prev => prev.map(card => 
        card._id === cardId 
          ? { ...card, subTodos: card.subTodos.filter(st => st._id !== tempSubTodoId) }
          : card
      ));
      setEditingSubTodo(null);
      setNewSubTodoText('');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/api/todos/${cardId}/subtodos`, {
        text: newSubTodoText.trim()
      });
      if (response.data.success) {
        setTodoCards(prev => prev.map(card => 
          card._id === cardId ? response.data.data : card
        ));
        setEditingSubTodo(null);
        setNewSubTodoText('');
      }
    } catch (error) {
      console.error('Error adding sub-todo:', error);
      setError('Failed to add sub-todo');
      // Remove temp sub-todo on error
      setTodoCards(prev => prev.map(card => 
        card._id === cardId 
          ? { ...card, subTodos: card.subTodos.filter(st => st._id !== tempSubTodoId) }
          : card
      ));
      setEditingSubTodo(null);
      setNewSubTodoText('');
    }
  };

  const updateSubTodo = async (cardId, subTodoId, updates) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/todos/${cardId}/subtodos/${subTodoId}`, updates);
      if (response.data.success) {
        setTodoCards(prev => prev.map(card => 
          card._id === cardId ? response.data.data : card
        ));
      }
    } catch (error) {
      console.error('Error updating sub-todo:', error);
      setError('Failed to update sub-todo');
    }
  };

  const deleteSubTodo = async (cardId, subTodoId) => {
    // Handle temporary subtodos (those created locally but not saved to backend)
    if (subTodoId.startsWith('temp-')) {
      setTodoCards(prev => prev.map(card => 
        card._id === cardId 
          ? { ...card, subTodos: card.subTodos.filter(st => st._id !== subTodoId) }
          : card
      ));
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/api/todos/${cardId}/subtodos/${subTodoId}`);
      if (response.data.success) {
        setTodoCards(prev => prev.map(card => 
          card._id === cardId ? response.data.data : card
        ));
      }
    } catch (error) {
      console.error('Error deleting sub-todo:', error);
      setError('Failed to delete sub-todo');
    }
  };

  const handleSubTodoEdit = (cardId, subTodoId, currentText) => {
    setEditingSubTodo(subTodoId);
    setNewSubTodoText(currentText);
  };

  const saveSubTodoEdit = async (cardId, subTodoId) => {
    if (!newSubTodoText.trim()) {
      setEditingSubTodo(null);
      setNewSubTodoText('');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/todos/${cardId}/subtodos/${subTodoId}`, {
        text: newSubTodoText.trim()
      });
      if (response.data.success) {
        setTodoCards(prev => prev.map(card => 
          card._id === cardId ? response.data.data : card
        ));
        setEditingSubTodo(null);
        setNewSubTodoText('');
      }
    } catch (error) {
      console.error('Error updating sub-todo:', error);
      setError('Failed to update sub-todo');
    }
  };

  const cancelSubTodoEdit = () => {
    setEditingSubTodo(null);
    setNewSubTodoText('');
  };

  const toggleSubTodoComplete = (cardId, subTodoId, completed) => {
    updateSubTodo(cardId, subTodoId, { completed: !completed });
  };

  const toggleSubTodoPin = async (cardId, subTodoId, pinned) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/todos/${cardId}/subtodos/${subTodoId}`, {
        pinned: !pinned
      });
      if (response.data.success) {
        setTodoCards(prev => prev.map(card => 
          card._id === cardId ? response.data.data : card
        ));
      } else {
        // Fallback local update if API returns success: false
        setTodoCards(prev => prev.map(card => 
          card._id === cardId 
            ? {
                ...card,
                subTodos: card.subTodos.map(subTodo =>
                  subTodo._id === subTodoId
                    ? { ...subTodo, pinned: !pinned }
                    : subTodo
                )
              }
            : card
        ));
      }
    } catch {
      // For mock data or network errors, update locally
      setTodoCards(prev => prev.map(card => 
        card._id === cardId 
          ? {
              ...card,
              subTodos: card.subTodos.map(subTodo =>
                subTodo._id === subTodoId
                  ? { ...subTodo, pinned: !pinned }
                  : subTodo
              )
            }
          : card
      ));
    }
  };

  const toggleCardExpanded = (cardId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const getVisibleSubTodos = (card) => {
    const { subTodos } = card;
    const isExpanded = expandedCards.has(card._id);
    
    if (isExpanded) {
      // Show all todos when expanded
      return subTodos;
    } else {
      // Show only first 4 todos plus all pinned ones when collapsed
      const pinnedTodos = subTodos.filter(todo => todo.pinned);
      const unpinnedLimit = Math.max(0, 4 - pinnedTodos.length); // prevent negative slicing
      const unpinnedTodos = subTodos.filter(todo => !todo.pinned).slice(0, unpinnedLimit);
      return [...pinnedTodos, ...unpinnedTodos];
    }
  };

  const handleCardTitleEdit = (cardId, currentTitle) => {
    setEditingCard(cardId);
    setNewCardTitle(currentTitle);
  };

  const saveCardTitleEdit = async (cardId) => {
    if (!newCardTitle.trim()) {
      setEditingCard(null);
      setNewCardTitle('');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/todos/${cardId}`, {
        title: newCardTitle.trim()
      });
      if (response.data.success) {
        setTodoCards(prev => prev.map(card => 
          card._id === cardId ? response.data.data : card
        ));
        setEditingCard(null);
        setNewCardTitle('');
      }
    } catch (error) {
      console.error('Error updating card title:', error);
      setError('Failed to update card title');
    }
  };

  // Updated: Accept cardId to handle temp-cancel by removing the temp card
  const cancelCardTitleEdit = (cardId) => {
    if (cardId && cardId.startsWith('temp-')) {
      setTodoCards(prev => prev.filter(card => card._id !== cardId));
    }
    setEditingCard(null);
    setNewCardTitle('');
  };

  if (loading) {
    return (
      <div className="todo-container">
        <div className="loading">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <div className="todo-header">
        <div className="header-left">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
            title="Back to main page"
          >
            ←
          </button>
          <h1>To-Do List</h1>
        </div>
        <button 
          className="btn primary add-card-btn"
          onClick={createNewCard}
          title="Add new todo card"
        >
          <span className="plus-icon">+</span>
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="todo-cards-container">
        {todoCards.length === 0 ? (
          <div className="empty-state">
            <p>No todo cards yet. Click the + button to create your first one!</p>
          </div>
        ) : (
          todoCards.map(card => (
            <div key={card._id} className="todo-card">
              <div className="card-header">
                {editingCard === card._id ? (
                  <div className="title-edit-container">
                    <input
                      type="text"
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      placeholder="Enter the title"
                      className="title-input"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (card._id.startsWith('temp-')) {
                            saveNewCard(card._id);
                          } else {
                            saveCardTitleEdit(card._id);
                          }
                        }
                      }}
                      onBlur={() => {
                        // Auto-delete empty main todos when user clicks elsewhere
                        setTimeout(() => {
                          if (card._id.startsWith('temp-') && !newCardTitle.trim()) {
                            // Remove empty temp card
                            setTodoCards(prev => prev.filter(c => c._id !== card._id));
                            setEditingCard(null);
                            setNewCardTitle('');
                          } else if (newCardTitle.trim()) {
                            // Save non-empty cards
                            card._id.startsWith('temp-') 
                              ? saveNewCard(card._id)
                              : saveCardTitleEdit(card._id);
                          }
                        }, 100); // Small delay to allow button clicks to register
                      }}
                    />
                    <div className="edit-actions">
                      <button 
                        className="btn outline small"
                        onClick={() => card._id.startsWith('temp-') ? saveNewCard(card._id) : saveCardTitleEdit(card._id)}
                        title="Save title"
                      >
                        ✓
                      </button>
                      <button 
                        className="btn outline small"
                        onClick={() => cancelCardTitleEdit(card._id)}
                        title="Cancel edit"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 
                      className="card-title"
                      onClick={() => handleCardTitleEdit(card._id, card.title)}
                      title="Click to edit title"
                    >
                      {card.title}
                    </h2>
                    <div className="card-actions">
                      <button 
                        className="btn outline small"
                        onClick={() => addSubTodo(card._id)}
                        title="Add sub-todo"
                      >
                        <span className="plus-icon">+</span>
                      </button>
                      <button 
                        className="btn danger small"
                        onClick={() => deleteCard(card._id)}
                        title="Delete card"
                      >
                        ×
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="sub-todos-container">
                {card.subTodos.length === 0 ? (
                  <div className="empty-subtodos">
                    <p>No sub-todos yet. Click + to add one!</p>
                  </div>
                ) : (
                  <>
                    {getVisibleSubTodos(card).map(subTodo => (
                      <div key={subTodo._id} className={`sub-todo ${subTodo.completed ? 'completed' : ''} ${subTodo.pinned ? 'pinned' : ''}`}>
                        {editingSubTodo === subTodo._id ? (
                          <div className="subtodo-edit-container">
                            <input
                              type="text"
                              value={newSubTodoText}
                              onChange={(e) => setNewSubTodoText(e.target.value)}
                              placeholder="Enter the todo"
                              className="subtodo-input"
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  subTodo._id.startsWith('temp-') 
                                    ? saveNewSubTodo(card._id, subTodo._id)
                                    : saveSubTodoEdit(card._id, subTodo._id);
                                }
                              }}
                              onBlur={() => {
                                // Auto-delete empty todos when user clicks elsewhere
                                setTimeout(() => {
                                  if (subTodo._id.startsWith('temp-') && !newSubTodoText.trim()) {
                                    // Remove empty temp subtodo
                                    setTodoCards(prev => prev.map(card => 
                                      card._id === card._id 
                                        ? { ...card, subTodos: card.subTodos.filter(st => st._id !== subTodo._id) }
                                        : card
                                    ));
                                    setEditingSubTodo(null);
                                    setNewSubTodoText('');
                                  } else {
                                    // Save non-empty todos
                                    subTodo._id.startsWith('temp-') 
                                      ? saveNewSubTodo(card._id, subTodo._id)
                                      : saveSubTodoEdit(card._id, subTodo._id);
                                  }
                                }, 100); // Small delay to allow button clicks to register
                              }}
                            />
                            <div className="edit-actions">
                              <button 
                                className="btn outline small"
                                onClick={() => 
                                  subTodo._id.startsWith('temp-') 
                                    ? saveNewSubTodo(card._id, subTodo._id)
                                    : saveSubTodoEdit(card._id, subTodo._id)
                                }
                                title="Save todo"
                              >
                                ✓
                              </button>
                              <button 
                                className="btn outline small"
                                onClick={cancelSubTodoEdit}
                                title="Cancel edit"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="sub-todo-content">
                              <input
                                type="checkbox"
                                checked={subTodo.completed}
                                onChange={() => toggleSubTodoComplete(card._id, subTodo._id, subTodo.completed)}
                                className="sub-todo-checkbox"
                              />
                              <span 
                                className="sub-todo-text"
                                onClick={() => handleSubTodoEdit(card._id, subTodo._id, subTodo.text)}
                                title="Click to edit"
                              >
                                {subTodo.text}
                              </span>
                              {subTodo.pinned && <span className="pin-indicator">📌</span>}
                            </div>
                            <div className="sub-todo-actions">
                              <button 
                                className={`btn outline small pin-btn ${subTodo.pinned ? 'pinned' : ''}`}
                                onClick={() => toggleSubTodoPin(card._id, subTodo._id, subTodo.pinned)}
                                title={subTodo.pinned ? "Unpin sub-todo" : "Pin sub-todo"}
                              >
                                📌
                              </button>
                              <button 
                                className="btn outline small"
                                onClick={() => handleSubTodoEdit(card._id, subTodo._id, subTodo.text)}
                                title="Edit sub-todo"
                              >
                                ✎
                              </button>
                              <button 
                                className="btn danger small"
                                onClick={() => deleteSubTodo(card._id, subTodo._id)}
                                title="Delete sub-todo"
                              >
                                ×
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    
                    {card.subTodos.length > 4 && (
                      <div className="expand-toggle">
                        <button
                          className="btn outline small expand-btn"
                          onClick={() => toggleCardExpanded(card._id)}
                        >
                          {expandedCards.has(card._id) 
                            ? `Show less (${getVisibleSubTodos(card).length}/${card.subTodos.length})`
                            : `Show all (${card.subTodos.length})`
                          }
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList;
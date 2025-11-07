'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [streak, setStreak] = useState({});
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('habits');
    const savedStreak = localStorage.getItem('streak');
    if (saved) setHabits(JSON.parse(saved));
    if (savedStreak) setStreak(JSON.parse(savedStreak));
  }, []);

  const addHabit = () => {
    if (newHabit.trim()) {
      const updated = [...habits, { id: Date.now(), name: newHabit, completed: false }];
      setHabits(updated);
      localStorage.setItem('habits', JSON.stringify(updated));
      setNewHabit('');
    }
  };

  const toggleHabit = (id) => {
    const updated = habits.map(h =>
      h.id === id ? { ...h, completed: !h.completed } : h
    );
    setHabits(updated);
    localStorage.setItem('habits', JSON.stringify(updated));

    if (!streak[id]) {
      setStreak({ ...streak, [id]: 1 });
      localStorage.setItem('streak', JSON.stringify({ ...streak, [id]: 1 }));
    } else {
      const newStreak = { ...streak, [id]: streak[id] + 1 };
      setStreak(newStreak);
      localStorage.setItem('streak', JSON.stringify(newStreak));
    }
  };

  const deleteHabit = (id) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    localStorage.setItem('habits', JSON.stringify(updated));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎯 Discipline Builder</h1>
        <p>Build lasting habits, one day at a time</p>
      </header>

      <div className={styles.main}>
        <div className={styles.inputSection}>
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            placeholder="Add a new habit..."
            className={styles.input}
          />
          <button onClick={addHabit} className={styles.addButton}>Add</button>
        </div>

        {totalCount > 0 && (
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
            <p>{completedCount} of {totalCount} completed today</p>
          </div>
        )}

        <div className={styles.habitList}>
          {habits.map(habit => (
            <div key={habit.id} className={`${styles.habitItem} ${habit.completed ? styles.completed : ''}`}>
              <input
                type="checkbox"
                checked={habit.completed}
                onChange={() => toggleHabit(habit.id)}
                className={styles.checkbox}
              />
              <span className={styles.habitName}>{habit.name}</span>
              {streak[habit.id] && (
                <span className={styles.streak}>🔥 {streak[habit.id]}</span>
              )}
              <button onClick={() => deleteHabit(habit.id)} className={styles.deleteButton}>×</button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowTips(!showTips)}
          className={styles.tipsButton}
        >
          {showTips ? '− Hide Tips' : '+ Show Discipline Tips'}
        </button>

        {showTips && (
          <div className={styles.tipsSection}>
            <h2>Keys to Building Discipline</h2>
            <div className={styles.tips}>
              <div className={styles.tip}>
                <h3>1. Start Small</h3>
                <p>Begin with tiny habits that take less than 2 minutes. Success breeds motivation.</p>
              </div>
              <div className={styles.tip}>
                <h3>2. Same Time, Same Place</h3>
                <p>Build routines by doing habits at consistent times and locations.</p>
              </div>
              <div className={styles.tip}>
                <h3>3. Never Break the Chain</h3>
                <p>Focus on consistency over perfection. Even 1% effort counts.</p>
              </div>
              <div className={styles.tip}>
                <h3>4. Remove Friction</h3>
                <p>Make good habits easy and bad habits hard. Design your environment.</p>
              </div>
              <div className={styles.tip}>
                <h3>5. Track Your Progress</h3>
                <p>What gets measured gets managed. Use this tracker daily.</p>
              </div>
              <div className={styles.tip}>
                <h3>6. Identity-Based</h3>
                <p>Don't just do it—become the type of person who does it.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <p>Discipline is choosing between what you want now and what you want most.</p>
      </footer>
    </div>
  );
}

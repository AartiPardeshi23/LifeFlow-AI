import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { db } from '../utils/db';

export default function AICoach({ currentTheme = 'dark' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I am your LifeFlow AI Coach. How can I support your wellness and growth journey today? Try one of my quick links below!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text }]);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // Empathetic client-side response matcher
    let botResponse = "That sounds really interesting. Tell me more about what is on your mind, and how we can break it down into tiny, consistent steps.";
    const lower = userText.toLowerCase();

    if (lower.includes('stressed') || lower.includes('anxious') || lower.includes('tired')) {
      botResponse = "I'm sorry you are feeling this way. Remind yourself that you don't need to do everything today. Let's do a 4-second box breathing cycle right now, or just prioritize one small item from your planner. You're doing great.";
    } else if (lower.includes('goal') || lower.includes('smart')) {
      botResponse = "Goals are best achieved when broken into SMART milestones. What is a specific target you'd like to achieve this month? I can help you list three milestones for it.";
    } else if (lower.includes('happy') || lower.includes('excited')) {
      botResponse = "I love this positive energy! Let's channel it into completing a core habit or journaling this win in your gratitude journal so you can remember this moment later.";
    }

    addBotMessage(botResponse);
  };

  // --- Dynamic AI Helper functions reading the local Database ---
  const handleAISummarize = () => {
    setMessages(prev => [...prev, { sender: 'user', text: "Can you summarize my recent journal entries?" }]);
    
    const journals = db.getJournals();
    if (journals.length === 0) {
      addBotMessage("I couldn't find any recent journal entries to summarize. Try writing a quick reflection in the Daily Journal tab!");
      return;
    }

    const recent = journals.slice(0, 2);
    let summaryText = "Here is a mindful summary of your recent days:\n\n";
    
    recent.forEach((j, i) => {
      summaryText += `• ${j.date} (${j.type.toUpperCase()}): "${j.title}"\n`;
      if (j.type === 'daily') {
        summaryText += `  Wins: "${j.wins}". Lesson: "${j.lessons}".\n`;
      } else if (j.type === 'gratitude') {
        summaryText += `  Appreciating: "${j.personAppreciate}" and best moment: "${j.bestMoment}".\n`;
      } else if (j.type === 'feeling') {
        summaryText += `  Logged feeling: "${j.mood}" because of "${j.why}".\n`;
      }
    });

    summaryText += "\nYou are showing solid self-awareness. Let's continue logging your wins to build a positive record!";
    addBotMessage(summaryText);
  };

  const handleAISuggestGoal = () => {
    setMessages(prev => [...prev, { sender: 'user', text: "Suggest a new SMART Goal for me." }]);
    
    const suggestions = [
      {
        title: "Practice 15-Min Daily Mindfulness",
        motivation: "To reduce afternoon stress and build emotional resilience.",
        reward: "A comfortable linen yoga cushion.",
        milestones: ["Download Calm sounds app", "Meditation 5 mins morning", "Box breathe 3 times daily"]
      },
      {
        title: "Aesthetic Coding Project MVP",
        motivation: "Build a premium glassmorphic client app for my portfolio.",
        reward: "A set of custom keycaps.",
        milestones: ["Design CSS theme system", "Connect Local Database utility", "Build drag and drop canvas"]
      }
    ];

    const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
    let response = `Based on your logs, here is a suggested SMART Goal:\n\n`;
    response += `🎯 Title: "${pick.title}"\n`;
    response += `💡 Motivation: "${pick.motivation}"\n`;
    response += `🏆 Reward: "${pick.reward}"\n`;
    response += `📌 Milestones:\n` + pick.milestones.map(m => `  - ${m}`).join('\n');
    response += `\n\nYou can input this directly in your Goals panel!`;

    addBotMessage(response);
  };

  const handleAIPlanDay = () => {
    setMessages(prev => [...prev, { sender: 'user', text: "Help me structure my day." }]);
    
    const habits = db.getHabits();
    const habitTitles = habits.map(h => h.title).slice(0, 3);
    
    let plan = "Here is a balanced daily ritual outline for you:\n\n";
    plan += "🌅 MORNING: Hydrate immediately, do a 10 min stretching routine, and check off: " + (habitTitles[0] || "Meditation") + ".\n\n";
    plan += "💻 MID-DAY: Tackle your top priority first. Take a 25-minute Pomodoro focus session. Avoid multitasking.\n\n";
    plan += "🌾 EVENING: Walk outside to clear your mind. Log your mood. Do a digital detox 1 hour before bed and check off: " + (habitTitles[1] || "Reading") + ".";

    addBotMessage(plan);
  };

  const handleAIMoodTrends = () => {
    setMessages(prev => [...prev, { sender: 'user', text: "Analyze my recent mood trends." }]);
    
    const journals = db.getJournals();
    const feelings = journals.filter(j => j.type === 'feeling');

    if (feelings.length === 0) {
      addBotMessage("I don't have enough mood data to analyze yet. Please log your mood on the dashboard weather widget first!");
      return;
    }

    const latestMood = feelings[0].mood;
    const moodCount = feelings.length;

    let response = `Over your last ${moodCount} check-ins, your energy levels show solid consistency. Your latest state is "${latestMood}".\n\n`;
    response += `📈 Mindful Advice: Your mood increases when you accomplish morning routine checkmarks. Try to maintain the meditation streak.`;
    
    addBotMessage(response);
  };

  const handleAIAffirmation = () => {
    setMessages(prev => [...prev, { sender: 'user', text: "Generate a custom affirmation for me." }]);
    
    const pool = [
      "I give myself permission to progress gradually, honoring my natural rhythm.",
      "My worth is not defined by my productivity; I am complete in my stillness.",
      "I welcome clarity, choose consistency, and radiate calm presence today.",
      "Every action I take is a vote for my future self and well-being."
    ];

    const pick = pool[Math.floor(Math.random() * pool.length)];
    addBotMessage(`Here is your custom affirmation:\n\n"${pick}"\n\nYou can click the heart on your dashboard to save it!`);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            boxShadow: '0 8px 30px rgba(167, 139, 250, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          className="hover:scale-105"
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="glass-panel" style={{
          width: '380px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '0px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          background: currentTheme === 'dark' ? 'rgba(30, 31, 38, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          border: '1px solid var(--panel-border)'
        }}>
          
          {/* Header */}
          <div className="flex-between" style={{
            background: 'rgba(167, 139, 250, 0.15)',
            padding: '16px',
            borderBottom: '1px solid var(--panel-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} style={{ color: 'var(--accent-color)' }} />
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>LifeFlow AI Coach</span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Empathetic Advisor</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', padding: '4px', cursor: 'pointer' }}>
              <X size={18} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((m, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {m.sender === 'bot' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(167, 139, 250, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-color)'
                  }}>
                    <Bot size={14} />
                  </div>
                )}
                
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '16px',
                  background: m.sender === 'user' ? 'var(--accent-color)' : (currentTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                  color: m.sender === 'user' ? '#141517' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(167, 139, 250, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-color)'
                }}>
                  <Bot size={14} />
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '16px', background: currentTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Typing...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick action buttons */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            padding: '8px 16px',
            borderTop: '1px solid var(--panel-border)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            <button className="secondary" onClick={handleAISummarize} style={{ padding: '6px 10px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
              📝 Summarize Journals
            </button>
            <button className="secondary" onClick={handleAISuggestGoal} style={{ padding: '6px 10px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
              🎯 Suggest Goal
            </button>
            <button className="secondary" onClick={handleAIPlanDay} style={{ padding: '6px 10px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
              📅 Plan Day
            </button>
            <button className="secondary" onClick={handleAIMoodTrends} style={{ padding: '6px 10px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
              🎭 Analyze Mood
            </button>
            <button className="secondary" onClick={handleAIAffirmation} style={{ padding: '6px 10px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
              ✨ Affirmation
            </button>
          </div>

          {/* Text Input Footer */}
          <form onSubmit={handleSendMessage} style={{
            display: 'flex',
            padding: '12px 16px',
            borderTop: '1px solid var(--panel-border)',
            gap: '8px'
          }}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{ fontSize: '0.85rem', flex: 1, padding: '8px 12px' }}
            />
            <button type="submit" className="primary" style={{ padding: '8px 12px' }}>
              <Send size={16} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

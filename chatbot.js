document.addEventListener('DOMContentLoaded', function() {
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const sendButton = document.getElementById('send-btn');
  const actionCards = document.querySelectorAll('.action-card');
  
  // Sample academic data (would come from your backend in a real app)
  const academicData = {
    schedule: [
      { course: "Computer Programming", time: "10:00 AM - 11:30 AM", location: "Room 205", instructor: "Dr. Ahmed Mohamed" },
      { course: "Advanced Mathematics", time: "02:00 PM - 03:30 PM", location: "Room 312", instructor: "Dr. Mohamed Samy" },
      { course: "Database Systems", time: "04:00 PM - 05:30 PM", location: "Lab A1", instructor: "Dr. Sara Ali" }
    ],
    assignments: [
      { title: "Programming Project", course: "Computer Programming", due: "Oct 18", status: "2 days left" },
      { title: "Math Problem Set", course: "Advanced Mathematics", due: "Oct 20", status: "4 days left" },
      { title: "SQL Lab Report", course: "Database Systems", due: "Oct 22", status: "6 days left" }
    ],
    progress: [
      { course: "Computer Programming", percent: 85 },
      { course: "Advanced Mathematics", percent: 72 },
      { course: "Database Systems", percent: 65 }
    ]
  };
  
  // Knowledge base for academic concepts
  const knowledgeBase = {
    "database normalization": {
      title: "Database Normalization",
      content: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. The main normal forms are:<br><br>" +
               "1. <strong>1NF</strong>: Eliminate repeating groups - each table cell should contain a single value<br>" +
               "2. <strong>2NF</strong>: Be in 1NF and remove partial dependencies (all non-key attributes depend on the entire primary key)<br>" +
               "3. <strong>3NF</strong>: Be in 2NF and remove transitive dependencies (non-key attributes don't depend on other non-key attributes)<br>" +
               "4. <strong>BCNF</strong>: A stronger version of 3NF where every determinant is a candidate key"
    },
    "calculus": {
      title: "Calculus Help",
      content: "Key calculus concepts include:<br><br>" +
               "<strong>Derivatives</strong>: Measure how a function changes as its input changes<br>" +
               "<strong>Integrals</strong>: Calculate the area under a curve or the accumulation of quantities<br>" +
               "<strong>Limits</strong>: Describe the behavior of functions as they approach specific points<br>" +
               "<strong>Applications</strong>: Used in physics, engineering, economics, and many other fields"
    },
    "programming": {
      title: "Programming Help",
      content: "Common programming concepts I can help with:<br><br>" +
               "<strong>Variables & Data Types</strong>: Storing and manipulating data<br>" +
               "<strong>Control Structures</strong>: Loops and conditionals to control program flow<br>" +
               "<strong>Functions</strong>: Reusable blocks of code<br>" +
               "<strong>Object-Oriented Programming</strong>: Classes, objects, inheritance, and polymorphism<br>" +
               "<strong>Algorithms</strong>: Problem-solving approaches and efficiency analysis"
    }
  };
  
  // Study tips
  const studyTips = [
    "Use the <strong>Pomodoro Technique</strong>: Study for 25 minutes, then take a 5-minute break",
    "Practice <strong>active recall</strong>: Test yourself on the material instead of just rereading",
    "Create <strong>mind maps</strong> to visualize connections between concepts",
    "Teach the material to someone else to reinforce your understanding",
    "Space out your study sessions over time (<strong>spaced repetition</strong>) for better retention"
  ];
  
  // Add message to chat
  function addMessage(text, isUser = false, isSpecial = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'sent' : 'received'}`;
    
    if (!isUser) {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <p>${text.replace(/\n/g, '<br>')}</p>
          <span class="message-time">${getCurrentTime()}</span>
        </div>
      `;
      
      if (isSpecial) {
        const specialContent = generateSpecialContent(text);
        if (specialContent) {
          messageDiv.querySelector('.message-content').innerHTML += specialContent;
        }
      }
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>${text}</p>
          <span class="message-time">${getCurrentTime()}</span>
        </div>
      `;
    }
    
    chatbotMessages.appendChild(messageDiv);
    scrollToBottom();
  }
  
  // Generate special content based on message
  function generateSpecialContent(text) {
    const lowerText = text.toLowerCase();
    
    // Schedule response
    if (lowerText.includes('schedule') || lowerText.includes('today')) {
      let scheduleHTML = '<div class="knowledge-card"><h4><i class="fas fa-calendar-day"></i> Today\'s Schedule</h4>';
      
      academicData.schedule.forEach(item => {
        scheduleHTML += `
          <div style="margin-bottom: 1rem;">
            <p><strong>${item.course}</strong></p>
            <p><i class="fas fa-clock"></i> ${item.time} | <i class="fas fa-map-marker-alt"></i> ${item.location}</p>
            <p><i class="fas fa-user-tie"></i> ${item.instructor}</p>
          </div>
        `;
      });
      
      scheduleHTML += '</div>';
      return scheduleHTML;
    }
    
    // Assignments response
    if (lowerText.includes('assignment') || lowerText.includes('due')) {
      let assignmentsHTML = '<div class="knowledge-card"><h4><i class="fas fa-tasks"></i> Your Assignments</h4>';
      
      academicData.assignments.forEach(item => {
        assignmentsHTML += `
          <div style="margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">
            <p><strong>${item.title}</strong></p>
            <p><i class="fas fa-book"></i> ${item.course} | Due: ${item.due}</p>
            <p style="color: ${item.status.includes('overdue') ? 'var(--nmu-primary)' : '#666'}">
              <i class="fas ${item.status.includes('overdue') ? 'fa-exclamation-circle' : 'fa-clock'}"></i> ${item.status}
            </p>
          </div>
        `;
      });
      
      assignmentsHTML += '</div>';
      return assignmentsHTML;
    }
    
    // Progress response
    if (lowerText.includes('progress') || lowerText.includes('gpa')) {
      let progressHTML = '<div class="knowledge-card"><h4><i class="fas fa-chart-line"></i> Your Academic Progress</h4>';
      
      academicData.progress.forEach(item => {
        progressHTML += `
          <div style="margin-bottom: 1rem;">
            <p><strong>${item.course}</strong></p>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="flex: 1; height: 8px; background: #eee; border-radius: 4px;">
                <div style="height: 100%; width: ${item.percent}%; background: var(--nmu-primary); border-radius: 4px;"></div>
              </div>
              <span>${item.percent}%</span>
            </div>
          </div>
        `;
      });
      
      progressHTML += '</div>';
      return progressHTML;
    }
    
    // Study tips response
    if (lowerText.includes('study') || lowerText.includes('exam')) {
      let tipsHTML = '<div class="knowledge-card"><h4><i class="fas fa-lightbulb"></i> Study Tips</h4><ul>';
      
      studyTips.forEach(tip => {
        tipsHTML += `<li>${tip}</li>`;
      });
      
      tipsHTML += '</ul></div>';
      return tipsHTML;
    }
    
    // Knowledge base response
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lowerText.includes(key)) {
        return `
          <div class="knowledge-card">
            <h4><i class="fas fa-book"></i> ${value.title}</h4>
            <p>${value.content}</p>
          </div>
        `;
      }
    }
    
    return null;
  }
  
  // Get current time
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Scroll to bottom of chat
  function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
  
  // Process user input and generate response
  function processUserInput(input) {
    const lowerInput = input.toLowerCase();
    let response = "";
    let isSpecial = false;
    
    // Greetings
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      response = "Hello! How can I assist you with your studies today?";
    }
    // Thanks
    else if (lowerInput.includes('thank')) {
      response = "You're welcome! Is there anything else you'd like help with?";
    }
    // Schedule queries
    else if (lowerInput.includes('schedule') || lowerInput.includes('today') || lowerInput.includes('class')) {
      response = "Here's your schedule for today:";
      isSpecial = true;
    }
    // Assignment queries
    else if (lowerInput.includes('assignment') || lowerInput.includes('homework') || lowerInput.includes('due')) {
      response = "Here are your upcoming assignments:";
      isSpecial = true;
    }
    // Progress queries
    else if (lowerInput.includes('progress') || lowerInput.includes('grade') || lowerInput.includes('gpa')) {
      response = "Here's your current academic progress:";
      isSpecial = true;
    }
    // Study tips
    else if (lowerInput.includes('study') || lowerInput.includes('exam') || lowerInput.includes('learn')) {
      response = "Here are some effective study tips:";
      isSpecial = true;
    }
    // Knowledge base queries
    else if (lowerInput.includes('database') || lowerInput.includes('normalization')) {
      response = "database normalization";
      isSpecial = true;
    }
    else if (lowerInput.includes('calculus') || lowerInput.includes('math')) {
      response = "calculus";
      isSpecial = true;
    }
    else if (lowerInput.includes('programming') || lowerInput.includes('code')) {
      response = "programming";
      isSpecial = true;
    }
    // Default response
    else {
      response = "I'm not sure I understand. Could you rephrase your question or ask about:\n- Your schedule\n- Assignments\n- Course concepts\n- Study techniques";
    }
    
    return { response, isSpecial };
  }
  
  // Handle sending messages
  function sendMessage() {
    const messageText = chatbotInput.value.trim();
    if (messageText === '') return;
    
    addMessage(messageText, true);
    chatbotInput.value = '';
    
    // Simulate typing delay
    setTimeout(() => {
      const { response, isSpecial } = processUserInput(messageText);
      addMessage(response, false, isSpecial);
    }, 1000);
  }
  
  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  
  chatbotInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Quick action buttons
  actionCards.forEach(card => {
    card.addEventListener('click', function() {
      const prompt = this.getAttribute('data-prompt');
      if (prompt) {
        addMessage(prompt, true);
        
        // Simulate typing delay
        setTimeout(() => {
          const { response, isSpecial } = processUserInput(prompt);
          addMessage(response, false, isSpecial);
        }, 1000);
      }
    });
  });
  
  // Initial scroll to bottom
  scrollToBottom();
}); 
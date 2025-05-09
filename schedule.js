document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const tableViewBtn = document.getElementById('table-view-btn');
    const calendarViewBtn = document.getElementById('calendar-view-btn');
    const tableView = document.getElementById('table-view');
    const calendarView = document.getElementById('calendar-view');
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthElement = document.getElementById('current-month');
    
    // Schedule Data
    const scheduleData = [
      { 
        day: 'Sunday', 
        time: '9:00 AM - 11:00 AM', 
        course: 'Database Systems', 
        code: 'CS203',
        location: 'Room B203', 
        instructor: 'Dr. Sara Ali',
        color: '#1a5632'
      },
      { 
        day: 'Monday', 
        time: '11:00 AM - 1:00 PM', 
        course: 'Web Development', 
        code: 'CS101',
        location: 'Lab A1', 
        instructor: 'Dr. Ahmed Mohamed',
        color: '#d4af37'
      },
      { 
        day: 'Tuesday', 
        time: '1:00 PM - 3:00 PM', 
        course: 'Software Engineering', 
        code: 'CS301',
        location: 'Room C101', 
        instructor: 'Prof. Mahmoud Hassan',
        color: '#4B002D'
      },
      { 
        day: 'Wednesday', 
        time: '10:00 AM - 12:00 PM', 
        course: 'Human Computer Interaction', 
        code: 'CS401',
        location: 'Room D305', 
        instructor: 'Dr. Noha Samir',
        color: '#0d2e1b'
      },
      { 
        day: 'Thursday', 
        time: '9:00 AM - 11:00 AM', 
        course: 'Operating Systems', 
        code: 'CS305',
        location: 'Lab B2', 
        instructor: 'Dr. Karim Adel',
        color: '#1a5632'
      }
    ];

    // View Switching
    function switchView(view) {
      if (view === 'table') {
        tableView.style.display = 'table';
        calendarView.style.display = 'none';
        tableViewBtn.classList.add('active');
        calendarViewBtn.classList.remove('active');
        tableViewBtn.setAttribute('aria-selected', 'true');
        calendarViewBtn.setAttribute('aria-selected', 'false');
      } else {
        tableView.style.display = 'none';
        calendarView.style.display = 'block';
        tableViewBtn.classList.remove('active');
        calendarViewBtn.classList.add('active');
        tableViewBtn.setAttribute('aria-selected', 'false');
        calendarViewBtn.setAttribute('aria-selected', 'true');
        renderCalendar();
      }
    }

    // Calendar Rendering
    let currentDate = new Date();
    
    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Update month/year display
      currentMonthElement.textContent = 
        new Intl.DateTimeFormat('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }).format(currentDate);
      
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = new Date();
      
      // Clear existing day cells (keep headers)
      while (calendarGrid.children.length > 7) {
        calendarGrid.removeChild(calendarGrid.lastChild);
      }
      
      // Add empty cells for days before the first day of month
      for (let i = 0; i < firstDay; i++) {
        calendarGrid.appendChild(createEmptyDayCell());
      }
      
      // Add day cells
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
        const isToday = day === today.getDate() && 
                        month === today.getMonth() && 
                        year === today.getFullYear();
        
        const dayCell = createDayCell(day, isToday);
        
        // Add events for this day
        const daysEvents = scheduleData.filter(event => event.day === dayOfWeek);
        daysEvents.forEach(event => {
          dayCell.appendChild(createCalendarEvent(event));
        });
        
        calendarGrid.appendChild(dayCell);
      }
    }
    
    function createEmptyDayCell() {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      return emptyDay;
    }
    
    function createDayCell(dayNumber, isToday = false) {
      const dayCell = document.createElement('div');
      dayCell.className = `calendar-day ${isToday ? 'today' : ''}`;
      
      const dayNumberElement = document.createElement('div');
      dayNumberElement.className = 'day-number';
      dayNumberElement.textContent = dayNumber;
      dayCell.appendChild(dayNumberElement);
      
      return dayCell;
    }
    
    function createCalendarEvent(event) {
      const eventElement = document.createElement('div');
      eventElement.className = 'calendar-event';
      eventElement.style.borderRightColor = event.color;
      eventElement.innerHTML = `
        <span class="event-time">${event.time}</span>
        <span class="event-title">${event.course}</span>
      `;
      
      eventElement.addEventListener('click', (e) => {
        e.stopPropagation();
        showEventDetails(event);
      });
      
      return eventElement;
    }

    // Event Details Modal
    function showEventDetails(event) {
      const modal = document.createElement('div');
      modal.className = 'event-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'modal-title');
      
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header" style="border-bottom: 3px solid ${event.color}">
            <h3 id="modal-title">${event.course} <span class="course-code">${event.code}</span></h3>
            <button class="close-modal" aria-label="Close modal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p><i class="fas fa-clock" style="color: ${event.color}"></i> <strong>Time:</strong> ${event.time}</p>
            <p><i class="fas fa-map-marker-alt" style="color: ${event.color}"></i> <strong>Location:</strong> ${event.location}</p>
            <p><i class="fas fa-user-tie" style="color: ${event.color}"></i> <strong>Instructor:</strong> ${event.instructor}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-reminder">
              <i class="fas fa-bell"></i> Set Reminder
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';
      
      // Close modal handlers
      const closeModal = () => {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      };
      
      modal.querySelector('.close-modal').addEventListener('click', closeModal);
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      
      // Keyboard accessibility
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
      
      // Set focus on modal
      setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.close-modal').focus();
      }, 10);
    }

    // Table Interactions
    function setupTableInteractions() {
      const tableRows = document.querySelectorAll('.schedule-table tbody tr');
      
      tableRows.forEach(row => {
        row.addEventListener('click', () => {
          const course = row.querySelector('.course-badge').textContent;
          const time = row.cells[1].textContent;
          const location = row.cells[3].textContent;
          const instructor = row.cells[4].textContent;
          
          const event = scheduleData.find(e => 
            e.course === course && 
            e.time === time && 
            e.location === location
          );
          
          if (event) showEventDetails(event);
        });
        
        // Keyboard accessibility
        row.setAttribute('tabindex', '0');
        row.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            row.click();
          }
        });
      });
    }

    // Calendar Navigation
    document.getElementById('prev-month').addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
    
    document.getElementById('today').addEventListener('click', () => {
      currentDate = new Date();
      renderCalendar();
    });

    // Initialize
    function init() {
      // Set initial view
      switchView('table');
      
      // Setup interactions
      setupTableInteractions();
      
      // Add event listeners
      tableViewBtn.addEventListener('click', () => switchView('table'));
      calendarViewBtn.addEventListener('click', () => switchView('calendar'));
      
      // Add keyboard navigation for view buttons
      tableViewBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchView('table');
        }
      });
      
      calendarViewBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchView('calendar');
        }
      });
      
      // Inject modal styles
      injectModalStyles();
    }
    
    function injectModalStyles() {
      const modalStyles = document.createElement('style');
      modalStyles.textContent = `
        .event-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s;
          backdrop-filter: blur(3px);
        }
        
        .modal-content {
          background: white;
          border-radius: 10px;
          max-width: 450px;
          width: 90%;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        
        .modal-header {
          padding: 1.5rem;
          position: relative;
        }
        
        .modal-header h3 {
          color: var(--nmu-primary);
          margin: 0;
          font-size: 1.5rem;
        }
        
        .course-code {
          color: var(--nmu-secondary);
          font-size: 1rem;
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .modal-body p {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: var(--text-primary);
        }
        
        .modal-body strong {
          min-width: 80px;
          display: inline-block;
        }
        
        .close-modal {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #777;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        
        .close-modal:hover {
          background: #f0f0f0;
          color: #333;
        }
        
        .modal-footer {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid #eee;
        }
        
        .btn-reminder {
          background: var(--nmu-primary);
          color: white;
          border: none;
          padding: 0.7rem 1.2rem;
          border-radius: 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .btn-reminder:hover {
          background: var(--nmu-dark);
        }
        
        @media (max-width: 480px) {
          .modal-body p {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }
        }
      `;
      document.head.appendChild(modalStyles);
    }

    // Start the application
    init();
});
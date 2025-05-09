document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Add event listeners
    setupEventListeners();
    
    // Load courses (simulated)
    loadCourses();
  });
  
  function initAnimations() {
    // Animate course cards with staggered delay
    const cards = document.querySelectorAll('.course-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn, .btn-view');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
      });
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    });
  }
  
  function setupEventListeners() {
    // Join Course button
    const joinBtn = document.querySelector('.btn');
    if (joinBtn) {
      joinBtn.addEventListener('click', function() {
        showJoinCourseModal();
      });
    }
    
    // Course card click
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
      card.addEventListener('click', function(e) {
        // Don't navigate if clicking on the Enter Course button
        if (!e.target.closest('.btn-view')) {
          const courseTitle = card.querySelector('.course-title').textContent;
          navigateToCourse(courseTitle);
        }
      });
    });
  }
  
  function showJoinCourseModal() {
    // In a real app, this would show a modal
    alert('Join Course functionality would open a modal here. This is just a demo.');
    
    // Simulate adding a new course
    setTimeout(() => {
      const newCourse = {
        title: 'Newly Added Course',
        description: 'This course was just added through the Join Course feature',
        instructor: 'Dr. New Instructor',
        students: 15,
        materials: 3,
        icon: 'fas fa-star'
      };
      addCourseToDOM(newCourse);
    }, 1000);
  }
  
  function navigateToCourse(courseTitle) {
    // In a real app, this would navigate to the course page
    console.log(`Navigating to ${courseTitle} course page`);
    // window.location.href = `course.html?title=${encodeURIComponent(courseTitle)}`;
  }
  
  function loadCourses() {
    // In a real app, this would fetch from an API
    console.log('Loading courses...');
    
    // Simulate API load delay
    setTimeout(() => {
      console.log('Courses loaded successfully');
    }, 500);
  }
  
  function addCourseToDOM(course) {
    const coursesGrid = document.querySelector('.courses-grid');
    
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    courseCard.style.opacity = '0';
    courseCard.style.transform = 'translateY(20px)';
    
    courseCard.innerHTML = `
      <div class="course-header">
        <div class="course-icon">
          <i class="${course.icon}"></i>
        </div>
        <h3 class="course-title">${course.title}</h3>
      </div>
      <div class="course-body">
        <p>${course.description}</p>
        <div class="course-instructor">
          <i class="fas fa-user-tie"></i>
          <span>${course.instructor}</span>
        </div>
        <div class="course-meta">
          <span><i class="fas fa-users"></i> ${course.students} Students</span>
          <span><i class="fas fa-file-alt"></i> ${course.materials} Materials</span>
        </div>
      </div>
      <div class="course-footer">
        <a href="#" class="btn-view"><i class="fas fa-arrow-right"></i> Enter Course</a>
      </div>
    `;
    
    coursesGrid.appendChild(courseCard);
    
    // Animate the new card
    setTimeout(() => {
      courseCard.style.opacity = '1';
      courseCard.style.transform = 'translateY(0)';
      courseCard.style.transition = 'all 0.5s ease';
    }, 10);
  }
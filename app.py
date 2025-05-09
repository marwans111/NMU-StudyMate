from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from functools import wraps

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# دالة للتحقق من تسجيل الدخول
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'danger')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# صفحة تسجيل الدخول
@app.route('/', methods=['GET', 'POST'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        conn = sqlite3.connect('study_mate.db')
        c = conn.cursor()
        c.execute("SELECT id, name, password FROM users WHERE email=?", (email,))
        user = c.fetchone()
        conn.close()
        
        if user and check_password_hash(user[2], password):
            session['user_id'] = user[0]
            session['user_name'] = user[1]
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password', 'danger')
    
    return render_template('login.html')

# صفحة لوحة التحكم
@app.route('/dashboard')
@login_required
def dashboard():
    # جلب بيانات المستخدم من قاعدة البيانات
    conn = sqlite3.connect('study_mate.db')
    c = conn.cursor()
    
    # جلب عدد الكورسات
    c.execute("SELECT COUNT(*) FROM enrollments WHERE user_id=?", (session['user_id'],))
    courses_count = c.fetchone()[0]
    
    # جلب الواجبات القادمة
    c.execute('''
    SELECT a.title, a.due_date, c.name 
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
    JOIN enrollments e ON e.course_id = c.id
    WHERE e.user_id = ? AND a.due_date >= date('now')
    ORDER BY a.due_date LIMIT 3
    ''', (session['user_id'],))
    assignments = c.fetchall()
    
    conn.close()
    
    return render_template('dashboard.html', 
                         name=session['user_name'],
                         courses_count=courses_count,
                         assignments=assignments)

# صفحة الكورسات
@app.route('/courses')
@login_required
def courses():
    conn = sqlite3.connect('study_mate.db')
    c = conn.cursor()
    
    # جلب كورسات المستخدم
    c.execute('''
    SELECT c.id, c.name, c.code, u.name 
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    JOIN users u ON c.instructor_id = u.id
    WHERE e.user_id = ?
    ''', (session['user_id'],))
    user_courses = c.fetchall()
    
    conn.close()
    
    return render_template('courses.html', courses=user_courses)

# صفحة الجدول الزمني
@app.route('/schedule')
@login_required
def schedule():
    # يمكنك إضافة استعلامات لقاعدة البيانات هنا
    return render_template('schedule.html')

# صفحة الملف الشخصي
@app.route('/profile')
@login_required
def profile():
    conn = sqlite3.connect('study_mate.db')
    c = conn.cursor()
    
    # جلب بيانات المستخدم
    c.execute("SELECT * FROM users WHERE id=?", (session['user_id'],))
    user = c.fetchone()
    
    # جلب الإحصائيات الأكاديمية
    c.execute('''
    SELECT COUNT(*), AVG(progress) 
    FROM enrollments 
    WHERE user_id=?
    ''', (session['user_id'],))
    stats = c.fetchone()
    
    conn.close()
    
    return render_template('profile.html', 
                         user=user,
                         courses_count=stats[0],
                         avg_progress=stats[1])

# تسجيل الخروج
@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
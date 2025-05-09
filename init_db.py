import sqlite3
from hashlib import sha256

def hash_password(password):
    return sha256(password.encode()).hexdigest()

def create_database():
    conn = sqlite3.connect('study_mate.db')
    c = conn.cursor()
    
    # جدول المستخدمين
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student'  # يمكن أن يكون 'student' أو 'professor' أو 'admin'
    )
    ''')
    
    # جدول الكورسات
    c.execute('''
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        instructor_id INTEGER,
        FOREIGN KEY (instructor_id) REFERENCES users(id)
    )
    ''')
    
    # جدول التسجيلات
    c.execute('''
    CREATE TABLE IF NOT EXISTS enrollments (
        user_id INTEGER,
        course_id INTEGER,
        enrollment_date TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id),
        PRIMARY KEY (user_id, course_id)
    )
    ''')
    
    # جدول الواجبات
    c.execute('''
    CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT NOT NULL,
        course_id INTEGER,
        FOREIGN KEY (course_id) REFERENCES courses(id)
    )
    ''')
    
    # إضافة بيانات أولية
    add_sample_data(c)
    
    conn.commit()
    conn.close()
    print("تم إنشاء قاعدة البيانات بنجاح!")

def add_sample_data(cursor):
    # إضافة مستخدمين
    students = [
        ('Marwan Soliman', 'marwan223101334@nmu.edu.eg', hash_password('223101334')),
        ('Malak Mahmoud', 'malak223101353@nmu.edu.eg', hash_password('223101353')),
        ('Mariem Dagher', 'mariem223101343@nmu.edu.eg', hash_password('223101343')),
        ('Nourhan Ayman', 'nourhan223101375@nmu.edu.eg', hash_password('223101375')),
        ('Mariem Shreif', 'mariem223101340@nmu.edu.eg', hash_password('223101340')),
        # ... باقي الطلاب
    ]
    cursor.executemany('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', students)
    
    # إضافة كورسات
    courses = [
        ('Computer Programming', 'CS101'),
        ('Advanced Mathematics', 'MATH202'),
        ('Database Systems', 'DB301')
    ]
    cursor.executemany('INSERT INTO courses (name, code) VALUES (?, ?)', courses)
    
    # إضافة تسجيلات
    enrollments = [
        (1, 1),  # طالب ID 1 مسجل في كورس ID 1
        (2, 1),
        (2, 2),
        # ... المزيد من التسجيلات
    ]
    cursor.executemany('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', enrollments)

if __name__ == "__main__":
    create_database()
   










































   
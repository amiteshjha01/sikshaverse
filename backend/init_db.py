from app import app, db, Category, Subject, Chapter, Lesson, User, bcrypt
import os

def init():
    with app.app_context():
        # Clear existing data if necessary (be careful in production!)
        db.drop_all()
        db.create_all()

        # 1. Create Categories
        programming = Category(name="Programming", slug="programming")
        web_dev = Category(name="Web Development", slug="web-dev")
        db.session.add_all([programming, web_dev])
        db.session.commit()

        # 1.5 Create Default Admin
        hashed_pw = bcrypt.generate_password_hash("admin123").decode('utf-8')
        admin = User(username="admin", password=hashed_pw)
        db.session.add(admin)
        db.session.commit()

        # 2. Create Subjects
        python = Subject(name="Python Tutorial", slug="python", category_id=programming.id, description="Learn Python from basics to advanced.")
        js = Subject(name="JavaScript Guide", slug="javascript", category_id=web_dev.id, description="Master the language of the web.")
        db.session.add_all([python, js])
        db.session.commit()

        # 3. Create Chapters for Python
        ch1 = Chapter(title="Introduction", slug="intro", order=1, subject_id=python.id)
        ch2 = Chapter(title="Data Types", slug="data-types", order=2, subject_id=python.id)
        db.session.add_all([ch1, ch2])
        db.session.commit()

        # 4. Create Lessons for Introduction
        l1 = Lesson(title="What is Python?", slug="what-is-python", order=1, chapter_id=ch1.id, content="""
# What is Python?
Python is a high-level, interpreted, general-purpose programming language.

## Key Features:
- **Easy to Read**: Python code is easy to read and understand.
- **Interpreted**: You can run it directly without compiling.
- **Vast Libraries**: Supports everything from AI to Web Development.

```python
print("Hello SikshaVerse!")
```
""")
        l2 = Lesson(title="Installation", slug="installation", order=2, chapter_id=ch1.id, content="""
# Installation Guide
To install Python, go to [python.org](https://python.org) and download the latest version.
""")
        
        # 5. Create Lessons for Data Types
        l3 = Lesson(title="Numbers", slug="numbers", order=1, chapter_id=ch2.id, content="""
# Python Numbers
Python supports integers, floats, and complex numbers.
""")
        
        db.session.add_all([l1, l2, l3])
        db.session.commit()

        print("SikshaVerse database initialized with sample data!")

if __name__ == "__main__":
    init()

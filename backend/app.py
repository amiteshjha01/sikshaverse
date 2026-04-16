from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename
from flask import send_from_directory

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///notes.db'
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # change later

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Configuration for File Uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'zip'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))

# Category model
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    subjects = db.relationship('Subject', backref='category', lazy=True)

# Subject model
class Subject(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    chapters = db.relationship('Chapter', backref='subject', lazy=True)

# Chapter model
class Chapter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), nullable=False)
    order = db.Column(db.Integer, default=0)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    lessons = db.relationship('Lesson', backref='chapter', lazy=True)

# Lesson model
class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)  # Markdown content
    order = db.Column(db.Integer, default=0)
    chapter_id = db.Column(db.Integer, db.ForeignKey('chapter.id'), nullable=False)
    attachments = db.relationship('Attachment', backref='lesson', lazy=True)
    quizzes = db.relationship('Quiz', backref='lesson', lazy=True)

# Attachment model
class Attachment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50))
    url = db.Column(db.String(512), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)

# Quiz model
class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)
    questions = db.relationship('Question', backref='quiz', lazy=True)

# Question model
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    options = db.relationship('Option', backref='question', lazy=True)

# Option model
class Option(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255), nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)

with app.app_context():
    db.create_all()

# Create default admin (run once)
@app.route("/create-admin")
def create_admin():
    hashed_pw = bcrypt.generate_password_hash("admin123").decode('utf-8')
    admin = User(username="admin", password=hashed_pw)
    db.session.add(admin)
    db.session.commit()
    return "Admin created"

# LOGIN API
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get("username")).first()

    if user and bcrypt.check_password_hash(user.password, data.get("password")):
        token = create_access_token(identity=user.username)
        return jsonify({"token": token})

    return jsonify({"message": "Invalid credentials"}), 401

# --- TUTORIAL APIS ---

@app.route("/api/categories", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name, "slug": c.slug} for c in categories])

@app.route("/api/subjects/<category_slug>", methods=["GET"])
def get_subjects(category_slug):
    category = Category.query.filter_by(slug=category_slug).first()
    if not category:
        return jsonify({"message": "Category not found"}), 404
    
    subjects = Subject.query.filter_by(category_id=category.id).all()
    return jsonify([{
        "id": s.id, 
        "name": s.name, 
        "slug": s.slug, 
        "description": s.description,
        "image_url": s.image_url
    } for s in subjects])

@app.route("/api/chapters/<subject_slug>", methods=["GET"])
def get_chapters(subject_slug):
    subject = Subject.query.filter_by(slug=subject_slug).first()
    if not subject:
        return jsonify({"message": "Subject not found"}), 404
    
    chapters = Chapter.query.filter_by(subject_id=subject.id).order_by(Chapter.order).all()
    result = []
    for ch in chapters:
        lessons = Lesson.query.filter_by(chapter_id=ch.id).order_by(Lesson.order).all()
        result.append({
            "id": ch.id,
            "title": ch.title,
            "slug": ch.slug,
            "lessons": [{"id": l.id, "title": l.title, "slug": l.slug} for l in lessons]
        })
    return jsonify(result)

@app.route("/api/lesson/<subject_slug>/<lesson_slug>", methods=["GET"])
def get_lesson(subject_slug, lesson_slug):
    subject = Subject.query.filter_by(slug=subject_slug).first()
    if not subject:
        return jsonify({"message": "Subject not found"}), 404
    
    # We find the lesson by slug and ensure it belongs to the subject
    lesson = Lesson.query.join(Chapter).filter(
        Chapter.subject_id == subject.id,
        Lesson.slug == lesson_slug
    ).first()
    
    if not lesson:
        return jsonify({"message": "Lesson not found"}), 404
    
    return jsonify({
        "id": lesson.id,
        "title": lesson.title,
        "content": lesson.content,
        "chapter_id": lesson.chapter_id,
        "attachments": [{"id": a.id, "filename": a.filename, "url": a.url} for a in lesson.attachments]
    })

# --- FILE SERVING ---
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- ADMIN APIs (Management) ---

@app.route("/api/admin/subjects", methods=["GET"])
@jwt_required()
def get_admin_subjects():
    subjects = Subject.query.all()
    return jsonify([{
        "id": s.id, 
        "name": s.name, 
        "slug": s.slug, 
        "description": s.description,
        "category_id": s.category_id,
        "category_name": s.category.name if s.category else "None"
    } for s in subjects])

@app.route("/api/admin/subjects/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_subject(id):
    subject = Subject.query.get_or_404(id)
    db.session.delete(subject)
    db.session.commit()
    return jsonify({"message": "Subject deleted"})

@app.route("/api/admin/categories", methods=["POST"])
@jwt_required()
def create_category():
    data = request.json
    new_cat = Category(name=data['name'], slug=data['slug'])
    db.session.add(new_cat)
    db.session.commit()
    return jsonify({"message": "Category created", "id": new_cat.id})

@app.route("/api/admin/categories/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_category(id):
    category = Category.query.get_or_404(id)
    if category.subjects:
        return jsonify({"message": "Cannot delete category with active subjects"}), 400
    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted"})

@app.route("/api/admin/chapters/<int:subject_id>", methods=["GET"])
@jwt_required()
def get_admin_chapters(subject_id):
    chapters = Chapter.query.filter_by(subject_id=subject_id).all()
    return jsonify([{"id": c.id, "title": c.title} for c in chapters])

@app.route("/api/admin/subjects", methods=["POST"])
@jwt_required()
def create_subject():
    data = request.json
    new_sub = Subject(
        name=data['name'], 
        slug=data['slug'], 
        description=data.get('description'),
        category_id=data['category_id']
    )
    db.session.add(new_sub)
    db.session.commit()
    return jsonify({"message": "Subject created", "id": new_sub.id})

@app.route("/api/admin/lessons", methods=["POST"])
@jwt_required()
def create_lesson():
    data = request.json
    new_lesson = Lesson(
        title=data['title'],
        slug=data['slug'],
        content=data['content'],
        chapter_id=data['chapter_id'],
        order=data.get('order', 0)
    )
    db.session.add(new_lesson)
    db.session.commit()
    return jsonify({"message": "Lesson created", "id": new_lesson.id})

@app.route("/api/admin/upload", methods=["POST"])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    lesson_id = request.form.get('lesson_id')
    
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        file_url = f"http://127.0.0.1:5000/uploads/{filename}"
        
        if lesson_id:
            new_attach = Attachment(
                filename=filename,
                file_type=filename.rsplit('.', 1)[1].lower(),
                url=file_url,
                lesson_id=lesson_id
            )
            db.session.add(new_attach)
            db.session.commit()
            
        return jsonify({"message": "File uploaded", "url": file_url})
    
    return jsonify({"message": "File type not allowed"}), 400

if __name__ == "__main__":
    app.run(debug=True)
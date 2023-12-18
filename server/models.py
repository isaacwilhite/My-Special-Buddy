from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property

from app_setup import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    _password_hash = db.Column(db.String)  # Renamed to avoid conflict
    bio = db.Column(db.String)
    location = db.Column(db.String)
    favorite_activities = db.Column(db.String, nullable=True)
    child_name = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=func.now())
    messages = db.relationship('Message', back_populates='user', lazy=True)

    serialize_rules = ("-messages.user",)

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        self._password_hash = password_hash

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    

class Volunteer(db.Model, SerializerMixin):
    __tablename__ = 'volunteers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String)
    bio = db.Column(db.String)
    location = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=func.now())
    messages = db.relationship('Message', back_populates='volunteer', lazy=True)

    serialize_rules = ("-messages.volunteer",)
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "bio": self.bio,
            "location": self.location,
        }

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        self._password_hash = password_hash

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)
    
class ChatRoom(db.Model, SerializerMixin):
    __tablename__ = 'chatrooms'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteers.id'), nullable=False)
    messages = db.relationship('Message', backref='chatroom', lazy=True)

    user = db.relationship("User", backref="chatrooms")
    volunteer = db.relationship("Volunteer", backref="chatrooms")
    def to_dict(self):
        if self.user_id == user_id:  # If the logged-in user is the user of the chat room
            other_party_name = self.volunteer.name
        else:
            other_party_name = self.user.name
        return {
            "id": self.id,
            "user_id": self.user_id,
            "other_party_name": other_party_name,
            "volunteer_id": self.volunteer_id,
        }

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteers.id'), nullable=False)
    sender_type = db.Column(db.String)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    chatroom_id = db.Column(db.Integer, db.ForeignKey('chatrooms.id'), nullable=False)

    user = db.relationship("User", back_populates="messages")
    volunteer = db.relationship("Volunteer", back_populates="messages")

    serialize_rules = ('-user.messages', '-volunteer.messages')
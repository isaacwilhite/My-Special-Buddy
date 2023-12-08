#!/usr/bin/env python3

# Remote library imports
from flask import Flask, render_template, request, make_response, session, jsonify, redirect, url_for
from flask_restful import Resource
from flask_socketio import emit, SocketIO
from datetime import datetime
from models import db, User, Volunteer, Message
from sqlalchemy import text
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_requires, 
    get_jwt_identity, 
    current_user, 
    get_jwt, 
    set_access_cookies, 
    unset_access_cookies, 
    set_refresh_cookies, 
    unset_refresh_cookies,
)

# Local imports
from app_setup import app, db, api

socketio = SocketIO(app)
db.init_app(app)

# Ensure consistent session key
USER_SESSION_KEY = 'current_user'
VOLUNTEER_SESSION_KEY = 'current_volunteer'

class CurrentUser(Resource):
    def get(self):
        try:
            user_id = session[USER_SESSION_KEY]
            selected = db.session.get(User, int(user_id))
            return make_response(selected.to_dict(rules=('-password_hash',)), 200)
        except Exception:
            return make_response({"Error": "User does not exist."}, 404)

class CreateUser(Resource):
    def post(self):
        try:
            new_data = request.get_json()
            new_item = User(
                email=new_data['email'],
                location='',
                bio='',
            )
            new_item.set_password(new_data['password'])
            db.session.add(new_item)
            db.session.commit()
            session[USER_SESSION_KEY] = new_item.id
            return make_response(new_item.to_dict(rules=('-password_hash',)), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'Error': f'Could not create new user. {str(e)}'}, 400)

class LoginUser(Resource):
    def post(self):
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return make_response({"Error": "Missing email or password in request body."}, 400)

            selected = User.query.filter_by(email=email).first()

            if not selected or not selected.authenticate(password):
                return make_response({"Error": "Invalid credentials."}, 422)

            # session[USER_SESSION_KEY] = selected.id

            return selected.to_dict(rules=('-_password_hash',)), 200

        except Exception as e:
            return make_response({"Error": f"An error occurred: {str(e)}"}, 500)

class LogoutUser(Resource):
    def get(self):
        session[USER_SESSION_KEY] = None
        return make_response({}, 200)

class Users(Resource):
    def get(self):
        try:
            users = [user.to_dict(rules=('-password',)) for user in User.query.all()]
            return make_response(users, 200)
        except Exception as e:
            return make_response({'Error': f'Could not fetch user data. {str(e)}'}, 400)

    def post(self):
        try:
            new_data = request.get_json()
            new_item = User(**new_data)
            db.session.add(new_item)
            db.session.commit()
            return make_response(new_item.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'Error': f'Could not create new user. {str(e)}'}, 400)

class UsersById(Resource):
    def get(self, id):
        try:
            selected = db.session.get(User, id)
            return make_response(selected.to_dict(rules=('-password',)), 200)
        except Exception:
            return make_response({"Error": "User does not exist."}, 404)

    def patch(self, id):
        selected = db.session.get(User, id)

        if selected:
            try:
                new_data = request.get_json()
                for k in new_data:
                    setattr(selected, k, new_data[k])
                db.session.add(selected)
                db.session.commit()
                return make_response(selected.to_dict(rules=('-password',)), 202)
            except Exception as e:
                db.session.rollback()
                return make_response({'Error': f'Unable to update user. {str(e)}'}, 400)

        return make_response({"Error": "User does not exist."}, 404)

    def delete(self, id):
        selected = db.session.get(User, id)

        if selected:
            try:
                db.session.delete(selected)
                db.session.commit()
                return make_response({}, 204)
            except Exception as e:
                db.session.rollback()
                return make_response({'Error': f'Unable to delete user. {str(e)}'}, 400)

        return make_response({"Error": "User does not exist."}, 404)
    
class Volunteers(Resource):
    def get(self):
        try:
            volunteers = [volunteer.to_dict(rules=('-_password_hash',)) for volunteer in Volunteer.query.all()]
            return make_response(volunteers, 200)
        except Exception as e:
            return make_response({'Error': f'Could not fetch volunteer data. {str(e)}'}, 400)

    def post(self):
        try:
            new_data = request.get_json()
            new_volunteer = Volunteer(**new_data)
            db.session.add(new_volunteer)
            db.session.commit()
            return make_response(new_volunteer.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'Error': f'Could not create new volunteer. {str(e)}'}, 400)

class VolunteersById(Resource):
    def get(self, id):
        try:
            selected_volunteer = db.session.get(Volunteer, id)
            return make_response(selected_volunteer.to_dict(rules=('-_password_hash',)), 200)
        except Exception:
            return make_response({"Error": "Volunteer does not exist."}, 404)

class LoginVolunteer(Resource):
    def post(self):
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return make_response({"Error": "Missing email or password in request body."}, 400)

            selected = Volunteer.query.filter_by(email=email).first()

            if not selected or not selected.authenticate(password):
                return make_response({"Error": "Invalid credentials."}, 422)

            session[VOLUNTEER_SESSION_KEY] = selected.id

            return selected.to_dict(rules=('-_password_hash',)), 200

        except Exception as e:
            return make_response({"Error": f"An error occurred: {str(e)}"}, 500)

class CreateVolunteer(Resource):
    def post(self):
        try:
            new_data = request.get_json()
            new_volunteer = Volunteer(
                email=new_data['email'],
                password='',
                location='',
                bio='',
            )

            new_volunteer.password_hash = new_data['password']
            db.session.add(new_volunteer)
            db.session.commit()

            session[VOLUNTEER_SESSION_KEY] = new_volunteer.id

            return make_response(new_volunteer.to_dict(rules=('-_password_hash',)), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'Error': f'Could not create new volunteer. {str(e)}'}, 400)

class LogoutVolunteer(Resource):
    def get(self):
        session[VOLUNTEER_SESSION_KEY] = None
        return make_response({}, 200)

api.add_resource(LoginUser, '/login/user')
api.add_resource(CreateUser, '/signup/user')
api.add_resource(LogoutUser, '/logout/user')
api.add_resource(Users, '/users')
api.add_resource(UsersById, '/users/<int:id>')
api.add_resource(LoginVolunteer, '/login/volunteer')
api.add_resource(CreateVolunteer, '/signup/volunteer')
api.add_resource(LogoutVolunteer, '/logout/volunteer')
api.add_resource(Volunteers, '/volunteers')
api.add_resource(VolunteersById, '/volunteers/<int:id>')

@app.route('/')
def index():
    users = User.query.all()
    volunteers = Volunteer.query.all()
    return render_template('index.html', users=users, volunteers=volunteers)

@socketio.on('private_message')
def handle_private_message(data):
    sender_id = session.get(USER_SESSION_KEY)
    receiver_id = data['receiver_id']
    message_content = data['message']

    sender = User.query.get(sender_id)
    receiver = Volunteer.query.get(receiver_id)

    if sender and receiver:
        # Create a new message
        message = Message(content=message_content, user=sender, volunteer=receiver, timestamp=datetime.utcnow())
        db.session.add(message)
        db.session.commit()

        # Broadcast the message to the specific room (private chat between user and volunteer)
        room = f'user_{sender_id}_volunteer_{receiver_id}'
        emit('private_message', {'message': message_content, 'sender': sender.name}, room=room)

if __name__ == '__main__':
    socketio.run(app, port=5555, debug=True)

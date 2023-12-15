#!/usr/bin/env python3

# Remote library imports
from flask import Flask, render_template, request, make_response, session, jsonify, redirect, url_for, json
from flask_restful import Resource
from datetime import datetime
from models import db, User, Volunteer, Message, ChatRoom
from sqlalchemy import text
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity, 
    current_user, 
    get_jwt, 
    set_access_cookies, 
    unset_access_cookies, 
    set_refresh_cookies, 
    unset_refresh_cookies,
    decode_token,
    verify_jwt_in_request
)

# Local imports
from app_setup import app, db, api, socketio, emit, disconnect, join_room

db.init_app(app)

# Ensure consistent session key
USER_SESSION_KEY = 'current_user'
VOLUNTEER_SESSION_KEY = 'current_volunteer'


def decode_jwt(token):
    try:
        # This will automatically check if the token is valid
        decoded_token = decode_token(token)
        return decoded_token['sub']  # 'sub' is typically the user ID
    except Exception as e:
        print(f"Invalid token: {e}")
        return None


def verify_token(token):
    try:
        decoded_token = decode_token(token)
        user_identity = decoded_token['sub']
        return user_identity
    except Exception as e:
        print(f"Invalid token: {e}")
        return None

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
            # session[USER_SESSION_KEY] = new_item.id
            # return make_response(new_item.to_dict(rules=('-password_hash',)), 201)
            jwt = create_access_token(identity=new_item.id)
            serialized_user = new_item.to_dict(rules=('-_password_hash',))
            return {"token": jwt, "user": serialized_user}, 201
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
            jwt = create_access_token(identity=selected.id)
            serialized_user = {
                'id': selected.id,
                'email': selected.email
            }
            return {"token": jwt, "user": serialized_user}, 200

        except Exception as e:
            app.logger.error(f"Login error: {str(e)}")
            return make_response({"Error": "An internal error occurred"}, 500)

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
            volunteers = Volunteer.query.limit(10).all()  # Limiting the number of results
            volunteers_data = [{'id': v.id, 'name': v.name} for v in volunteers]  # Simple serialization
            return jsonify(volunteers_data)
        except Exception as e:
            return make_response({'Error': f'Could not fetch volunteer data: {str(e)}'}, 400)

    def post(self):
        try:
            new_data = request.get_json()
            new_volunteer = Volunteer(**new_data)
            db.session.add(new_volunteer)
            db.session.commit()
            return make_response(new_volunteer.to_dict(), 201)
        except Exception as e:
            app.logger.error(f"Error fetching volunteers: {e}")  # Log the error for debugging
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

            jwt = create_access_token(identity=selected.id)
            serialized_volunteer = {
                'id': selected.id,
                'email': selected.email
            }
            return {"token": jwt, "volunteer": serialized_volunteer}, 200

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

            # session[VOLUNTEER_SESSION_KEY] = new_volunteer.id
            # return make_response(new_volunteer.to_dict(rules=('-_password_hash',)), 201)
            jwt = create_access_token(identity=new_volunteer.id)
            serialized_user = new_volunteer.to_dict(rules=('-_password_hash',))
            return {"token": jwt, "user": serialized_user}, 201
        except Exception as e:
            db.session.rollback()
            return make_response({'Error': f'Could not create new volunteer. {str(e)}'}, 400)

class LogoutVolunteer(Resource):
    def get(self):
        session[VOLUNTEER_SESSION_KEY] = None
        return make_response({}, 200)
    
class CreateChatRoom(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        volunteer_id = request.json.get('volunteer_id')

        chat_room = ChatRoom(user_id=user_id, volunteer_id=volunteer_id)
        db.session.add(chat_room)
        db.session.commit()
        return {"chat_room_id": chat_room.id}, 201
    
class ChatRoomsByUserId(Resource):
    @jwt_required()
    def get(self):
        return {"message": "Endpoint reached successfully"}
        # user_id = get_jwt_identity()

        # # Fetch chat rooms where the user is either a user or a volunteer
        # chat_rooms = ChatRoom.query.filter((ChatRoom.user_id == user_id) | (ChatRoom.volunteer_id == user_id)).all()
        
        # # Serialize the chat room data
        # chat_rooms_data = [chat_room.to_dict() for chat_room in chat_rooms]
        
        # return chat_rooms_data
    
class MessagesByChatRoomId(Resource):
    @jwt_required()
    def get(self, chat_room_id):
        # Ensure the user is part of the chat room
        user_id = get_jwt_identity()
        chat_room = ChatRoom.query.filter_by(id=chat_room_id).first()

        if not chat_room or (chat_room.user_id != user_id and chat_room.volunteer_id != user_id):
            return {"message": "Chat room not found or access denied"}, 404

        # Fetch messages for the chat room
        messages = Message.query.filter_by(chatroom_id=chat_room_id).all()

        # Serialize the message data
        messages_data = [
            {'id': message.id, 'content': message.content}
            for message in messages
        ]

        return messages_data
    
api.add_resource(MessagesByChatRoomId, '/chat_rooms/<int:chat_room_id>/messages')
api.add_resource(ChatRoomsByUserId, '/user_chat_rooms')
api.add_resource(CreateChatRoom, '/create_chat_room')
api.add_resource(LoginUser, '/login/user')
api.add_resource(CreateUser, '/signup/user')
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

@socketio.on('send_message')
def handle_send_message(data):
    token = request.args.get('token')
    # if not token:
    #     print("No JWT token provided")
    #     # disconnect()
    #     return
    
    user_id = decode_jwt(token)
    # if not user_id:
    #     print("Invalid or expired JWT token")
    #     # disconnect()
    #     return
    chat_room_id = data['chat_room_id']
    message_content = data['message']
    volunteer_id = data.get('volunteer_id')

    chat_room = ChatRoom.query.get(chat_room_id)
    if chat_room:
        # Save message to the database
        new_message = Message(content=message_content, user_id=user_id, volunteer_id=volunteer_id, chatroom_id=chat_room_id, timestamp=datetime.utcnow())
        db.session.add(new_message)
        db.session.commit()

        print(new_message)
        new_message_id = new_message.id
        # Emit the message to the specific chat room
        emit('new_message', {'id': new_message_id, 'content': message_content}, room=data['chat_room_id'])
        print(message_content)

@socketio.on('join_room')
def on_join(data):
    room = data['chat_room_id']
    join_room(room)
    emit('room_notification', {'message': 'A new user has joined.'}, room=room)

# @socketio.on('connect')
# def on_connect():
#     token = request.args.get('token')
#     if not token:
#         print("No JWT token provided")
#         disconnect()
#         return
    # Further processing with the token


if __name__ == '__main__':
    socketio.run(app, port=5555, debug=True)

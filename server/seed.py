#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc


# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Volunteer, Message

if __name__ == '__main__':
    fake = Faker()

    def create_users():
        users = []
        for n in range(20):
            new_user = User(
                name = fake.first_name(),
                email = fake.email(),
                location = fake.zipcode(),
                bio = fake.sentence(),
                favorite_activities = fake.sentence()
            )
            new_user.password_hash = 'password'
            users.append(new_user)
            
        db.session.add_all(users)
        db.session.commit()


    def create_volunteers():
        volunteers = []
        for n in range(20):
            new_volunteer = Volunteer(
                name = fake.first_name(),
                email = fake.email(),
                location = fake.zipcode(),
                _password_hash = "password",
                bio = fake.sentence()
            )
            new_volunteer.password_hash = 'password'
            volunteers.append(new_volunteer)
            
        db.session.add_all(volunteers)
        db.session.commit()

    def seed_messages():
        users = User.query.all()
        volunteers = Volunteer.query.all()

        for _ in range(20):
            sender = fake.random_element(elements=users)
            receiver = fake.random_element(elements=volunteers)

            message = Message(
                content=fake.text(),
                user=sender,
                volunteer=receiver,
                timestamp=datetime.utcnow()
            )
            db.session.add(message)

    with app.app_context():
        db.drop_all()
        db.create_all()
        print("Starting seed...")
        # Seed code goes here
        create_users()
        create_volunteers()
        print("Seeding finished!")
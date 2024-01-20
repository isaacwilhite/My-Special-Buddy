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
        for n in range(50):
            new_user = User(
                name = fake.first_name(),
                email = fake.email(),
                location = fake.state(),
                bio = fake.sentence(),
                favorite_activities = fake.sentence(),
                child_name = fake.first_name()
            )
            new_user.password_hash = 'password'
            users.append(new_user)
            
        db.session.add_all(users)
        db.session.commit()


    def create_volunteers():
        volunteer_data = [
            Volunteer(name="Ashley", email="ashley@exmple.com", bio="I am a student a UVU. Working with special needs individuals is very close to my heart. My experience in this field has taught me patience, empathy, and the importance of celebrating every individual's unique abilities and accomplishments. I love skiing, the ocean, going on walks, and cleaning.", location="California"),
            Volunteer(name="Autumn", email="autumn@exmple.com", bio="Hello! I’m a dedicated nursing student at BYU. With over 5 years of babysitting and special needs experience, I've developed a strong understanding and love for working with children of all backgrounds. I’m known for my outgoing personality and my enthusiasm for making each day a little brighter!", location="California"),
            Volunteer(name="Kai", email="kai@exmple.com", bio="I am a pre-med student at UVU. My experience with special needs kids has been both enlightening and fulfilling, teaching me patience, understanding, and the joy of seeing the world through diverse perspectives. I'm always eager to meet new friends and create lasting, meaningful connections. I also love karaoke.", location="California"),
            Volunteer(name="Ellie", email="ellie@exmple.com", bio="HI!! I am Ellie, and I'm from San Clemente, CA. I am currently pursuing a Pre-business major at BYU. Beyond the classroom, I enjoy hot yoga, reading, and spending time with friends. I have a special place in my heart for special needs teenagers, and love to make them feel loved.", location="California"),
            Volunteer(name="Gavin", email="gavin@exmple.com", bio="I am a pre-business student at BYU. My favorite things to do are spend time with my family, work on cars, and brighten peoples days. I have loved working with special needs individuals as it has changed my perspective on life.", location="California"),
        ]
        for volunteer in volunteer_data:
            volunteer.password_hash = "password"
            db.session.add(volunteer)

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
"""add chat room

Revision ID: 2886bacf3af3
Revises: 84d3a1acc82e
Create Date: 2023-12-12 13:42:46.634032

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2886bacf3af3'
down_revision = '84d3a1acc82e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chatrooms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('volunteer_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_chatrooms_user_id_users')),
    sa.ForeignKeyConstraint(['volunteer_id'], ['volunteers.id'], name=op.f('fk_chatrooms_volunteer_id_volunteers')),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.add_column(sa.Column('chatroom_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(batch_op.f('fk_messages_chatroom_id_chatrooms'), 'chatrooms', ['chatroom_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_messages_chatroom_id_chatrooms'), type_='foreignkey')
        batch_op.drop_column('chatroom_id')

    op.drop_table('chatrooms')
    # ### end Alembic commands ###
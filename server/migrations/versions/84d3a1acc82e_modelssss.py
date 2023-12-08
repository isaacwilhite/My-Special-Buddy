"""modelssss

Revision ID: 84d3a1acc82e
Revises: 7b06c24c9f42
Create Date: 2023-12-07 17:30:18.017382

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '84d3a1acc82e'
down_revision = '7b06c24c9f42'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('volunteers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('_password_hash', sa.String(), nullable=True))
        batch_op.drop_column('password_hash')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('volunteers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password_hash', sa.VARCHAR(), nullable=True))
        batch_op.drop_column('_password_hash')

    # ### end Alembic commands ###
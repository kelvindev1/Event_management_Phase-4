"""initial migration of  tables

Revision ID: 65857a11f1c6
Revises: 
Create Date: 2024-07-10 20:00:29.054339

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '65857a11f1c6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('roles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('token_blocklist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('jti', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('token_blocklist', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_token_blocklist_jti'), ['jti'], unique=False)

    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('events',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('location', sa.String(), nullable=True),
    sa.Column('date_time', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('organizer_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['organizer_id'], ['users.id'], name=op.f('fk_events_organizer_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_roles',
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], name=op.f('fk_user_roles_role_id_roles')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_roles_user_id_users'))
    )
    op.create_table('eventbookmarks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], name=op.f('fk_eventbookmarks_event_id_events')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_eventbookmarks_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tickets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ticket_type', sa.String(), nullable=True),
    sa.Column('price', sa.Float(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], name=op.f('fk_tickets_event_id_events')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('payments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.Column('ticket_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], name=op.f('fk_payments_event_id_events')),
    sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], name=op.f('fk_payments_ticket_id_tickets')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_payments_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('payments')
    op.drop_table('tickets')
    op.drop_table('eventbookmarks')
    op.drop_table('user_roles')
    op.drop_table('events')
    op.drop_table('users')
    with op.batch_alter_table('token_blocklist', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_token_blocklist_jti'))

    op.drop_table('token_blocklist')
    op.drop_table('roles')
    # ### end Alembic commands ###

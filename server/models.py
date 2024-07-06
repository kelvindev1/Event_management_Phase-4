from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
# from sqlalchemy.orm import validates
# from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin


metadata = MetaData(
    naming_convention={"fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",})

db = SQLAlchemy(metadata=metadata)




# event bookmark belongs to one user, event.
class EventBookmark(db.Model, SerializerMixin):
    __tablename__ = 'eventbookmarks'

    serialize_rules = ('-user.eventbookmarks', '-event.eventbookmarks', 'id', 'user_id', 'event_id')

    # eventbookmarks = association_proxy('event', 'event_bookmarks')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))

    user = db.relationship('User', back_populates='eventbookmarks', lazy=True)
    event = db.relationship('Event', back_populates='eventbookmarks', lazy=True)



# payment belongs to one user, event and ticket.
class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'

    serialize_rules = ('-user.payments', '-ticket.payments', '-event.payments')

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    status = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'))

    user = db.relationship('User', back_populates='payments', lazy=True)
    ticket = db.relationship('Ticket', back_populates='payments', lazy=True)
    event = db.relationship('Event', back_populates='payments', lazy=True)




# ticket belongs to one event.
# ticket can have multiple payments.
class Ticket(db.Model, SerializerMixin):
    __tablename__ = 'tickets'
    
    serialize_rules = ('-event.tickets', '-payments.ticket')

    id = db.Column(db.Integer, primary_key=True)
    ticket_type = db.Column(db.String)
    price = db.Column(db.Float)
    status = db.Column(db.String)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"))

    event = db.relationship('Event', back_populates='tickets', lazy=True)
    payments = db.relationship('Payment', back_populates='ticket', lazy=True, cascade='all, delete-orphan')




# event belongs to one organizer (user).
# event can have multiple tickets.
# event can receive multiple payments.
class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    serialize_only = ('id', 'title', 'description', 'location', 'date_time', 'created_at', 'updated_at', 'organizer_id')

    # user_bookmark =association_proxy('eventbookmarks', 'user')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.String)
    location = db.Column(db.String)
    date_time = db.Column(db.DateTime) 
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now())
    organizer_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    organizer = db.relationship('User', back_populates='events', lazy=True)
    tickets = db.relationship('Ticket', back_populates='event', lazy=True, cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='event', lazy=True, cascade='all, delete-orphan')
    eventbookmarks = db.relationship('EventBookmark', back_populates='event', lazy=True, cascade='all, delete-orphan')


# user can organize multiple events.
# user can make multiple payments.
# user can bookmark multiple events.
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-payments.user', '-eventbookmarks.user', '-events.organizer')

    # event_bookmarks =association_proxy('eventbookmarks', 'event')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    # role = db.column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now())

    events = db.relationship('Event', back_populates='organizer', lazy=True, cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='user', lazy=True, cascade='all, delete-orphan')
    eventbookmarks = db.relationship('EventBookmark', back_populates='user', lazy=True, cascade='all, delete-orphan')



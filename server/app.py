from models import db, User, Event, Ticket, Payment, EventBookmark

from flask_migrate import Migrate
from flask import Flask, jsonify, request, make_response
from flask_restful import Api, Resource

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)
api=Api(app)


@app.route('/')
def index():
    return f'Welcome to phase 4 Project'


class ShowUsers(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)

api.add_resource(ShowUsers, '/users')



class ShowEventBookmarks(Resource):
    def get(self):
        eventbookmarks = [eventbookmark.to_dict() for eventbookmark in EventBookmark.query.all()]
        return make_response(eventbookmarks, 200)
    
api.add_resource(ShowEventBookmarks, '/eventbookmarks')



class ShowPayments(Resource):
    def get(self):
        payments = [payment.to_dict() for payment in Payment.query.all()]
        return make_response(payments, 200)
    
api.add_resource(ShowPayments, '/payments')



class ShowTickets(Resource):
    def get(self):
        tickets = [ticket.to_dict() for ticket in Ticket.query.all()]
        return make_response(tickets, 200)
    
api.add_resource(ShowTickets, '/tickets')



class ShowEvents(Resource):
    def get(self):
        events = [event.to_dict() for event in Event.query.all()]
        return make_response(events, 200)
    
api.add_resource(ShowEvents, '/events')



if __name__ == '__main__':
    app.run(port='5555', debug=True)
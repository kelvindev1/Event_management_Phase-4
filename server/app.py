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
    

    def post(self):
        data = request.get_json()

        if not data or not data.get('username') or not data.get('email'):
            return {"message": "Missing required fields (username and email)"}, 400

        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return {"message": "User with this email already exists"}, 400
        
        new_user = User(username=data['username'], email=data['email'])
        try:
            db.session.add(new_user)
            db.session.commit()
            user_dict = new_user.to_dict()
            response = make_response(user_dict, 201)
            return response
        
        except Exception as exc:
            db.session.rollback()
            return {"message": "Error creating user", "error": str(exc)}, 500

api.add_resource(ShowUsers, '/users')


class ShowUser(Resource):
    def get(self, id):
        user = User.query.filter(User.id == id).first()
        if not user:
            return {"message": "User not found"}, 404
        return user.to_dict()

    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        data = request.get_json()
        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        try:
            db.session.commit()
            return user.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"message": "Error updating user", "error": str(e)}, 500

    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"message": "User not found"}, 404
        try:
            db.session.delete(user)
            db.session.commit()
            return {"message": "User deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": "Error deleting user", "error": str(e)}, 500

api.add_resource(ShowUser, '/users/<int:id>')




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
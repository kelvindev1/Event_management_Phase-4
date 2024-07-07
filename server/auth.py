from flask_jwt_extended import JWTManager, create_access_token
from flask_bcrypt import Bcrypt
from flask import Blueprint
from flask_restful import Api, Resource, reqparse
from models import User, db

auth_bp = Blueprint('auth_bp', __name__,url_prefix='/auth')
bcrypt = Bcrypt()

auth_api = Api(auth_bp)
jwt = JWTManager()


# signup
register_args =reqparse.RequestParser()
register_args.add_argument('email')
register_args.add_argument('password')
register_args.add_argument('password2')

class Register(Resource):
    def post(self):
        data = register_args.parse_args()
        if data.get('password') != data.get('password2'):
            return {"msg": "Passwords don't Match"}
        
        hashed_password = bcrypt.generate_password_hash(data.get('password'))
        new_user = User(email=data.get('email'), password = hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return {'msg': "User registration Successful"}
auth_api.add_resource(Register, '/register')


# login
login_args = reqparse.RequestParser()
login_args.add_argument('email')
login_args.add_argument('password')

class Login(Resource):
    def post(self):
        data = login_args.parse_args()

        user = User.query.filter_by(email=data.get('email')).first()
        if not user:
            return {"msg": "User does not Exist"}
        
        if not bcrypt.check_password_hash(user.password, data.get('password')):
            return {"msg": "Incorrect Password"}
        
        token = create_access_token(identity=user.id)
        return {"token": token}
auth_api.add_resource(Login, '/login')
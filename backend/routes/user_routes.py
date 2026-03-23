from flask import Blueprint, request, jsonify
from database import users_collection
from schemas import UserSchema, UserUpdateSchema
from pydantic import ValidationError
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from bson.errors import InvalidId

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        user_data = UserSchema(**data)
        
        new_user = user_data.dict()
        result = users_collection.insert_one(new_user)
        
        return jsonify({"id": str(result.inserted_id), "message": "User created"}), 201

    except ValidationError as e:
        return jsonify({"error": "Validation Error", "details": e.errors()}), 400
    except DuplicateKeyError as e:
        field = "username" if "username" in str(e) else "email"
        return jsonify({"error": f"Conflict: That {field} is already taken"}), 409

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = list(users_collection.find())
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users), 200

@user_bp.route('/users/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        oid = ObjectId(id)
        result = users_collection.delete_one({"_id": oid})
        if result.deleted_count:
            return jsonify({"message": "User deleted"}), 200
        return jsonify({"error": "User not found"}), 404
    except (InvalidId, TypeError):
        return jsonify({"error": "Invalid ID format"}), 400


@user_bp.route('/users/<id>', methods=['PATCH'])
def update_user(id):
    try:
        data = request.get_json()
        
        validated_data = UserUpdateSchema(**data)
        
        update_dict = {k: v for k, v in validated_data.dict().items() if v is not None}
        
        if not update_dict:
            return jsonify({"error": "No valid fields provided for update"}), 400

        result = users_collection.update_one(
            {"_id": ObjectId(id)}, 
            {"$set": update_dict}
        )

        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"message": "User updated successfully"}), 200

    except ValidationError as e:
        return jsonify({"error": "Validation Error", "details": e.errors()}), 400
    except DuplicateKeyError as e:
        field = "username" if "username" in str(e) else "email"
        return jsonify({"error": f"Conflict: That {field} is already taken"}), 409
    except Exception as e:
        return jsonify({"error": "Invalid ID format or server error"}), 400


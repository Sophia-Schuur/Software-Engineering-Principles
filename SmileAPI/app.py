from flask import Flask, jsonify, request
from flask_cors import CORS
import flask_sqlalchemy as sqlalchemy

import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlalchemy-demo.db'

db = sqlalchemy.SQLAlchemy(app)

class Smile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    space = db.Column(db.String(128), nullable=False)
    title = db.Column(db.String(64), nullable=False)
    story = db.Column(db.String(2048), nullable=False)
    happiness_level = db.Column(db.Integer, nullable=False)
    like_count = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    # TODO 1: add all of the columns for the other table attributes
    


base_url = '/api/'

# index
# loads all smiles given a space, count parameter and order_by parameter 
# if the count param is specified and doesn't equal all limit by the count
# if the order_by param is specified order by param otherwise load by updated_at desc
# return JSON
@app.route(base_url + 'smiles')
def index():
    space = request.args.get('space', None) 

    if space is None:
        return "Must provide space", 500

    count = request.args.get('count', None)
    if count is None:
        count = 20

    order_by = request.args.get('order_by', None)
    
    query = Smile.query.filter_by(space=space).order_by(order_by).limit(count).all() # store the results of your query here


    
    result = []
    for row in query:
        result.append(
            row_to_obj(row) # you must call this function to properly format 
        )

    return jsonify({"status": 1, "smiles": result})


# show
# loads a smile given the id as a value in the URL

# TODO 4: create the route for show

@app.route(base_url + 'smiles/<int:id>', methods=["GET"])
def show(id):
	
	row = Smile.query.filter_by(id=id).first()
	
	return jsonify({"smile": row_to_obj(row), "status": 1}), 200

# create
# creates a smile given the params

# TODO 5: create the route for create
@app.route(base_url + 'smiles', methods=["POST"])
def create():
	smile = Smile(**request.json)

	db.session.add(smile)
	db.session.commit()
	db.session.refresh(smile)
	
	return jsonify({"status": 1, "smile": row_to_obj(smile)}), 200



@app.route(base_url + 'smiles/<int:id>/like', methods=["POST"])
def like(id):
	row = Smile.query.filter_by(id=id).first()
	row.like_count = row.like_count + 1

	#db.session.add(smile)
	db.session.commit()

	#db.session.refresh(smile)
	return jsonify({"smile": row_to_obj(row), "status": 1}), 200


# delete_smiles
# delete given an space
# delete all smiles in that space

# TODO 6: create the route for delete_smiles
@app.route(base_url + 'smiles', methods=["DELETE"])
def delete():
	space = request.args.get('space', None) 
	rows = Smile.query.filter_by(space=space)
	
	for row in rows:
		db.session.delete(row)

	db.session.commit()
	return jsonify({"status": 1})

	




# post_like
# loads a smile given an ID and increments the count by 1


# TODO 7: create the route for post_like 
def row_to_obj(row):
    row = {
            "id": row.id,
            "space": row.space,
            "title": row.title,
            "story": row.story,
            "happiness_level": row.happiness_level,
            "like_count": row.like_count,
            "created_at": row.created_at,
            "updated_at": row.updated_at
        }

    return row

  
def main():
    db.create_all() # creates the tables you've provided
    app.run()       # runs the Flask application  

if __name__ == '__main__':
    main()

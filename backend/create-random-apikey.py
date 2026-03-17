import uuid, json
api_list =[]
for i in range(10):
    api_list.append(str(uuid.uuid4()))
with open("api-keys.json", 'a') as f:
    json.dump(api_list, f)

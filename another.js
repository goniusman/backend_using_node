version: "3.8"
service:
  mongo:
    image: mongo 
    container_name: mongo
    ports: 
      - "27017:27017"
    networks: 
      - mynet 
    valumes: 
      - mongo_data:/data/db 
  elasticsearch:
    image: elasticsearch:7.9.2
    container_name: elasticsearch
    environment: 
      -discovery.type=single-node 
    ports: 
        - "9200:9200"
    networks: 
      - mynet 
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
  kibana:
    image: kibana:7.9.2 
    container_name: kibana
    ports: 
      - "5601:5601"
    networks: 
      - mynet
    volumes: 
      - kibana_data:/usr/share/kibana/data
  backendUsingNode:
    image: kibana:7.9.2 
    container_name: backendUsingNode
    ports: 
      - "5000:5000"
    networks: 
      - mynet
    volumes: 
      - kibana_data:/usr/share/backendUsingNode/data
    environment:
      - DEBUG: 1
      - MONGODb_HOST=mongo 
      - ELASTICSEARCH_HOST=elasticsearch
    depends_on: 
     - mongo
     - elasticsearch
     - kibana
        
         





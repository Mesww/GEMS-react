# Use the official MongoDB image as the base
FROM mongo:6.0-rc-jammy
# Set environment variables
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=1234
# Expose MongoDB default port
EXPOSE 27017
# Copy custom MongoDB configuration file
COPY mongod.conf /etc/mongod.conf
COPY keyFile /etc/mongo.key
# RUN chown mongodb:mongodb /etc/mongo.key
# Start MongoDB with replication
CMD ["mongod", "--config", "/etc/mongod.conf", "--replSet", "rs0"] 
from rest_framework import serializers
from .models import Vehicles, Rentals

# Tabla vehicles (vehículos):
# id BIGSERIAL PRIMARY KEY
# plate VARCHAR(10) NOT NULL UNIQUE
# brand VARCHAR(40) NOT NULL
# daily_rate NUMERIC(10,2) NOT NULL
# is_available BOOLEAN NOT NULL DEFAULT TRUE

class VehiclesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicles
        fields = ["id", "plate", "brand", "daily_rate", "is_available"]

# Tabla rentals (alquileres):
# id BIGSERIAL PRIMARY KEY
# vehicle_id BIGINT NOT NULL REFERENCES vehicles(id)
# customer_name VARCHAR(120) NOT NULL
# status VARCHAR(20) NOT NULL (RESERVED, ACTIVE, CLOSED, CANCELLED)
# created_at TIMESTAMP NOT NULL DEFAULT NOW()
# total NUMERIC(10,2) NOT NULL

class RentalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rentals
        fields = ["id", "vehicle_id", "customer_name", "total", "status", "created_at"]

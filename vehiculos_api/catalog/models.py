from django.db import models

# Tabla vehicles (vehículos):
# id BIGSERIAL PRIMARY KEY
# plate VARCHAR(10) NOT NULL UNIQUE
# brand VARCHAR(40) NOT NULL
# daily_rate NUMERIC(10,2) NOT NULL
# is_available BOOLEAN NOT NULL DEFAULT TRUE


class Vehicles(models.Model):
    id = models.BigAutoField(primary_key=True)
    plate = models.CharField(max_length=120, unique=True)
    brand = models.CharField(max_length=60)
    daily_rate = models.DecimalField(max_digits=20, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.plate

#id BIGSERIAL PRIMARY KEY
#vehicle_id BIGINT NOT NULL REFERENCES vehicles(id)
#customer_name VARCHAR(120) NOT NULL
#total NUMERIC(10,2) NOT NULL
#status VARCHAR(20) NOT NULL (RESERVED, ACTIVE, CLOSED, CANCELLED)
#created_at TIMESTAMP NOT NULL DEFAULT NOW()


class Rentals(models.Model):
    id = models.BigAutoField(primary_key=True)
    vehicle_id = models.ForeignKey(Vehicles, on_delete=models.PROTECT, related_name="rentals")
    customer_name = models.CharField(max_length=120)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=[
        ('RESERVED', 'Reserved'),
        ('ACTIVE', 'Active'),
        ('CLOSED', 'Closed'),
        ('CANCELLED', 'Cancelled')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle_id.brand} {self.vehicle_id.plate} ({self.customer_name})"
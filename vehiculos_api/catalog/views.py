from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Vehicles, Rentals
from .serializers import VehiclesSerializer, RentalsSerializer
from .permissions import IsAdminOrReadOnly

# Tabla vehicles (vehículos):
# id BIGSERIAL PRIMARY KEY
# plate VARCHAR(10) NOT NULL UNIQUE
# brand VARCHAR(40) NOT NULL
# daily_rate NUMERIC(10,2) NOT NULL
# is_available BOOLEAN NOT NULL DEFAULT TRUE

class VehiclesViewSet(viewsets.ModelViewSet):
    queryset = Vehicles.objects.all().order_by("id")
    serializer_class = VehiclesSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["plate"]
    ordering_fields = ["id", "plate", "brand", "daily_rate", "is_available"]
    

# Tabla rentals (alquileres):
# id BIGSERIAL PRIMARY KEY
# vehicle_id BIGINT NOT NULL REFERENCES vehicles(id)
# customer_name VARCHAR(120) NOT NULL
# status VARCHAR(20) NOT NULL (RESERVED, ACTIVE, CLOSED, CANCELLED)
# created_at TIMESTAMP NOT NULL DEFAULT NOW()
# total NUMERIC(10,2) NOT NULL

class RentalsViewSet(viewsets.ModelViewSet):
    queryset = Rentals.objects.all().order_by("id")
    serializer_class = RentalsSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["vehicle_id"]
    search_fields = ["customer_name"]
    ordering_fields = ["id", "vehicle_id", "customer_name", "total", "status", "created_at"]

    def get_queryset(self):
        qs = super().get_queryset()
        total_min = self.request.query_params.get("total_min")
        total_max = self.request.query_params.get("total_max")
        if total_min:
            qs = qs.filter(total__gte=float(total_min))
        if total_max:
            qs = qs.filter(total__lte=float(total_max))
        return qs

    def get_permissions(self):
        # Público: SOLO listar vehículos
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()
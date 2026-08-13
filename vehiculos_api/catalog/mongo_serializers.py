from rest_framework import serializers

#_id ObjectId
#vehicle_id long
#action string (CREATED, UPDATED, MAINTENANCE, DISABLED)
#note string
#source string (SYSTEM, MOBILE)
#created_at date

class FleetLogSerializer(serializers.Serializer):
    _id = serializers.CharField()
    vehicle_id = serializers.IntegerField()
    action = serializers.CharField()
    note = serializers.CharField(required=False, allow_blank=True)
    source = serializers.CharField()
    created_at = serializers.DateTimeField()

#_id ObjectId
#rental_id long
#event_type string (CREATED, PICKED_UP, RETURNED, PAID, CANCELLED)
#source string (WEB, MOBILE, SYSTEM)
#note string
#created_at date

class RentalEventSerializer(serializers.Serializer):
    _id = serializers.CharField()        
    rental_id = serializers.IntegerField()       
    event_type = serializers.CharField()    
    source = serializers.CharField()          
    note = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField()    

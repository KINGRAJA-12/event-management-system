from rest_framework import serializers
from .models import MyUser,Event,Attendance
from datetime import date,timedelta
#user serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ["name", "email", "password"]
        extra_kwargs = {      
            "password": {
                "write_only": True
            }
        }
    def validate(self, data):
        if MyUser.objects.filter(email=data.get("email")).exists():
            raise serializers.ValidationError({"email": "Email already taken"})
        return data 

    def create(self, validated_data):
        name = validated_data.get("name")
        email = validated_data.get("email")
        password = validated_data.get("password")
        user = MyUser.objects.create_user(name=name, email=email, password=password)
        return user
    
#login serializer
class LoginSerializer(serializers.Serializer):
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True)
    def validate(self, data):
        email=data.get("email")
        password=data.get("password")
        if email is None or password is None:
            raise serializers.ValidationError("Email or password may be wrong")
        user=MyUser.objects.filter(email=email).first()
        if user is None:
            raise serializers.ValidationError("user with this account not found")
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid password")
        data["user"]=user
        return data
#event serializer
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = ['posted_by']
    def validate(self, data):
        print(data)
        event_date = data.get("date")
        if not event_date:
            raise serializers.ValidationError("Event date is required")
        if event_date <= date.today() + timedelta(days=2):
            raise serializers.ValidationError("Event must be at least 2 days in the future")
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        print(user)
        event = Event.objects.create(
            title=validated_data.get("title"),
            description=validated_data.get("description"),
            image=validated_data.get("image"),
            date=validated_data.get("date"),
            location=validated_data.get("location"),
            price=validated_data.get("price"),
            capacity=validated_data.get("capacity"),
            posted_by=user
        )
        return event

#attendance serializer
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Attendance
        fields="__all__"
    def validate(self,data):
        event=data.get("event")
        email=data.get("email")
        number=data.get("number")
        if Attendance.objects.filter(event=event,email=email).exists():
            raise serializers.ValidationError("This email is Already register")
        if Attendance.objects.filter(event=event,number=number).exists():
            raise serializers.ValidationError("This context number already used")
        return data

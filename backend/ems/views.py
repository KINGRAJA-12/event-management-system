from django.shortcuts import render
from rest_framework import views, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, LoginSerializer, EventSerializer, AttendanceSerializer
from .models import MyUser, Event, Attendance
import resend
from django.conf import settings
from datetime import date
import csv
resend.api_key =settings.RESEND_API_KEY
#mail sending using "resend"
def sendMail(from_email, to_email, subject, image_url, number):
    try:
        params: resend.Emails.SendParams= {
            "from":"Acme <onboarding@resend.dev>",
            "to": [to_email],
            "subject": subject,
            "html": f"""
                <h1>Registration Successfull</h1>
                <p>Your number is: {number}</p>
                <img src="{image_url}" alt="Event Image"/>
            """
        }
        response = resend.Emails.send(params)
        print(response)
        return response
    except Exception as e:
        print("Email sending failed:", str(e))
        return None

#create new account function
class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = MyUser.objects.all()
    permission_classes = [AllowAny]

#user login function
class LoginView(views.APIView):
    permission_classes = [AllowAny]
    def generate_token(self, user):
        token = RefreshToken.for_user(user)
        return {
            "accessToken": str(token.access_token),
            "refreshToken": str(token)
        }

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            tokens = self.generate_token(user)
            return Response(tokens, status=status.HTTP_200_OK)
        return Response({"message":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

#logout class
class LogoutView(views.APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        try:
            refresh=request.data["refresh"]
            token=RefreshToken(token=refresh)
            token.blacklist()
            return Response("logout successfully",status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#profile class
class ProfileView(views.APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        try:
            user=request.user
            user=UserSerializer(instance=user)
            return Response(user.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#create event function
class EventClass(generics.CreateAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]

#fetch events by user
class FetchEventByUser(views.APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        try:
            events=Event.objects.filter(posted_by=request.user).all()
            serializer=EventSerializer(events,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#All events for home page
class FetchEventClass(views.APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            events = Event.objects.filter(date__gt=date.today()).order_by("-event_id")
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#update and delete event
class EventUpdateDeleteClass(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = "event_id"

#event register view
class EventViewByUserClass(views.APIView):
    def get(self,request,id):
        try:
            event=Event.objects.filter(event_id=id).first()
            serializer=EventSerializer(instance=event)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#user register event
class RegisterEventClass(views.APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            serializer = AttendanceSerializer(data=request.data)
            if serializer.is_valid():
                attendance = serializer.save()
                sendMail(
                    from_email="noreply@gmail.com",
                    to_email=attendance.email,
                    subject=f"{attendance.event.title} registered successfully",
                    image_url=attendance.event.image,
                    number=attendance.att_id
                )
                return Response(
                    {"message": "Registered successfully, ticket sent to your email"},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response({"message":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#list all the user register for that event
class GetRegisterUsersForEachClass(views.APIView):
    permission_classes = [AllowAny]
    def get(self, request, id):
        try:
            attendance = Attendance.objects.filter(event=id).all()
            serializer = AttendanceSerializer(attendance, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        